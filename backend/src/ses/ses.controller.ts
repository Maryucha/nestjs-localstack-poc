import { Body, Controller, Get, Post } from '@nestjs/common';
import { SesService } from './ses.service';

@Controller('ses')
export class SesController {
  /**
   * Construtor do controller.
   * @param {SesService} sesService - Injeção do serviço de mensagens.
   */
  public constructor(private readonly sesService: SesService) {}

  /**
   * Método que envia o email.
   * @param {any} body - corpo da do email.
   * @returns {Promise<object>} - { message: 'E-mail enviado com sucesso!' }
   */
  @Post('send')
  async sendEmail(@Body() body: any): Promise<object> {
    const { from, to, subject, message } = body;
    await this.sesService.sendEmail(from, to, subject, message);
    return { message: 'E-mail enviado com sucesso!' };
  }

  @Get('list-identities')
  public async listIdentities() {
    return await this.sesService.listIdentities();
  }
}
