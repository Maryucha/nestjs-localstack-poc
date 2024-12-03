import { Injectable } from '@nestjs/common';
import {
  ListIdentitiesCommand,
  SendEmailCommand,
  SESClient,
} from '@aws-sdk/client-ses';
import { AwsConfigService } from '../aws-config/aws-config-service';

/**
 * Serviço para gerenciar operações do SES.
 */
@Injectable()
export class SesService {
  private readonly sesClient: SESClient;

  /**
   * Construtor do serviço SES.
   * @param {AwsConfigService} awsConfigService - Serviço de configuração AWS injetado.
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    this.sesClient = new SESClient({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: this.awsConfigService.endpoint || undefined,
    });
  }

  /**
   * Envia um e-mail utilizando o SES.
   * @param {string} from - Endereço do remetente.
   * @param {string[]} to - Lista de endereços dos destinatários.
   * @param {string} subject - Assunto do e-mail.
   * @param {string} body - Conteúdo da mensagem.
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
      console.log(`E-mail enviado com sucesso. ID: ${result.MessageId}`);
    } catch (error) {
      console.error('Erro ao enviar e-mail:', error);
      throw error;
    }
  }

  /**
   * Lista as identidades configuradas no SES.
   * @returns {Promise<any[]>} - Lista de identidades SES.
   */
  public async listIdentities(): Promise<any[]> {
    try {
      const command = new ListIdentitiesCommand({});
      const response = await this.sesClient.send(command);
      return response.Identities || [];
    } catch (error) {
      console.error('Erro ao listar identidades SES:', error);
      throw error;
    }
  }
}
