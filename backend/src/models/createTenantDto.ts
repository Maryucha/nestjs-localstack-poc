/**
 * DTO para criação de tenants.
 */
export class CreateTenantDto {
  /**
   * Nome do tenant.
   */
  public name!: string;

  /**
   * Parent do tenant.
   */
  public parent!: string;
}
