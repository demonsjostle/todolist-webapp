# ใช้ Node.js เป็น base image
FROM node:18-alpine AS builder

# กำหนด working directory
WORKDIR /app

# คัดลอก package.json และ package-lock.json
COPY package.json package-lock.json ./

# ติดตั้ง dependencies
RUN npm install

# คัดลอกไฟล์ที่เหลือ
COPY . .

# สร้างโปรเจกต์ Next.js สำหรับ production
RUN npm run build

# สร้างไฟล์ที่พร้อมใช้งานสำหรับการ deploy
FROM node:18-alpine

WORKDIR /app

# คัดลอกไฟล์ที่สร้างจากขั้นตอน builder
COPY --from=builder /app /app

# เปิดพอร์ตสำหรับการเชื่อมต่อ
EXPOSE 3000

# รัน Next.js ในโหมด production
CMD ["npm", "start"]
