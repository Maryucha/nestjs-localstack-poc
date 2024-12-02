import { Module } from '@nestjs/common';
import { S3Controller } from './s3.controller';
import { S3Service } from './s3.service';
import { AwsConfigModule } from '../aws-config/aws-config.module';

@Module({
  imports: [AwsConfigModule],
  controllers: [S3Controller],
  providers: [S3Service],
})
export class S3Module {}
