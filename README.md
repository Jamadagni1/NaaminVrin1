# Naamin Website

Naamin is a static naming-service website (babies, brands, startups, companies, institutions) served via a lightweight Node.js server.

## Requirements

- Node.js `18+` (recommended: latest LTS)

## Quick Start

```bash
npm install
npm start
```

Then open:

- `http://localhost:3000`

## Development Run

```bash
npm run dev
```

## Health Check

```bash
npm run check
```

## Windows One-Click Run

- Double-click `run-local.bat` from the repo folder.
- It opens `http://127.0.0.1:3000` and starts the local server.

## Windows PowerShell Fix (If `npm` is blocked)

If PowerShell shows an execution-policy error for `npm`, use:

```powershell
npm.cmd install
npm.cmd start
```

Or run this once in PowerShell (current user scope):

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

## Optional Environment Variables

- `PORT` (default: `3000`)
- `HOST` (default: `127.0.0.1`)

Example:

```bash
PORT=8080 HOST=0.0.0.0 npm start
```

## Project Notes

- Entry server file: `server.js`
- Main homepage: `index.html`
- Additional pages: `about.html`, `services.html`, `blog.html`, and tools under `more/`
