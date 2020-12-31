# pull official base image
FROM node:14.15.3

# set working directory
WORKDIR /app

# install app dependencies
COPY package.json ./
COPY package-lock.json ./
RUN npm ci
RUN npm install react-scripts@3.4.1 -g

COPY . ./

# build app
RUN npm run build

EXPOSE 5000

# serve app
CMD npm run serve

