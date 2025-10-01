## Environment Configuration

This project splits a web (Next.js) app and an API (NestJS). Configure both sides with explicit origins and URLs.

### Web App (Next.js)

Set the API base URL used by the browser:

```env
NEXT_PUBLIC_API_URL=https://your-api.example.com
```

Use a full absolute URL (scheme + host + optional port). This value is consumed by client components via `fetch`.

Local example:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

### API (NestJS)

Set the allowed web origin for CORS. Do not use wildcards for GET.

```env
WEB_ORIGIN=https://your-web.example.com
```

Local example:

```env
WEB_ORIGIN=http://localhost:3001
```

### Deployment Notes

- Ensure `WEB_ORIGIN` on the API exactly matches your deployed web origin.
- Ensure `NEXT_PUBLIC_API_URL` on the web points to your deployed API base URL.
- On Render, configure these as service environment variables. `render.yaml` already includes an entry for `WEB_ORIGIN`.

