import { AwsConfigService } from '../aws-config/aws-config-service';
import { Injectable } from '@nestjs/common';
import {
  ListIdentitiesCommand,
  SendEmailCommand,
  SESClient,
} from '@aws-sdk/client-ses';
import { QueueUrl } from '../models/queueUrl.Dto';

@Injectable()
export class SesService {
  private readonly sesClient: SESClient;
  private readonly queueConfig: QueueUrl;

  /**
   * Construtor do serviço do ses.
   * @param {AwsConfigService} awsConfigService - Injeção do serviço de configuração.
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    this.queueConfig = this.getQueueUrl();
    this.sesClient = new SESClient({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: this.queueConfig.endpoint,
    });
  }

  /**
   * Método para enviar o e-mail.
   * @param {string} from - Remetente.
   * @param {string[]} to - Lista dos destinatários.
   * @param {string} subject - Assunto.
   * @param {strng} body - Corpo do email.
   */
  public async sendEmail(
    from: string,
    to: string[],
    subject: string,
    body: string,
  ): Promise<void> {
    const params = {
      Source: from,
      Destination: {
        ToAddresses: to,
      },
      Message: {
        Subject: {
          Data: subject,
        },
        Body: {
          Text: {
            Data: body,
          },
        },
      },
    };

    try {
      const command = new SendEmailCommand(params);
      const result = await this.sesClient.send(command);
      console.log(`E-mail enviado com sucesso, ${result.MessageId}`);
    } catch (error) {
      console.error(`Erro ao enviar email, ${error}`);
      throw error;
    }
  }

  /**
   * Retorna uma lista de e-mails.
   * @returns {Promise<any>} Retorna as mensagens.
   */
  public async listIdentities(): Promise<any> {
    try {
      const command = new ListIdentitiesCommand({});
      const response = await this.sesClient.send(command);
      return response.Identities || [];
    } catch (error) {
      console.error('Erro ao listar identidades SES:', error);
      throw error;
    }
  }

  /**
   * Pega a url, para a mensagem
   * @param {string} queueName - Nome da fila
   */
  private getQueueUrl(): QueueUrl {
    const queDto: QueueUrl = new QueueUrl();

    if (process.env.NODE_ENV == 'dev') {
      queDto.endpoint = `http://localhost:4566/000000000000/`;
      queDto.useQueueUrlAsEndpoint = true;
    } else {
      queDto.endpoint = this.awsConfigService.endpoint
        ? this.awsConfigService.endpoint
        : `https://sqs.${this.awsConfigService.region}.amazonaws.com/${this.awsConfigService.accountId}/`;
    }
    return queDto;
  }
}
