# THIS NEEDS TO BE UPDATED TO CONFORM TO NEW WEBPACK FILE STRUCTURE
# inherit from node version 17 package
FROM node:16.16.0
# establish a working directory
WORKDIR /oats
# copy our package files for dependencies
COPY package.json package.json
COPY package-lock.json package-lock.json
# install our dependencies
RUN npm install
# copy our script and application files
COPY . .
# register commands
RUN node ./command-registry.js

# what commands to run once the image is built
CMD [ "node", "oats.js" ]
