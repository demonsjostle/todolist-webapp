# FROM node:latest
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build
# CMD ["npm", "start"]
#

FROM node:18-alpine AS builder
WORKDIR /app
COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npm run build

FROM node:18-alpine AS runner
WORKDIR /app
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/public ./public
CMD ["node", "server.js"]




