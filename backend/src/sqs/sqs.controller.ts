import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SendMessageDto } from 'models/sendMessageDto';

@Controller('sqs')
export class SqsController {
  /**
   * Construtor do controller SQS.
   * @param {SqsService} sqsService - Serviço SQS injetado.
   */
  constructor(private readonly sqsService: SqsService) {}

  /**
   * Endpoint para enviar uma mensagem a uma fila SQS.
   * @param {SendMessageDto} body - Dados da mensagem e da fila.
   * @returns {Promise<string>} - Confirmação de envio.
   */
  @Post('send')
  async sendMessage(@Body() body: SendMessageDto): Promise<string> {
    await this.sqsService.sendMessage(body.queueName, body.message);
    return 'Mensagem enviada com sucesso!';
  }

  /**
   * Endpoint para receber mensagens de uma fila SQS.
   * @param {string} queueName - Nome da fila (query param).
   * @returns {Promise<any[]>} - Lista de mensagens recebidas.
   */
  @Get('receive')
  async receiveMessages(@Query('queueName') queueName: string): Promise<any[]> {
    if (!queueName) {
      throw new Error('O parâmetro "queueName" é obrigatório.');
    }
    return this.sqsService.receiveMessages(queueName);
  }
}
