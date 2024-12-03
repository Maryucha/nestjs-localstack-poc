import { Body, Controller, Get, Post } from '@nestjs/common';
import { SesService } from './ses.service';

/**
 * Controlador para gerenciar operações do SES.
 */
@Controller('ses')
export class SesController {
  /**
   * Construtor do controlador.
   * @param {SesService} sesService - Serviço SES injetado.
   */
  public constructor(private readonly sesService: SesService) {}

  /**
   * Endpoint para enviar um e-mail.
   * @param {any} body - Corpo do e-mail contendo remetente, destinatários, assunto e mensagem.
   * @returns {Promise<object>} - Confirmação de envio.
   */
  @Post('send')
  async sendEmail(@Body() body: any): Promise<object> {
    const { from, to, subject, message } = body;

    if (!from || !to || !subject || !message) {
      throw new Error(
        'Parâmetros "from", "to", "subject" e "message" são obrigatórios.',
      );
    }

    await this.sesService.sendEmail(from, to, subject, message);
    return { message: 'E-mail enviado com sucesso!' };
  }

  /**
   * Endpoint para listar identidades SES.
   * @returns {Promise<any[]>} - Lista de identidades SES.
   */
  @Get('list-identities')
  public async listIdentities(): Promise<any[]> {
    return await this.sesService.listIdentities();
  }
}
