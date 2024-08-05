FROM node:18.17.0

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

COPY data/ /data/

ENV USERDB_PATH=/data/userdb.db
ENV PARTSDB_PATH=/data/partsdb.db
ENV PORT=5000
ENV SECRET=secret
ENV LABOR_RATE=200

CMD ["node", "server.js"]