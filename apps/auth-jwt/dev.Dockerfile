FROM node:alpine
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json ./package.json
COPY ./debug.sh ./debug.sh
ENV APP_PORT=3001
EXPOSE 3001
CMD ["sh", "debug.sh"]