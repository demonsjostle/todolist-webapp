# ใช้ Node.js image สำหรับการ build
FROM node:16-alpine AS builder

# ตั้ง working directory ภายใน container
WORKDIR /app

# คัดลอก package.json และ package-lock.json (หรือ yarn.lock)
COPY ./package.json ./frontend/package-lock.json ./

# ติดตั้ง dependencies
RUN npm install --frozen-lockfile

# คัดลอกไฟล์ทั้งหมดจากโฟลเดอร์ frontend ไปที่ container
COPY ./ ./frontend

# build Next.js project สำหรับ production
RUN npm run build

# สร้าง image ใหม่สำหรับ production ที่จะใช้ Nginx
FROM nginx:alpine

# คัดลอกไฟล์ build จากขั้นตอนก่อนหน้าไปยัง /usr/share/nginx/html ของ Nginx
COPY --from=builder /app/out /usr/share/nginx/html

# คัดลอกไฟล์ Nginx config ที่ต้องการ
COPY ./default.conf /etc/nginx/conf.d/default.conf

# ตั้งค่า environment variables
ENV NODE_ENV=production

# เปิด port 80
EXPOSE 80

# เริ่มต้น Nginx เมื่อ container ทำงาน
CMD ["nginx", "-g", "daemon off;"]
