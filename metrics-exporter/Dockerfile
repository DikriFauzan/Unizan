FROM node:18-alpine
WORKDIR /app
COPY package.json package.json
RUN npm install --production
COPY src ./src
EXPOSE 9200
CMD ["node", "src/index.js"]
