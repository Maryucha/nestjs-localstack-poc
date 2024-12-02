import { Module } from '@nestjs/common';
import { SesService } from './ses.service';
import { SesController } from './ses.controller';
import { AwsConfigModule } from '../aws-config/aws-config.module';

@Module({
  imports: [AwsConfigModule],
  providers: [SesService],
  controllers: [SesController],
})
export class SesModule {}
