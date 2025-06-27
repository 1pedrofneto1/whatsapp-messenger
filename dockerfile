# Base image com Node e suporte a Puppeteer
FROM node:18-bullseye

# Instala Chromium e dependências do sistema
RUN apt-get update && apt-get install -y \
    chromium \
    fonts-liberation \
    libappindicator3-1 \
    libasound2 \
    libatk-bridge2.0-0 \
    libatk1.0-0 \
    libcups2 \
    libdbus-1-3 \
    libgdk-pixbuf2.0-0 \
    libnspr4 \
    libnss3 \
    libx11-xcb1 \
    libxcomposite1 \
    libxdamage1 \
    libxrandr2 \
    libgbm-dev \
    libxshmfence-dev \
    xdg-utils \
    wget \
    ca-certificates \
 && apt-get clean \
 && rm -rf /var/lib/apt/lists/*

# Define o diretório de trabalho
WORKDIR /app

# Copia os arquivos da sua aplicação
COPY . .

# Instala dependências do Node.js
RUN npm install

# Variáveis de ambiente para Puppeteer
ENV PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true
ENV NODE_ENV=production
ENV TZ=America/Sao_Paulo

# Expõe a porta usada pelo seu servidor
EXPOSE 3001

# Inicia a aplicação
CMD ["npm", "start"]
