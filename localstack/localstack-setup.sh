#!/bin/sh
echo "Inicializando LocalStack e configurando serviços..."

# Definir a região desejada
REGION="us-east-1"

# Configurar S3
echo "Criando bucket S3 na região $REGION..."
awslocal s3 mb s3://mybucket --region $REGION --endpoint-url=http://localhost:4566

# Configurar SQS
echo "Criando fila SQS na região $REGION..."
awslocal sqs create-queue --queue-name my-app-queue --region $REGION --endpoint-url=http://localhost:4566

# Configurar SES
echo "Verificando identidade SES na região $REGION..."
awslocal ses verify-email-identity --email-address app@demo.com --region $REGION --endpoint-url=http://localhost:4566

echo "Configuração concluída."
