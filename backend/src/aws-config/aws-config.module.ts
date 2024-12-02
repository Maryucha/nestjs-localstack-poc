import { Module } from '@nestjs/common';
import { AwsConfigService } from './aws-config-service';

@Module({
  providers: [AwsConfigService],
  exports: [AwsConfigService], // Exporta para ser usado em outros módulos
})
export class AwsConfigModule {}
