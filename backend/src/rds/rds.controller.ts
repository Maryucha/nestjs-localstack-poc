import { Body, Controller, Get, Post } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';
import { RdsService } from './rds.service';
import { CreateTenantDto } from '../models/createTenantDto';

/**
 * Controlador para gerenciar tenants no RDS.
 */
@Controller('rds')
export class RdsController {
  /**
   * Construtor do controlador RDS.
   * @param {RdsService} rdsService - Serviço RDS injetado.
   */
  public constructor(private readonly rdsService: RdsService) {}

  /**
   * Endpoint para criar um novo tenant.
   * @param {CreateTenantDto} body - Dados do tenant a ser criado.
   * @returns {Promise<Tenant>} - Tenant criado.
   */
  @Post()
  public async createTenant(@Body() body: CreateTenantDto): Promise<Tenant> {
    return this.rdsService.createTenant(body.name, body.parent);
  }

  /**
   * Endpoint para listar todos os tenants.
   * @returns {Promise<Tenant[]>} - Lista de tenants.
   */
  @Get()
  public async getAllTenants(): Promise<Tenant[]> {
    return this.rdsService.findAllTenants();
  }
}
