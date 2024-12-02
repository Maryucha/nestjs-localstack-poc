#!/bin/sh
echo "Inicializando LocalStack e configurando serviços..."

# Configurar S3
echo "Criando bucket S3..."
awslocal s3 mb s3://mybucket --endpoint-url=http://localhost:4566

# Configurar SQS
echo "Criando fila SQS..."
awslocal sqs create-queue --queue-name my-app-queue --endpoint-url=http://localhost:4566

# Configurar SES
echo "Verificando identidade SES..."
awslocal ses verify-email-identity --email-address app@demo.com --endpoint-url=http://localhost:4566

echo "Configuração concluída."
