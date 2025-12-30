FROM node:24-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

RUN npx prisma generate
RUN npm run build

CMD ["sh", "-c", "npm run db:deploy && npm run start:prod"]
