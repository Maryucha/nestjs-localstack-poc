/**
 * DTO para enviar mensagens
 */
export class SendMessageDto {
  /**
   * Nome da fila.
   * @type {string}
   */
  public queueName: string = '';

  /**
   * Mensagem a ser enviada.
   * @type {string}
   */
  public message: string = '';
}
