import { Injectable } from '@nestjs/common';
import {
  SQSClient,
  SendMessageCommand,
  ReceiveMessageCommand,
  DeleteMessageCommand,
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
    const queueConfig = this.awsConfigService.getQueueUrlConfig(
      'sqs',
      'default',
    );
    this.sqsClient = new SQSClient({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: queueConfig.endpoint,
    });
  }

  /**
   * Obtém a configuração da fila.
   * @param {string} queueName - Nome da fila.
   * @returns {QueueUrl} - Configuração da fila.
   */
  private getQueueConfig(queueName: string): QueueUrl {
    return this.awsConfigService.getQueueUrlConfig('sqs', queueName);
  }

  /**
   * Função para enviar a mensagem ao serviço SQS.
   * @param {string} queueName - Nome da fila.
   * @param {string} message - Mensagem a ser enviada.
   */
  public async sendMessage(queueName: string, message: string): Promise<void> {
    const queueConfig = this.getQueueConfig(queueName);
    const params = {
      QueueUrl: queueConfig.endpoint,
      MessageBody: message,
    };

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
        console.log(`Nenhuma mensagem encontrada.`);
        return [];
      }
    } catch (error) {
      console.error(`Erro ao receber mensagens:`, error);
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
    // Simulando o processamento (exemplo: salvar no banco de dados)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Mensagem processada com sucesso.`);
  }
}
