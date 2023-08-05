FROM node:alpine
RUN mkdir -p /app
WORKDIR /app
COPY ./package.json ./package.json
COPY ./debug.sh ./debug.sh
ENV APP_PORT=3002
ENV OT_AGENT_HOST=http://otagent:4318
EXPOSE 3002
CMD ["node", "dist/index.js"]