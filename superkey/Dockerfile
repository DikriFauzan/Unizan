FROM node:18-alpine
WORKDIR /app
COPY src/ ./src
RUN npm init -y && npm install express body-parser axios
EXPOSE 9100
CMD ["node","src/index.js"]
