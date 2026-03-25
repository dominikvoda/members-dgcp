# DGCP Members Portal

Club management portal for Discgolf Club Prague. Authenticates via OAuth against [tagovacka.cz](https://tagovacka.cz).

## Setup

```bash
npm install
npm run dev
```

App runs on [http://localhost:5174](http://localhost:5174).

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:8080` |
| `VITE_OAUTH_CLIENT_ID` | OAuth app client ID | - |
| `VITE_OAUTH_AUTHORIZE_URL` | Tagovacka OAuth authorize URL | `http://localhost:5173/oauth/authorize` |

## Production

```
VITE_API_URL=https://api-discgolf-tags.dominikvoda.com
VITE_OAUTH_CLIENT_ID=<your_client_id>
VITE_OAUTH_AUTHORIZE_URL=https://tagovacka.cz/oauth/authorize
```
