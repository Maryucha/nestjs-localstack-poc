import { Module } from '@nestjs/common';
import { RdsService } from './rds.service';
import { RdsController } from './rds.controller';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { Tenant } from './entities/tenant.entity';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: () => ({
        type: 'postgres',
        host: process.env.DATABASE_HOST || 'localhost',
        port: parseInt(process.env.DATABASE_PORT || '5432', 10),
        username: process.env.DATABASE_USER || 'admin',
        password: process.env.DATABASE_PASSWORD || 'password123',
        database: process.env.DATABASE_NAME || 'dev_rds',
        schema: process.env.DATABASE_SCHEMA || 'public',
        autoLoadEntities: true,
        synchronize: true,
      }),
    }),
    TypeOrmModule.forFeature([Tenant]),
  ],
  providers: [RdsService],
  controllers: [RdsController],
})
export class RdsModule {}
