import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import { SqsService } from './sqs.service';

@Controller('sqs')
export class SqsController {
  constructor(private readonly sqsService: SqsService) {}

  @Post('send')
  async sendMessage(
    @Body() body: { queueUrl: string; message: string },
  ): Promise<string> {
    await this.sqsService.sendMessage(body.queueUrl, body.message);
    return 'Mensagem enviada com sucesso!';
  }

  /**
   * Endpoint para receber mensagens da fila
   * @param queueName Nome da fila (passado como query param)
   */
  @Get('receive')
  async receiveMessages(@Query('queueName') queueName: string): Promise<any[]> {
    return this.sqsService.receiveMessages(queueName);
  }
}
