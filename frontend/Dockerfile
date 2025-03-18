# FROM node:latest
# WORKDIR /app
# COPY . .
# RUN npm install
# RUN npm run build
# CMD ["npm", "start"]
#


# ใช้ Node.js เป็น base image
FROM node:18-alpine AS builder

# กำหนด working directory
WORKDIR /app

# Copy ไฟล์ที่จำเป็นไปยัง container
COPY package.json package-lock.json ./
RUN npm install

# Copy ไฟล์ทั้งหมดแล้ว build
COPY . .
RUN npm run build

# ใช้ Alpine เพื่อลดขนาด image
FROM node:18-alpine AS runner
WORKDIR /app

# Copy ไฟล์ที่ build มาใช้
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Expose port 3000
EXPOSE 3000

# รันแอป
CMD ["node", "server.js"]
