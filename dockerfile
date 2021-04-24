FROM node:15-alpine

WORKDIR .
COPY package*.json ./

RUN if [ "$NODE_ENV" = "development" ]; \
	then npm ci;  \
	else npm ci --only=production; \
	fi

COPY . .

EXPOSE 3000

CMD ["npm", "start"]
