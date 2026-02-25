FROM node:20

WORKDIR /app

COPY frontend/package*.json ./
RUN npm install

COPY frontend .

ENV NEXT_TELEMETRY_DISABLED=1

EXPOSE 3000

CMD ["npm", "run", "dev"]