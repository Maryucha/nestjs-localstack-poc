import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { S3Service } from './s3.service';

@Controller('s3')
export class S3Controller {
  /**
   * Construtor do controller.
   * @param {S3Service} s3Service - Injeção do serviço do s3.
   */
  public constructor(private readonly s3Service: S3Service) {}

  /**
   * Endpoint de criação de bucket.
   * @param {string} bucketName - nome do bucket.
   * @returns {Promise<string>} - Mensaggem com a criação.
   */
  @Post('create-bucket/:bucketName')
  public async createBucket(
    @Param('bucketName') bucketName: string,
  ): Promise<string> {
    await this.s3Service.createBucket(bucketName);
    return `Bucket "${bucketName}" criado com sucesso.`;
  }

  /**
   * Endpoint de upload de um arquivo.
   * @param {string} bucketName - nome do bucket.
   * @param {string} key - chave na qual o arquivo vai ficar.
   * @param {Buffer} file - O arquivo que será quardado.
   * @returns {Promise<string>} - Mensagem retornando o sucesso.
   */
  @Post('upload/:bucketName')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @Param('bucketName') bucketName: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('key') key: string,
  ): Promise<string> {
    console.log(`Recebendo upload para o bucket "${bucketName}"`);
    console.log(`Arquivo recebido:`, file);
    console.log(`Key: ${key}`);
    if (!file || !key) {
      throw new Error('Arquivo e chave (key) são obrigatórios.');
    }

    console.log(`Recebendo upload para o bucket "${bucketName}"`);
    console.log(`Arquivo recebido:`, file);
    console.log(`Key: ${key}`);

    await this.s3Service.uploadFile(bucketName, key, file.buffer);
    return `Arquivo "${key}" enviado com sucesso para o bucket "${bucketName}".`;
  }

  /**
   * Endpoint que lista os arquivos em um bucket.
   * @param {string} bucketName - nome do bucket.
   * @returns {Promise<string>} - Mensagem retornando o sucesso.
   */
  @Get('list/:bucketName')
  public async listFiles(
    @Param('bucketName') bucketName: string,
  ): Promise<string[]> {
    return this.s3Service.listFiles(bucketName);
  }
}
