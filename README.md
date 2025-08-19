# ASIOU Conference Portal (Frontend)

Modern, production‑ready conference submission portal. Authors register, submit papers, upload camera‑ready PDFs, and propose talks. Admins manage topics and paper types directly in the app. Frontend is Next.js + TypeScript; backend is Spring Boot with JWT, file uploads, and strict CORS.

---

## 🚀 Features

- Author
  - Register / Login (JWT)
  - My Profile (email + change password)
  - Submit a Paper (metadata, topics, co‑authors, PDF upload)
  - Submit Camera‑Ready (upload + finalize)
  - Submit a Contribution (talk/role proposal)
  - Dashboard with status badges and quick actions
  - “My All Submissions” summary (papers + contributions)
  - Download own files (paper and camera‑ready)

- Admin
  - Topics: list, create, inline rename, activate/deactivate, guarded delete
  - Paper Types: list, create, inline rename, activate/deactivate, guarded delete
  - Admin visibility detected via JWT + capability probe

- UX
  - Shared top navigation with active state and Admin button (when authorized)
  - Status badges: DRAFT, SUBMITTED, WITHDRAWN, CAMERA_READY_PENDING, CAMERA_READY_SUBMITTED
  - Defensive handling for CORS, 401/403, and FK constraint deletes

---

## 🖼️ Screenshots

> Place your images under `docs/screenshots/` and update paths.

- Paper submission  
  ![Paper Submission](docs/screenshots/paper-submission.png)

- Contribution form  
  ![Contribution Form](docs/screenshots/contribution-form.png)

- Dashboard  
  ![Dashboard](docs/screenshots/dashboard.png)

- Admin panel  
  ![Admin Reference](docs/screenshots/admin-reference.png)

---

## 🧩 Architecture

- Frontend: Next.js 15 + React 19 + TypeScript, TailwindCSS, Axios
- Auth: JWT (token in `localStorage`), Axios interceptor adds `Authorization: Bearer <token>`
- Uploads: `multipart/form-data` for PDFs
- Env: `NEXT_PUBLIC_API_URL` configures backend base URL
- CORS: backend must allow frontend origin, `Authorization` header, and upload content types

---

## ⚙️ Getting started

1) Prerequisites
- Node 20+, pnpm 9+
- Running backend at `http://localhost:8080` (or change env)

2) Configure environment
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

3) Install and run
```bash
pnpm install
pnpm dev    # http://localhost:3001 if 3000 is busy
```

4) Production build
```bash
pnpm build
pnpm start
```

---

## 🔑 Configuration

- API base URL: `NEXT_PUBLIC_API_URL`
- JWT token key: `asiou_jwt`
- Cached display name key: `asiou_user_name` (set on register/login)
- Admin probe cache: `asiou_is_admin`

---

## 🧭 Navigation map

- My Home (dashboard)
- My Profile → Change Password
- Submit a Paper
- Submit Camera‑Ready
- Submit a Contribution
- My All Submissions
- Admin (visible for admins)
- Sign Out

---

## 🛠️ Tools & Tech

- 🧭 Next.js 15
- ⚛️ React 19
- 💙 TypeScript
- 🎨 TailwindCSS
- 🔗 Axios
- 🔐 JWT
- ☕ Spring Boot (backend)
- 🗂️ FormData / multipart upload

---

## 🧪 API contracts (used by the UI)

Auth
- POST `/api/auth/login` → `{ accessToken }`
- POST `/api/auth/register` → `{ accessToken }`
- GET  `/api/me` → string (email)
- PUT  `/api/me/password` → `{ newPassword }`

Reference (public)
- GET `/api/reference/topics` → `[{ id, name }]`
- GET `/api/reference/paper-types` → `[{ id, name }]`

Admin Reference (ROLE_ADMIN)
- GET  `/api/admin/reference/topics`
- POST `/api/admin/reference/topics` `{ name }`
- PUT  `/api/admin/reference/topics/{id}` `{ name, active? }`
- DELETE `/api/admin/reference/topics/{id}`
- GET  `/api/admin/reference/paper-types`
- POST `/api/admin/reference/paper-types` `{ name }`
- PUT  `/api/admin/reference/paper-types/{id}` `{ name, active? }`
- DELETE `/api/admin/reference/paper-types/{id}`

Papers (ROLE_USER/ADMIN)
- GET    `/api/papers` (page,size)
- POST   `/api/papers` `{ title, keywords, paperAbstract, paperTypeId, topicIds, coAuthors[] }`
- PUT    `/api/papers/{id}`
- GET    `/api/papers/{id}`
- DELETE `/api/papers/{id}`
- POST   `/api/papers/{id}/withdraw`
- POST   `/api/papers/{id}/submit`
- POST   `/api/papers/{id}/submit-camera-ready`
- POST   `/api/papers/{id}/file` (form‑data `file=@paper.pdf`)
- POST   `/api/papers/{id}/camera-ready` (form‑data `file=@camera-ready.pdf`)
- POST   `/api/papers/{id}/co-authors`
- PUT    `/api/papers/{id}/co-authors/{coAuthorId}`
- DELETE `/api/papers/{id}/co-authors/{coAuthorId}`

Contributions
- GET    `/api/contributions` (page,size)
- POST   `/api/contributions` `{ roles[], title, keywords, description, bio, speechType, timeScope, audience, previousTalkUrl? }`
- PUT    `/api/contributions/{id}`
- GET    `/api/contributions/{id}`
- DELETE `/api/contributions/{id}`

Files
- GET `/api/files/{id}` → PDF blob with `Content-Disposition`

Home
- GET `/api/home` → `{ submittedPapers: PaperResponse[], contributions: ContributionResponse[] }`

---

## 🔄 Paper lifecycle

1. Create paper (metadata + topics + co‑authors)
2. Upload PDF
3. Submit → `SUBMITTED`
4. Camera‑ready: upload CR + submit CR → `CAMERA_READY_SUBMITTED`
5. Withdraw → `WITHDRAWN` (where allowed)

Dashboard shows the current status with badges and relevant actions.

---

## 📂 Project structure (selected)
