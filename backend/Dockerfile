# Etapa 1: Build
FROM node:18 AS build

WORKDIR /usr/src/app

# Copiar apenas os arquivos necessários para o build
COPY package*.json ./

# Instalar dependências
RUN npm install
# Copiar o restante do código para o container
COPY . .

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

# Executar o build do projeto
RUN npm run build

# Etapa 2: Produção
FROM node:18 AS production

WORKDIR /usr/src/app

# Copiar dependências e arquivos de build do estágio anterior
COPY --from=build /usr/src/app/node_modules ./node_modules
COPY --from=build /usr/src/app/dist ./dist
COPY package.json .

# Expor a porta
EXPOSE 3000

# Comando para iniciar a aplicação
CMD ["node", "dist/main.js"]
