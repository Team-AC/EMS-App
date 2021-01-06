# pull official base image
FROM node:14.15.3

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci

COPY . ./

# build app
CMD npm run build
