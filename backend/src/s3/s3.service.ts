import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsCommand,
  CreateBucketCommandInput,
  BucketLocationConstraint,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AwsConfigService } from '../aws-config/aws-config-service';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  /**
   * Construtor do serviço do S3.
   * @param {AwsConfigService} awsConfigService - Serviço de configuração da AWS.
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3Client = new S3Client({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: this.awsConfigService.endpoint || 'http://localhost:4566',
      forcePathStyle: process.env.NODE_ENV === 'dev',
    });
  }

  /**
   * Cria um bucket no S3.
   * @param {string} bucketName - Nome do bucket.
   */
  public async createBucket(bucketName: string): Promise<void> {
    try {
      const input: CreateBucketCommandInput = {
        Bucket: bucketName,
      };
      if (this.awsConfigService.region !== 'us-east-1') {
        input.CreateBucketConfiguration = {
          LocationConstraint: this.awsConfigService
            .region as BucketLocationConstraint,
        };
      }

      console.log(`Criando bucket: ${bucketName}`);
      const command = new CreateBucketCommand(input);
      await this.s3Client.send(command);
      console.log(`Bucket "${bucketName}" criado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao criar bucket "${bucketName}":`, error);
      throw error;
    }
  }

  /**
   * Faz upload de um arquivo para um bucket.
   * @param {string} bucketName - Nome do bucket.
   * @param {string} key - Chave do arquivo.
   * @param {Buffer} file - Conteúdo do arquivo.
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
      console.error(`Erro ao enviar arquivo "${key}":`, error);
      throw error;
    }
  }

  /**
   * Lista os arquivos de um bucket.
   * @param {string} bucketName - Nome do bucket.
   * @returns {Promise<string[]>} - Lista de arquivos no bucket.
   */
  public async listFiles(bucketName: string): Promise<string[]> {
    try {
      const command = new ListObjectsCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      return (
        response.Contents?.map((file) => file.Key || '').filter(Boolean) || []
      );
    } catch (error) {
      console.error(
        `Erro ao listar arquivos no bucket "${bucketName}":`,
        error,
      );
      throw error;
    }
  }
}
