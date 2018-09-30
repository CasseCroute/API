FROM starefossen/ruby-node:alpine

# Install additional dependencies
RUN apk --update add openssl ca-certificates

RUN apk --update add ruby-dev automake libtool python libffi-dev alpine-sdk

RUN apk --update add --virtual build-dependencies

# Install Apiary CLI
RUN gem update --system
RUN gem install apiaryio

# Add global CLIs
RUN yarn global add tslint typescript tsc-resolve typeorm jest dredd

RUN mkdir -p /LetsEat/API

WORKDIR /LetsEat/API

COPY package.json /LetsEat/API

COPY . /LetsEat/API

# Install Yarn dependencies
RUN yarn install

EXPOSE 8080

CMD yarn build && yarn serve
