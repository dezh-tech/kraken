# Stage 1: Build Stage
FROM node:18-alpine AS build

# Set the working directory in the container
WORKDIR /app

# Copy package.json and yarn.lock to the container
COPY package.json yarn.lock ./

# Install project dependencies
RUN yarn install --frozen-lockfile

# Copy the rest of the application code to the container
COPY . .

# Build the Nest.js application
RUN NODE_OPTIONS=--max-old-space-size=8192 yarn build

# Stage 2: Production Stage
FROM node:18-alpine AS production

# Set the working directory in the container
WORKDIR /app

# Copy only the necessary files from the build stage
COPY --from=build /app/dist ./dist
COPY package.json yarn.lock ./

# Install only production dependencies
RUN yarn install --frozen-lockfile --production

# Expose the ports that the Nest.js app will run on
EXPOSE 3000
EXPOSE 50051

# Start the Nest.js application
CMD ["yarn", "start:prod"]
