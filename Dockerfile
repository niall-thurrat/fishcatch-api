FROM node:16-alpine
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY . .
COPY --chown=node:node . .
USER node
RUN npm install
EXPOSE 3000
CMD ["node", "app.js"]