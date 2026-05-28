# Clarke Onboarding

Plataforma interna de onboarding de colaboradores da Clarke Energia.

## Estrutura

```
clarke-onboarding/
├── frontend/   → React + Vite + Tailwind + Foton DS
└── backend/    → NestJS + Firebase Admin SDK
```

## Setup rápido

### Backend
```bash
cd backend
cp .env.example .env     # preencher com credenciais Firebase
npm install
npm run start:dev         # http://localhost:3000
# Swagger: http://localhost:3000/api/docs
```

### Frontend
```bash
cd frontend
cp .env.example .env     # preencher com config Firebase e URL da API
npm install
npm run dev               # http://localhost:5173
```

## Variáveis de ambiente

### backend/.env
| Variável | Descrição |
|---|---|
| FIREBASE_PROJECT_ID | ID do projeto Firebase |
| FIREBASE_CLIENT_EMAIL | E-mail da service account |
| FIREBASE_PRIVATE_KEY | Chave privada da service account |
| FIREBASE_STORAGE_BUCKET | Bucket do Storage |
| SMTP_HOST / SMTP_PORT / SMTP_USER / SMTP_PASS | Config de e-mail para 2FA |
| FRONTEND_URL | URL do frontend (CORS) |

### frontend/.env
| Variável | Descrição |
|---|---|
| VITE_API_URL | URL base da API (ex: http://localhost:3000/api/v1) |
| VITE_FIREBASE_* | Credenciais do Firebase SDK cliente |
