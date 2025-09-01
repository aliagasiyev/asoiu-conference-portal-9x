# ASOIU Conference Portal (Frontend)

Modern, production‑ready conference submission portal. Authors register, submit papers, upload camera‑ready PDFs, and propose talks. Admins manage topics, paper types, reviewers, and decisions. Frontend is Next.js + TypeScript; backend is Spring Boot (JWT, file upload, reviews) with CORS.

---

## 🚀 Features

- **Author**
  - Register / Login (JWT)
  - My Profile (email + change password)
  - Submit a Paper (metadata, topics, co‑authors, PDF upload)
  - Submit Camera‑Ready (upload + finalize)
  - Submit a Contribution (talk/role proposal)
  - Dashboard with status badges and quick actions
  - “My All Submissions” summary (papers + contributions)
  - Download own files (paper and camera‑ready)

- **Reviewer**
  - See assigned papers with due dates
  - Accept assignment
  - Submit review with decision and comments

- **Admin**
  - Topics: list, create, inline rename, activate/deactivate, guarded delete
  - Paper Types: list, create, inline rename, activate/deactivate, guarded delete
  - Manage reviewers (create reviewer users)
  - Assign reviewers to papers, list assignments and submitted reviews
  - Technical check and final decision for papers

- **UX**
  - Shared top navigation with active state and Admin button (when authorized)
  - Status badges: DRAFT, SUBMITTED, WITHDRAWN, CAMERA_READY_PENDING, CAMERA_READY_SUBMITTED
  - Defensive handling for CORS, 401/403, and FK constraint deletes

---

## 🧩 Architecture

- **Frontend**: Next.js 15 + React 19 + TypeScript, TailwindCSS, Radix UI, Axios
- **Auth**: JWT stored in `localStorage` as `asiou_jwt`; Axios interceptor adds `Authorization: Bearer <token>`
- **Uploads**: `multipart/form-data` for PDFs
- **Env**: `NEXT_PUBLIC_API_URL` configures backend base URL
- **Dev proxy**: `next.config.mjs` rewrites `/api/*` → `${API_PROXY_TARGET || http://localhost:8080}/*`
- **CORS**: backend must allow frontend origin, `Authorization` header, and upload content types

---

## ⚙️ Getting started

1) Prerequisites
- Node 20+, pnpm 9+ (or npm)
- Running backend at `http://localhost:8080` (or change env)

2) Configure environment
```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
# Optional for dev-only proxy (used by Next rewrites)
API_PROXY_TARGET=http://localhost:8080
```

3) Install and run
```bash
pnpm install
pnpm dev    # Next.js dev server (http://localhost:3000)
```

4) Production build
```bash
pnpm build
pnpm start
```

Notes:
- If port 3000 is busy, Next will offer another port or use `-p`.
- Images are unoptimized in `next.config.mjs` to simplify static export and CI.

---

## 🔑 Configuration

- **API base URL**: `NEXT_PUBLIC_API_URL`
- **JWT token key**: `asiou_jwt`
- **Cached user email**: `asiou_user_email`
- **Optional admin cache flags**: may include `asiou_is_admin` depending on UI usage

---

## 🧭 Navigation map (single‑page views)

The app uses a single top‑level page at `app/page.tsx` and switches between client views:
- Dashboard (home)
- My Profile → Change Password
- Submit a Paper
- Submit Camera‑Ready
- Submit a Contribution
- My All Submissions
- Admin (visible for admins)
- Reviewer assignments
- Sign Out

---

## 🛠️ Tools & Tech

- 🧭 Next.js 15
- ⚛️ React 19
- 💙 TypeScript
- 🎨 TailwindCSS + tailwindcss‑animate
- 🧱 Radix UI primitives
- 🔗 Axios
- 🔐 JWT
- ☕ Spring Boot (backend)
- 🗂️ FormData / multipart upload

---

## 📁 Key modules

- `lib/http.ts`: Axios instance with base URL from env and JWT interceptor
- `lib/auth.ts`: login, register, me, forgot/reset password
- `lib/reference.ts`: public reference (topics, paper types)
- `lib/reference-admin.ts`: admin CRUD for topics and paper types
- `lib/papers.ts`: author paper CRUD + upload PDF + submit/withdraw + camera‑ready
- `lib/contributions.ts`: author contributions CRUD
- `lib/admin.ts`: admin paper listing, technical check, final decision, create reviewer
- `lib/reviews.ts`: reviewer flow (assignments, accept, review) and admin review helpers

---

## 🧪 API contracts (used by the UI)

Auth
- POST `/api/auth/login` → `{ accessToken }`
- POST `/api/auth/register` → `{ accessToken }`
- POST `/api/auth/forgot-password` → 204
- POST `/api/auth/reset-password` → 204
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

Contributions (ROLE_USER)
- GET    `/api/contributions` (page,size)
- POST   `/api/contributions` `{ roles[], title, keywords, description, bio, speechType, timeScope, audience, previousTalkUrl? }`
- PUT    `/api/contributions/{id}`
- GET    `/api/contributions/{id}`
- DELETE `/api/contributions/{id}`

Reviewer
- GET  `/api/reviewer/assignments`
- POST `/api/reviewer/assignments/{assignmentId}/accept`
- POST `/api/reviewer/assignments/{assignmentId}/review`
- GET  `/api/reviewer/assignments/{assignmentId}/paper`
- GET  `/api/reviewer/papers`

Admin (papers & reviews)
- GET  `/api/admin/papers`
- GET  `/api/admin/papers/{id}`
- POST `/api/admin/papers/{id}/technical-check` (param `passed=true|false`)
- POST `/api/admin/papers/{id}/final-decision` `{ status: ACCEPTED|REJECTED|REVISIONS_REQUIRED }`
- POST `/api/admin/reviews/papers/{paperId}/assign` `{ reviewerId, dueAt }`
- GET  `/api/admin/reviews/papers/{paperId}/assignments`
- GET  `/api/admin/reviews/papers/{paperId}/reviews`
- POST `/api/admin/users/reviewers` `{ email, password, firstName, lastName }`

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

## 🧱 Project structure (selected)

```
app/
  layout.tsx         # HTML shell, global styles
  page.tsx           # Single-page app view switcher
components/
  ...                # Feature views: login, dashboard, submission, admin, reviewer, etc.
hooks/
  useAuthGuard.ts    # Guard hooks for auth/admin/reviewer
lib/
  http.ts            # Axios base + JWT
  auth.ts            # Auth flows
  papers.ts          # Paper flows
  reference*.ts      # Topics / paper types (public + admin)
  admin.ts           # Admin paper actions & reviewer mgmt
  reviews.ts         # Reviewer flows
public/
  placeholder-*.png/svg/jpg
```

---

## 🧪 Development tips

- Ensure the backend exposes the listed endpoints and enables CORS for the frontend origin.
- When testing uploads with large PDFs, verify backend size limits and multipart config.
- If you switch environments, clear `localStorage` to reset JWT and cached values.

---

## 📄 License

Apache 2.0
