import { Module } from '@nestjs/common';
import { SqsService } from './sqs.service';
import { SqsController } from './sqs.controller';
import { AwsConfigModule } from '../aws-config/aws-config.module';

@Module({
  imports: [AwsConfigModule],
  providers: [SqsService],
  controllers: [SqsController],
})
export class SqsModule {}
