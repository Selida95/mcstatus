FROM node:15-alpine

WORKDIR .
COPY package*.json ./

RUN npm ci 
#--only=production

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
