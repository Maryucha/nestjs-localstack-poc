import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SendMessageDto } from '../models/sendMessageDto';

@Controller('sqs')
export class SqsController {
  /**
   * Construtor do controller SQS.
   * @param {SqsService} sqsService - Serviço SQS injetado.
   */
  public constructor(private readonly sqsService: SqsService) {}

  /**
   * Endpoint para criar uma fila no SQS.
   * @param {string} queueName - Nome da fila.
   * @returns {Promise<string>} - Mensagem de sucesso.
   */
  @Post('create')
  public async createQueue(
    @Body('queueName') queueName: string,
  ): Promise<string> {
    if (!queueName) {
      throw new Error('O parâmetro "queueName" é obrigatório.');
    }
    await this.sqsService.createQueue(queueName);
    return `Fila "${queueName}" criada com sucesso!`;
  }

  /**
   * Endpoint para enviar uma mensagem a uma fila SQS.
   * @param {SendMessageDto} body - Dados da mensagem e da fila.
   * @returns {Promise<string>} - Confirmação de envio.
   */
  @Post('send')
  public async sendMessage(@Body() body: SendMessageDto): Promise<string> {
    await this.sqsService.sendMessage(body.queueName, body.message);
    return 'Mensagem enviada com sucesso!';
  }

  /**
   * Endpoint para receber mensagens de uma fila SQS.
   * @param {string} queueName - Nome da fila (query param).
   * @returns {Promise<any[]>} - Lista de mensagens recebidas.
   */
  @Get('receive')
  public async receiveMessages(
    @Query('queueName') queueName: string,
  ): Promise<any[]> {
    if (!queueName) {
      throw new Error('O parâmetro "queueName" é obrigatório.');
    }
    return this.sqsService.receiveMessages(queueName);
  }
}
