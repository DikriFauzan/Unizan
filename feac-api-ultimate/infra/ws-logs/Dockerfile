FROM node:18-alpine
WORKDIR /app
COPY package.json package-lock.json* ./
RUN apk add --no-cache bash && npm install || true
COPY . .
CMD ["node", "server.js"]
