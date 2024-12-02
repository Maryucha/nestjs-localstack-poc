import { Injectable } from '@nestjs/common';

@Injectable()
export class AwsConfigService {
  public get region(): string {
    return process.env.AWS_REGION || 'eu-west-1';
  }

  public get accessKeyId(): string {
    return process.env.AWS_ACCESS_KEY_ID || 'test';
  }

  public get secretAccessKey(): string {
    return process.env.AWS_SECRET_ACCESS_KEY || 'test';
  }

  public get endpoint(): string | undefined {
    return process.env.AWS_ENDPOINT; // Em produção, pode ser undefined para usar o endpoint padrão
  }

  public get accountId(): string {
    return process.env.AWS_ACCOUNT_ID || '000000000000';
  }
}
