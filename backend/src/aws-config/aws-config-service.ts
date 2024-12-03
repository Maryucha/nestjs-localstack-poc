import { Injectable } from '@nestjs/common';
import { QueueUrl } from '../models/queueUrl.Dto';

@Injectable()
export class AwsConfigService {
  /**
   * Retorna a região configurada.
   * @returns {string} - Região configurada.
   */
  public get region(): string {
    return process.env.AWS_REGION || 'us-east-1';
  }

  /**
   * Retorna a Access Key ID configurada.
   * @returns {string} - Access Key ID.
   */
  public get accessKeyId(): string {
    return process.env.AWS_ACCESS_KEY_ID || '';
  }

  /**
   * Retorna a Secret Access Key configurada.
   * @returns {string} - Secret Access Key.
   */
  public get secretAccessKey(): string {
    return process.env.AWS_SECRET_ACCESS_KEY || '';
  }

  /**
   * Retorna o endpoint configurado, se disponível.
   * @returns {string | undefined} - Endpoint configurado.
   */
  public get endpoint(): string | undefined {
    return process.env.AWS_ENDPOINT || '';
  }

  /**
   * Retorna o Account ID configurado.
   * @returns {string} - Account ID.
   */
  public get accountId(): string {
    return process.env.AWS_ACCOUNT_ID;
  }

  /**
   * Retorna as configurações da URL do cliente AWS.
   * @param {string} serviceName - Nome do serviço AWS (ex: sqs, s3).
   * @param {string} resourceName - Nome do recurso no serviço.
   * @returns {QueueUrl} - Configuração completa da URL.
   */
  public getQueueUrlConfig(
    serviceName: string,
    resourceName: string,
  ): QueueUrl {
    const queueConfig = new QueueUrl();

    if (process.env.NODE_ENV === 'dev') {
      queueConfig.endpoint = `http://localhost:4566/000000000000/${resourceName}`;
      queueConfig.useQueueUrlAsEndpoint = true;
      queueConfig.forcePathStyle = true;
    } else {
      queueConfig.endpoint = this.endpoint
        ? `${this.endpoint}/${resourceName}`
        : `https://${serviceName}.${this.region}.amazonaws.com/${this.accountId}/${resourceName}`;
      queueConfig.useQueueUrlAsEndpoint = false;
      queueConfig.forcePathStyle = false;
    }

    return queueConfig;
  }
}
