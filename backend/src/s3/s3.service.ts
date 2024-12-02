import {
  S3Client,
  CreateBucketCommand,
  PutObjectCommand,
  ListObjectsCommand,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { AwsConfigService } from 'src/aws-config/aws-config-service';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;

  /**
   * Construtor do serviço do s3.
   * @param {AwsConfigService} awsConfigService - Injeção do serviço de configuração da aws.
   */
  public constructor(private readonly awsConfigService: AwsConfigService) {
    this.s3Client = new S3Client({
      region: this.awsConfigService.region,
      credentials: {
        accessKeyId: this.awsConfigService.accessKeyId,
        secretAccessKey: this.awsConfigService.secretAccessKey,
      },
      endpoint: this.awsConfigService.endpoint || undefined,
      forcePathStyle: true,
    });
  }

  /**
   * Método de criação de buckets.
   * @param {string} bucketName - nome do bucket que vai ser criado. 
   */
  public async createBucket(bucketName: string): Promise<void> {
    try {
      const command = new CreateBucketCommand({ Bucket: bucketName });
      await this.s3Client.send(command);
      console.log(`Bucket "${bucketName}" criado com sucesso.`);
    } catch (error) {
      console.error(`Erro ao criar bucket: ${error.message}`);
      throw error;
    }
  }

  /**
   * Método para envio de arquivos.
   * @param {string} bucketName - nome do bucket que será o caminho.
   * @param {string} key - chave na qual o arquivo vai ficar.
   * @param {Buffer} file - O arquivo que será quardado.
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
      console.log(`Arquivo "${key}" enviado para o bucket "${bucketName}".`);
    } catch (error) {
      console.error(`Erro ao enviar arquivo: ${error.message}`);
      throw error;
    }
  }

  /**
   * Metodo que lista os arquivos em um bucket.
   * @param {string} bucketName - Nome do bucket que quero ver.
   * @returns {Promise<string[]>} - LIsta dos arquivos nesse bucket.
   */
  public async listFiles(bucketName: string): Promise<string[]> {
    try {
      const command = new ListObjectsCommand({ Bucket: bucketName });
      const response = await this.s3Client.send(command);
      return response.Contents?.map((file) => file.Key || '') || [];
    } catch (error) {
      console.error(`Erro ao listar arquivos: ${error.message}`);
      throw error;
    }
  }
}
