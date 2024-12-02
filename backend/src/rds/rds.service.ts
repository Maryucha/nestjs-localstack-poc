import { Injectable } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RdsService {
  /**
   * Conbstrutor do serviço de tanants.
   * @param {Repository<Tenant>} tenantRepository - Injeção do repositório de tenants.
   */
  public constructor(
    @InjectRepository(Tenant)
    private readonly tenantRepository: Repository<Tenant>,
  ) {}

  /**
   * Mátodo de criação de tenants.
   * @param {string} name - nome do seu tenant.
   * @param {string} parent - parent do tenant.
   * @returns Promise<Tenant>.
   */
  async createTenant(name: string, parent: string): Promise<Tenant> {
    const tenant = this.tenantRepository.create({ name, parent });
    return this.tenantRepository.save(tenant);
  }

  /**
   * Listar todos os tenants.
   * @returns uma lista coms os tenants.
   */
  async findAllTenants(): Promise<Tenant[]> {
    return this.tenantRepository.find();
  }
}
