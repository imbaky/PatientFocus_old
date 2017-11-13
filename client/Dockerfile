# we build frontend files
# need to install angular
FROM node:8-alpine as builder

COPY package.json package-lock.json ./

RUN npm set progress=false && npm config set depth 0 && npm cache clean --force

## Storing node modules on a separate layer will prevent unnecessary npm installs at each build
RUN npm i && mkdir /ng-app && cp -R ./node_modules ./ng-app

WORKDIR /ng-app

COPY . .

## Build the angular app in production mode and store the artifacts in dist folder
RUN npm run build

# now nginx
FROM nginx:1.13.3-alpine

COPY nginx/default.conf /etc/nginx/conf.d/
COPY ./nginx/nginx-selfsigned.crt /etc/ssl/certs/
COPY ./nginx/nginx-selfsigned.key /etc/ssl/private/

# remove default nginx page
RUN rm -fr /usr/share/nginx/html/*

COPY --from=builder /ng-app/dist /usr/share/nginx/html

CMD ["nginx", "-g", "daemon off;"]
