# 📚 ProjectEnglish

**ProjectEnglish** is an AI‑powered English learning platform delivering interactive quizzes, real‑time chatbot support, and multimedia exercises. It’s built with a clean, scalable architecture and modern technologies to ensure high performance, security, and ease of maintenance.

---

## 🛠️ Tech Stack

### Backend
- **ASP.NET Core 8 Web API** – RESTful HTTP APIs with .NET 8  
- **MongoDB** – Document‑oriented NoSQL database  
- **Redis** – In‑memory store for caching and session data  

### Frontend
- **React** + **Vite** – Fast development and build toolchain  

### Infrastructure & DevOps
- **Docker** – Containerization of backend, frontend, and auxiliary services  
- **NGINX** – Reverse proxy, TLS termination, and load balancing  
- **CloudFlare** – DNS management, CDN, DDoS protection, and SSL  
- **Cloudinary** – Media storage and optimization (images, audio)  

### Domain
🔗 Live Website: [https://ksth.id.vn](https://ksth.id.vn)




 ✨ Features

- 🔐 JWT Authentication & Role-based Access
- 🧠 AI-powered chatbot for English practice
- 📝 Multiple-choice quizzes with answers
- 🎙️ Audio/Image upload via Cloudinary
- ⚡ Redis caching for performance
- 📊 Admin dashboard to manage content


## 🌐 High‑Level Architecture

```text
            ┌───────────┐         ┌────────────┐
 User → Cloudflare CDN → NGINX → Docker Network / 
                               ├─ ASP.NET Core 8 API (backend)
                               ├─ React + Vite (frontend)
                               ├─ MongoDB Replicaset
                               └─ Redis 


