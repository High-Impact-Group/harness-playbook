# api-docs

Generate developer-facing API reference documentation from every API route.

Generate complete API documentation for the project. Read every API route and write developer-friendly reference documentation.

## Process

1. List every API route file.
2. Read each route and extract:
   - HTTP methods
   - Auth requirement: public, authenticated, admin or scheduled job
   - Request body and parameters, with types (from validation schemas if present)
   - Response shape, with types
   - Rate limiting, if applied
   - The route's maximum duration, if set
   - Error responses and status codes

Document only what the code shows. If a detail is not in the code, write "not specified". Do not guess.

## Output format

Group routes by domain: auth, billing, data, AI, admin, scheduled jobs and webhooks.

For each route:

### `POST /api/items`

**Auth:** Authenticated user (session)
**Rate limit:** 30 requests per minute per user
**Max duration:** 15s

**Request:**
```json
{
  "name": "Example item",
  "amount": 50000,
  "status": "open"
}
```

**Response (200):**
```json
{
  "id": "uuid",
  "name": "Example item",
  "amount": 50000,
  "status": "open",
  "created_at": "2026-01-01T00:00:00Z"
}
```

**Errors:**
- `400`: Invalid input (validation failed)
- `401`: Not authenticated
- `429`: Rate limited
- `500`: Server error

---

Also generate:
- **Authentication guide.** How to authenticate API requests to this project.
- **Rate-limit summary.** All limits in one table.
- **Webhook reference.** Every inbound webhook, with its expected payload and how it is verified.
- **Scheduled-job reference.** Every scheduled endpoint, its schedule and its secret requirement.

Save to `docs/api-docs.md`.
