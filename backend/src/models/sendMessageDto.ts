/**
 * DTO para enviar mensagens
 */
export class SendMessageDto {
  /**
   * Nome da fila.
   * @type {string}
   */
  queueName: string;

  /**
   * Mensagem a ser enviada.
   * @type {string}
   */
  message: string;
}
