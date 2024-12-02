## NestJS + LocalStack PoC
Este repositório contém uma Proof of Concept (PoC) que demonstra como configurar e conectar um projeto **NestJS** com o **LocalStack**, simulando serviços AWS para desenvolvimento e testes.

A PoC abrange a configuração de serviços AWS essenciais, como **S3, SQS e SES**, utilizando um módulo de configuração da AWS integrado ao NestJS.

### Pré-requisitos

**Docker**: Certifique-se de que o Docker está instalado e configurado.
**Nest.js**: Requerido para desenvolvimento e execução do projeto backend.
**LocalStack CLI**: Para interagir diretamente com os serviços AWS simulados.

---

### Estrtutura
```bash
/backend                # Código-fonte do backend NestJS
  ├── src/              # Código principal do NestJS
  ├── .env              # Arquivo de variáveis de ambiente do backend
  ├── Dockerfile        # Dockerfile para o backend
/localstack             # Configuração do LocalStack
  ├── .env              # Arquivo de variáveis de ambiente para o LocalStack
  ├── localstack-setup.sh # Script para inicialização e configuração dos serviços no LocalStack
/rest-http              # Exemplos de requisições HTTP para teste
  ├── s3.http           # Requisições de exemplo para S3
  ├── ses.http          # Requisições de exemplo para SES
  ├── sqs.http          # Requisições de exemplo para SQS
docker-compose.yml      # Configuração do Docker Compose para o backend e LocalStack
```
---

### Configuração do Projeto

1. Configure as variáveis de ambiente **LocalStack** Ajuste o arquivo localstack/.env conforme necessário:


```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
```

2. Configure as variáveis de ambiente **Backend** Configure o arquivo backend/.env para o ambiente do backend. Exemplo:

```env
AWS_REGION=us-east-1
AWS_ACCESS_KEY_ID=test
AWS_SECRET_ACCESS_KEY=test
AWS_ENDPOINT=http://localhost:4566
```

3. Inicie os serviços no docker:
```bash
docker-compose up --build
```
---

### Sobre o projeto e seu funcionamento:

**Módulo de Configuração da AWS**

O projeto inclui um módulo de configuração reutilizável para conectar o NestJS a serviços AWS (ou LocalStack). Ele é configurado no backend e fornece instâncias para:

 - S3: Armazenamento de objetos.
 - SQS: Processamento de mensagens em fila.
 - SES: Envio de emails.

**Exemplo de Serviços**:

 - S3: Criação de buckets, upload e listagem de arquivos.
 - SQS: Envio, recebimento e exclusão de mensagens.
 - SES: Envio e listagem de identidades verificadas.

---

#### Testes
Use as requisições HTTP localizadas em rest-http/ para testar os serviços simulados no LocalStack:

- S3: Exemplos em s3.http.
- SQS: Exemplos em sqs.http.
- SES: Exemplos em ses.http.

>Para usar esses arquivos, ferramentas como REST Client para VS Code ou Postman são recomendadas.

---