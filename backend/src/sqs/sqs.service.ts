import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
  CreateQueueCommand,
} from '@aws-sdk/client-sqs';
import { AwsConfigService } from '../aws-config/aws-config-service';
import { QueueUrl } from '../models/queueUrl.Dto';

@Injectable()
export class SqsService {
  private readonly sqsClient: SQSClient;

  /**
   * Construtor do serviço SQS.
   * @param {AwsConfigService} awsConfigService - Serviço de configuração da AWS.
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    // Garantir que o endpoint e a região estejam definidos corretamente
    const endpoint = this.awsConfigService.endpoint || 'http://localhost:4566';
    const region = this.awsConfigService.region;

    console.log('Inicializando cliente SQS...');
    console.log(`Região configurada: ${region}`);
    console.log(`Endpoint configurado: ${endpoint}`);

    this.sqsClient = new SQSClient({
      region: region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: endpoint,
    });
  }

  /**
   * Obtém a configuração da fila.
   * @param {string} queueName - Nome da fila.
   * @returns {QueueUrl} - Configuração da fila.
   */
  private getQueueConfig(queueName: string): QueueUrl {
    const config = this.awsConfigService.getQueueUrlConfig('sqs', queueName);
    console.log(`Configurações obtidas para a fila: ${JSON.stringify(config)}`);
    return config;
  }

  /**
   * Método para criação de uma fila.
   * @param {string} queueName - Nome da fila a ser criada.
   */
  public async createQueue(queueName: string): Promise<void> {
    const params = {
      QueueName: queueName,
      Attributes: {
        VisibilityTimeout: '60',
      },
    };

    console.log('Parâmetros para criação da fila:', params);

    try {
      const command = new CreateQueueCommand(params);
      const result = await this.sqsClient.send(command);

      console.log(`Fila criada com sucesso. URL original: ${result.QueueUrl}`);
    } catch (error) {
      console.error(`Erro ao criar a fila "${queueName}":`, error);
      throw error;
    }
  }

  /**
   * Função para enviar uma mensagem ao serviço SQS.
   * @param {string} queueName - Nome da fila.
   * @param {string} message - Mensagem a ser enviada.
   */
  public async sendMessage(queueName: string, message: string): Promise<void> {
    const queueConfig = this.getQueueConfig(queueName);

    const params = {
      QueueUrl: queueConfig.endpoint,
      MessageBody: message,
    };

    console.log('Parâmetros para envio de mensagem:', params);

    try {
      const command = new SendMessageCommand(params);
      const result = await this.sqsClient.send(command);
      console.log(`Mensagem enviada com sucesso. ID: ${result.MessageId}`);
    } catch (error) {
      console.error('Erro ao enviar mensagem:', error);
      throw error;
    }
  }

  /**
   * Função para receber mensagens do serviço SQS.
   * @param {string} queueName - Nome da fila.
   * @returns {Promise<any[]>} - Lista de mensagens recebidas.
   */
  public async receiveMessages(queueName: string): Promise<any[]> {
    const queueConfig = this.getQueueConfig(queueName);

    console.log('Parâmetros para recebimento de mensagens:', queueConfig);

    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueConfig.endpoint,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
      });
      const response = await this.sqsClient.send(command);

      if (response.Messages) {
        for (const message of response.Messages) {
          console.log(`Mensagem recebida: ${message.MessageId}`);
          await this.processMessageLogic(message.Body || '');
          await this.deleteMessage(queueName, message.ReceiptHandle || '');
        }
        return response.Messages;
      } else {
        console.log('Nenhuma mensagem encontrada.');
        return [];
      }
    } catch (error) {
      console.error('Erro ao receber mensagens:', error);
      throw error;
    }
  }

  /**
   * Exclui uma mensagem após o processamento.
   * @param {string} queueName - Nome da fila.
   * @param {string} receiptHandle - Handle da mensagem a ser excluída.
   */
  public async deleteMessage(
    queueName: string,
    receiptHandle: string,
  ): Promise<void> {
    const queueConfig = this.getQueueConfig(queueName);

    console.log('Parâmetros para exclusão de mensagem:', {
      QueueUrl: queueConfig.endpoint,
      ReceiptHandle: receiptHandle,
    });

    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueConfig.endpoint,
        ReceiptHandle: receiptHandle,
      });

      await this.sqsClient.send(command);
      console.log('Mensagem excluída com sucesso.');
    } catch (error) {
      console.error('Erro ao excluir mensagem:', error);
      throw error;
    }
  }

  /**
   * Lógica de processamento da mensagem.
   * @param {string} messageBody - Corpo da mensagem.
   */
  private async processMessageLogic(messageBody: string): Promise<void> {
    console.log(`Processando mensagem: ${messageBody}`);
    // Simulação de processamento
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Mensagem processada com sucesso.');
  }
}
