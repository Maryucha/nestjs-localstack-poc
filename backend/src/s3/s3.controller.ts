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
   * @param {S3Service} s3Service - Injeção do serviço do S3.
   */
  public constructor(private readonly s3Service: S3Service) {}

  /**
   * Endpoint de criação de bucket.
   * @param {string} bucketName - Nome do bucket.
   * @returns {Promise<string>} - Mensagem de sucesso.
   */
  @Post('create-bucket/:bucketName')
  public async createBucket(
    @Param('bucketName') bucketName: string,
  ): Promise<string> {
    if (!bucketName) {
      throw new Error('O nome do bucket é obrigatório.');
    }
    await this.s3Service.createBucket(bucketName);
    return `Bucket "${bucketName}" criado com sucesso.`;
  }

  /**
   * Endpoint de upload de um arquivo.
   * @param {string} bucketName - Nome do bucket.
   * @param {Express.Multer.File} file - Arquivo a ser enviado.
   * @param {string} key - Chave para salvar o arquivo.
   * @returns {Promise<string>} - Mensagem de sucesso.
   */
  @Post('upload/:bucketName')
  @UseInterceptors(FileInterceptor('file'))
  public async uploadFile(
    @Param('bucketName') bucketName: string,
    @UploadedFile() file: Express.Multer.File,
    @Body('key') key: string,
  ): Promise<string> {
    if (!file || !key) {
      throw new Error('Arquivo e chave (key) são obrigatórios.');
    }

    await this.s3Service.uploadFile(bucketName, key, file.buffer);
    return `Arquivo "${key}" enviado com sucesso para o bucket "${bucketName}".`;
  }

  /**
   * Endpoint para listar arquivos em um bucket.
   * @param {string} bucketName - Nome do bucket.
   * @returns {Promise<string[]>} - Lista de arquivos.
   */
  @Get('list/:bucketName')
  public async listFiles(
    @Param('bucketName') bucketName: string,
  ): Promise<string[]> {
    return this.s3Service.listFiles(bucketName);
  }
}
