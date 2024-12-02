import { Module } from '@nestjs/common';
import { SqsModule } from './sqs/sqs.module';
import { AwsConfigModule } from './aws-config/aws-config.module';
import { SesModule } from './ses/ses.module';
import { S3Module } from './s3/s3.module';
import { RdsModule } from './rds/rds.module';

@Module({
  imports: [SqsModule, AwsConfigModule, SesModule, S3Module, RdsModule],
  controllers: [],
  providers: [],
})
export class AppModule {}
