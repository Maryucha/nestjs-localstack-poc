import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsCommand,
  CreateBucketCommandInput,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../aws-config/aws-config-service';
import { QueueUrl } from './../models/queueUrl.Dto';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly queueConfig: QueueUrl;
  /**
   * Construtor do serviço do S3.
   * @param {AwsConfigService} awsConfigService - Serviço de configuração da AWS.
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    this.queueConfig = this.getQueueUrl();
    this.s3Client = new S3Client({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: this.queueConfig.endpoint || 'http://localhost:4566',
      forcePathStyle: this.queueConfig.forcePathStyle,
    });
  }

  /**
   * Criação de bucket.
   * @param {string} bucketName - Nome do bucket.
   */
  public async createBucket(bucketName: string): Promise<void> {
    try {
      const input: CreateBucketCommandInput = {
        Bucket: bucketName,
      };

      if (this.awsConfigService.region !== 'eu-west-1') {
        input.CreateBucketConfiguration = {
          LocationConstraint: 'eu-west-1',
        };
      }

      console.log(`Criando bucket com entrada: ${JSON.stringify(input)}`);
      const command = new CreateBucketCommand(input);
      const response = await this.s3Client.send(command);

      console.log(
        `Bucket "${bucketName}" criado com sucesso na região "${this.awsConfigService.region}".`,
        response,
      );
    } catch (error) {
      // Verifica se o erro é do tipo esperado
      if (error instanceof Error) {
        console.error(`Erro ao criar bucket "${bucketName}":`, error);

        if ('Code' in error && error.Code === 'InvalidAccessKeyId') {
          console.error('Verifique as credenciais configuradas no LocalStack.');
        } else if ('Code' in error && error.Code === 'BucketAlreadyExists') {
          console.error(
            `O bucket "${bucketName}" já existe. Tente usar outro nome.`,
          );
        } else if (
          'Code' in error &&
          error.Code === 'BucketAlreadyOwnedByYou'
        ) {
          console.error(
            `O bucket "${bucketName}" já foi criado por você anteriormente.`,
          );
        } else {
          console.error(`Erro inesperado: ${(error as any).message}`);
        }
      } else {
        console.error(
          `Erro desconhecido ao criar bucket "${bucketName}":`,
          error,
        );
      }

      throw error;
    }
  }

  /**
   * Envio de arquivo para o bucket.
   * @param {string} bucketName - Nome do bucket.
   * @param {string} key - Caminho/chave do arquivo.
   * @param {Buffer | string} file - Arquivo ou conteúdo a ser enviado.
   */
  public async uploadFile(
    bucketName: string,
    key: string,
    file: Buffer,
  ): Promise<void> {
    try {
      const command = new PutObjectCommand({
        Bucket: bucketName,
        Key: key,
        Body: file,
      });
      await this.s3Client.send(command);
      console.log(
        `Arquivo "${key}" enviado para o bucket "${bucketName}" com sucesso.`,
      );
    } catch (error) {
      console.error(
        `Erro ao enviar arquivo "${key}" para o bucket "${bucketName}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Lista os arquivos de um bucket.
   * @param {string} bucketName - Nome do bucket.
   * @returns {Promise<string[]>} - Lista de nomes dos arquivos.
   */
  public async listFiles(bucketName: string): Promise<string[]> {
    try {
      const command = new ListObjectsCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      const files = response.Contents?.map((file) => file.Key || '') || [];
      console.log(
        `Arquivos no bucket "${bucketName}":`,
        files.length > 0 ? files : 'Nenhum arquivo encontrado.',
      );
      return files;
    } catch (error) {
      console.error(
        `Erro ao listar arquivos no bucket "${bucketName}":`,
        error,
      );
      throw error;
    }
  }

  /**
   * Pega a url, para a mensagem
   */
  private getQueueUrl(): QueueUrl {
    const queDto: QueueUrl = new QueueUrl();

    if (process.env.NODE_ENV == 'dev') {
      queDto.endpoint = `http://localhost:4566`;
      queDto.forcePathStyle = true;
    } else {
      queDto.endpoint = this.awsConfigService.endpoint
        ? this.awsConfigService.endpoint
        : `https://sqs.${this.awsConfigService.region}.amazonaws.com/${this.awsConfigService.accountId}`;
    }
    return queDto;
  }
}
