import { Injectable } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

/**
 * Serviço para gerenciar tenants no RDS.
 */
@Injectable()
export class RdsService {
  /**
   * Construtor do serviço de tenants.
   * @param {Repository<Tenant>} tenantRepository - Repositório de tenants injetado.
   */
  public constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * Método para criar um novo tenant.
   * @param {string} name - Nome do tenant.
   * @param {string} parent - Parent do tenant.
   * @returns {Promise<Tenant>} - Tenant criado.
   */
  async createTenant(name: string, parent: string): Promise<Tenant> {
    const tenant = this.tenantRepository.create({ name, parent });
    return this.tenantRepository.save(tenant);
  }

  /**
   * Método para listar todos os tenants.
   * @returns {Promise<Tenant[]>} - Lista de tenants.
   */
  async findAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }
}
