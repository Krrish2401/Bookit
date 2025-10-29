FROM node:20-alpine

RUN apk add --no-cache openssl

WORKDIR /app

COPY package*.json ./

RUN npm ci --only=production

COPY prisma ./prisma

RUN npx prisma generate

COPY tsconfig.json ./
COPY src ./src

RUN npm install typescript @types/node @types/express @types/cors --save-dev && \
    npm run build && \
    npm prune --production

EXPOSE 5000

CMD ["node", "dist/src/server.js"]
