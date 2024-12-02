export const awsConfig = {
  region: 'eu-west-1', // Região padrão para LocalStack
  credentials: {
    accessKeyId: 'test', // Credenciais padrão do LocalStack
    secretAccessKey: 'test',
  },
  s3: {
    endpoint: 'http://localhost:4566', // Porta padrão para S3 no LocalStack
    s3ForcePathStyle: true, // Necessário para o LocalStack
  },
  dynamodb: {
    endpoint: 'http://localhost:4566', // Porta padrão para DynamoDB no LocalStack
  },
  rds: {
    endpoint: 'http://localhost:4566', // Porta padrão para RDS no LocalStack
  },
  sqs: {
    endpoint: 'http://localhost:4566', // Porta padrão para SQS no LocalStack
  },
  ses: {
    endpoint: 'http://localhost:4566', // Porta padrão para SES no LocalStack
  },
};
