FROM registry.mwc.local/node:latest

ENV NODE_ENV=production

# Create app directory
WORKDIR /app

COPY package*.json ./
COPY ./ ./

#RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

RUN npm install --production

EXPOSE 3000

CMD ["npm", "run", "start"]
