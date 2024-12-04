/**
 * Essa classe representa os itens de configuração dos clients do aws
 */
export class QueueUrl {
  /**
   * Endpoint.
   * @type {string}
   */
  public endpoint: string = '';
  /**
   * Nome da fila.
   * @type {boolean}
   */
  public useQueueUrlAsEndpoint?: boolean;
  /**
   * Nome da fila.
   * @type {boolean}
   */
  public forcePathStyle?: boolean;

  /**
   * Nome da região.
   * @type {string}
   */
  public region?: string;
}
