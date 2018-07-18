FROM node:boron

# Create app directory
RUN mkdir -p /usr/esther
WORKDIR /usr/esther

# Install app dependencies
COPY package.json /usr/esther
RUN npm install --production

# Bundle app source
COPY . /usr/esther

# Expose port Express is listening to
EXPOSE 3000

# Run server
CMD [ "npm", "start" ]