# TodoList — Full-Stack Project
## Giới thiệu

TodoList là một ứng dụng **quản lý công việc Full-Stack** gồm **Backend (RESTful API)** và **Frontend (Next.js)**, cho phép người dùng tổ chức và theo dõi công việc theo mô hình **Workspace – Project – Task**.  
Hệ thống hỗ trợ quản lý công việc nhóm một cách rõ ràng, linh hoạt, giúp phân công nhiệm vụ, theo dõi tiến độ và trao đổi trực tiếp trong từng task(kéo thả).

---

## Các tính năng chính

### Quản lý Workspace
- Tạo và quản lý nhiều workspace.
- Mời người dùng tham gia workspace.
- Phân quyền vai trò người dùng trong workspace.

### Quản lý Project
- Tạo, cập nhật và xóa project trong workspace.
- Nhóm các task theo từng project để dễ theo dõi tiến độ.

### Quản lý Task
- Tạo, chỉnh sửa và xóa task.
- Phân công task cho người dùng.
- Cập nhật trạng thái task (**To Do – In Progress – Done**).
- Hỗ trợ kéo thả (Drag & Drop) để thay đổi trạng thái task.

### Bình luận & trao đổi
- Bình luận trực tiếp trên từng task.
- Theo dõi lịch sử trao đổi liên quan đến công việc.

### Xác thực & phân quyền
- Đăng ký, đăng nhập và xác thực người dùng bằng **JWT**.
- Kiểm soát quyền thao tác dựa trên vai trò (creator, assignee).

### Hệ thống thông báo
- Gửi thông báo khi có thay đổi liên quan đến task hoặc project.
- Tích hợp **Firebase / FCM** cho thông báo thời gian thực.

### Quản lý người dùng
- Cập nhật thông tin cá nhân.
- Quản lý vai trò người dùng trong workspace.

---
## Công nghệ sử dụng

### Tech Stack

#### Frontend
[![Next.js](https://img.shields.io/badge/Next.js-15-white?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3-blue?logo=tailwindcss)](https://tailwindcss.com/)
[![React Query](https://img.shields.io/badge/TanStack_Query-5-orange?logo=reactquery)](https://tanstack.com/query)
[![Axios](https://img.shields.io/badge/Axios-1-purple?logo=axios)](https://axios-http.com/)
[![Drag and Drop](https://img.shields.io/badge/Drag--Drop-hello--pangea-dnd-blue)](https://github.com/hello-pangea/dnd)
[![Firebase](https://img.shields.io/badge/Firebase-Client-orange?logo=firebase)](https://firebase.google.com/)

---

#### Backend
[![Node.js](https://img.shields.io/badge/Node.js-18-green?logo=nodedotjs)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5-black?logo=express)](https://expressjs.com/)
[![TypeORM](https://img.shields.io/badge/TypeORM-0.3-red)](https://typeorm.io/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-blue?logo=postgresql)](https://www.postgresql.org/)
[![Redis](https://img.shields.io/badge/Redis-5-red?logo=redis)](https://redis.io/)
[![JWT](https://img.shields.io/badge/JWT-Auth-black?logo=jsonwebtoken)](https://jwt.io/)
[![Firebase](https://img.shields.io/badge/Firebase-Admin-orange?logo=firebase)](https://firebase.google.com/)
[![Cloudinary](https://img.shields.io/badge/Cloudinary-Upload-blue?logo=cloudinary)](https://cloudinary.com/)
[![Nodemailer](https://img.shields.io/badge/Nodemailer-Email-green)](https://nodemailer.com/)
[![Jest](https://img.shields.io/badge/Jest-Test-red?logo=jest)](https://jestjs.io/)

---

### Mô tả công nghệ

**Frontend**
- **Next.js**: Xây dựng giao diện web với App Router, hỗ trợ SSR/CSR.
- **Tailwind CSS**: Thiết kế UI hiện đại và responsive.
- **React Query**: Quản lý state server, caching và đồng bộ dữ liệu.
- **Firebase Client**: Nhận thông báo thời gian thực từ FCM.

**Backend**
- **Express + TypeScript**: Xây dựng RESTful API.
- **TypeORM**: Quản lý database và entity.
- **PostgreSQL**: Lưu trữ dữ liệu chính.
- **Redis**: Cache, rate limit và session.
- **JWT**: Xác thực và phân quyền người dùng.
- **Firebase Admin**: Gửi notification.
- **Cloudinary**: Upload và quản lý file.
---
## Run Locally

Clone the project

```bash
  git clone https://github.com/MenterTho/Todolist
```

Go to the project directory

```bash
  cd folder
```

Create 2 terminal

```bash 
  cd frontend 
```

```bash 
  cd backend 
```


Install dependencies all front end & back end

```bash
  npm install 
```

Start the server frontend & BackEnd

```bash
  npm start
```
---
## Cấu trúc dự án

```bash
todolist-project/
├── backend/                    # API Server (TypeScript)
│   ├── src/
│   │   ├── modules/       # auth, user, project, task, comment,notification, workspace...
│   │   │   ├── auth/
│   │   │   ├── user/
│   │   │   ├── project/
│   │   │   ├── task/
│   │   │   ├── comment/
│   │   │   ├── notification/
│   │   │   └── workspace/
│   │   ├── common/
│   │   │   └── config/         # database, jwt, email, cloudinary, firebase...
│   │   ├── middlewares/
│   │   ├── routes/
│   │   └── server.ts
│   ├── tests/                  # Unit & Integration tests (Jest)
│   ├── package.json
│   ├── tsconfig.json
│   └── jest.config.ts
│
├── frontend/                   # Next.js Application
│   ├── src/
│   │   ├── app/                # App Router
│   │   ├── components/         # UI Components
│   │   ├── hooks/              # Custom Hooks
│   │   ├── services/           # API services
│   │   ├── types/              # TypeScript types
│   │   └── styles/
│   ├── public/
│   └── package.json
│
└── README.md                   # Tài liệu dự án

### ENV

```env
# Database (PostgreSQL)
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASS=your_db_password
DB_NAME=todolist

# JWT
JWT_SECRET=your_jwt_secret
JWT_REFRESH_SECRET=your_jwt_refresh_secret

# Email (SMTP - Gmail App Password)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_email_app_password

# Cloudinary (Upload file)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Firebase / FCM
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_CLIENT_EMAIL=your_firebase_client_email
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nYOUR_KEY\n-----END PRIVATE KEY-----\n"

# App
NODE_ENV=development
USE_ESM=true

## 4. Screenshots
