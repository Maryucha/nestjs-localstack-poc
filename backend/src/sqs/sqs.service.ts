import { QueueUrl } from './../models/queueUrl.Dto';
import { Injectable } from '@nestjs/common';
import {
  DeleteMessageCommand,
  ReceiveMessageCommand,
  SQSClient,
  SendMessageCommand,
} from '@aws-sdk/client-sqs';
import { AwsConfigService } from '../aws-config/aws-config-service';

@Injectable()
export class SqsService {
  private readonly sqsClient: SQSClient;
  private readonly queueConfig: QueueUrl;

  /**
   * Construtor do serviço sqs
   * @param {AwsConfigService} awsConfigService - Injetando SDK da aws
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    this.queueConfig = this.getQueueUrl('my-app-queue');
    this.sqsClient = new SQSClient({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: this.queueConfig.endpoint,
      useQueueUrlAsEndpoint: this.queueConfig.useQueueUrlAsEndpoint,
    });
  }

  /**
   * Função para enviar a mensagem ao serviço sqs.
   * @param {string} queueName - Nome da fila.
   * @param {string} message - Mensagem a ser enviada.
   */
  public async sendMessage(queueName: string, message: string): Promise<void> {
    const queueUrl = this.getQueueUrl(queueName);
    console.log(`ENDPOINT QUE VAI SER MONTADO ---------> ${queueUrl.endpoint}`);
    const params = {
      QueueUrl: queueUrl.endpoint,
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
   * Função para receber as mensagens ao serviço sqs.
   * @param {string} queueName - Nome da fila.
   */
  public async receiveMessages(queueName: string): Promise<any> {
    const queueUrl = this.getQueueUrl(queueName);
    try {
      const command = new ReceiveMessageCommand({
        QueueUrl: queueUrl.endpoint,
        MaxNumberOfMessages: 10,
        WaitTimeSeconds: 5,
      });

      const response = await this.sqsClient.send(command);
      if (response.Messages) {
        for (const message of response.Messages) {
          console.log(`Mensagem recebida: ${message.MessageId}`);

          await this.processMessageLogic(JSON.stringify(message.Body));
          await this.deleteMessage(
            queueName,
            JSON.stringify(message.ReceiptHandle),
          );
        }
        return response.Messages;
      } else {
        console.log(`Nenhuma mensagem encontrada.`);
        return [];
      }
    } catch (error) {
      console.error(`Erro ao receber mensagens. ${error}`);
      throw error;
    }
  }

  /**
   * Exclui uma mensagem após o processamento
   * @param {string} queueName - Nome da fila
   * @param receiptHandle ReceiptHandle da mensagem para exclusão
   */
  public async deleteMessage(
    queueName: string,
    receiptHandle: string,
  ): Promise<void> {
    const queueUrl = this.getQueueUrl(queueName);

    try {
      const command = new DeleteMessageCommand({
        QueueUrl: queueUrl.endpoint,
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
   * Lógica de processamento da mensagem (exemplo)
   * @param {string} messageBody - corpo da mensagem
   */
  private async processMessageLogic(messageBody: string): Promise<void> {
    console.log(`Processando mensagem: ${messageBody}`);
    // Simulando o processamento (exemplo: salvar no banco de dados)
    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log(`Mensagem processada com sucesso.`);
  }

  /**
   * Pega a url, para a mensagem
   * @param {string} queueName - Nome da fila
   */
  private getQueueUrl(queueName: string): QueueUrl {
    const queDto: QueueUrl = new QueueUrl();

    if (process.env.NODE_ENV == 'dev') {
      queDto.endpoint = `http://localhost:4566/000000000000/${queueName}`;
      queDto.useQueueUrlAsEndpoint = true;
    } else {
      queDto.endpoint = this.awsConfigService.endpoint
        ? this.awsConfigService.endpoint
        : `https://sqs.${this.awsConfigService.region}.amazonaws.com/${this.awsConfigService.accountId}/${queueName}`;
    }
    return queDto;
  }
}
