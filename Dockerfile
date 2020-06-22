###############################################################################
# Step 1 : Builder image
#
FROM node:latest AS builder
# Define working directory and copy source
WORKDIR /home/node/app
COPY . .
# Install dependencies and build whatever you have to build
RUN npm install && npm run build
###############################################################################
# Step 2 : Run image
#
FROM node:latest

WORKDIR /home/node/app
# copy necesary files outside the /dist folder
COPY ./package* ./
COPY ./.env ./.env
# Install deps for production only
RUN npm install --production
# Copy builded source from the upper builder stage
COPY --from=builder /home/node/app/dist ./dist
# Expose ports (for orchestrators and dynamic reverse proxies)
EXPOSE 3000:3000
# Start the app
CMD npm start