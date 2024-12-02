import { Body, Controller, Get, Post } from '@nestjs/common';
import { Tenant } from './entities/tenant.entity';
import { RdsService } from './rds.service';

@Controller('rds')
export class RdsController {
  constructor(private readonly rdsService: RdsService) {}

  @Post()
  async createTenant(
    @Body() body: { name: string; parent: string },
  ): Promise<Tenant> {
    return this.rdsService.createTenant(body.name, body.parent);
  }

  @Get()
  async getAllTenants(): Promise<Tenant[]> {
    return this.rdsService.findAllTenants();
  }
}
