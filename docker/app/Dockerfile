FROM starefossen/ruby-node:latest

RUN mkdir -p /LetsEat/API

WORKDIR /LetsEat/API

COPY package.json /LetsEat/API
COPY . /LetsEat/API

# Add global CLIs
RUN yarn global add tslint typescript tsc-resolve typeorm

# Install Yarn dependencies
RUN yarn install

EXPOSE 8080

CMD yarn build && yarn serve
