# FacturaBill

FacturaBill is a Next.js application for creating invoices and quotes, generating PDF documents, and sending them by email.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `@react-pdf/renderer` for PDF generation
- AWS SES / Nodemailer for email routes
- AWS Amplify auth config for the login flow

## Project Structure

```text
src/
  app/
    (auth)/          login and registration routes
    (dashboard)/     main product flows: home, invoices, clients, reports
    (legal)/         legal and policy pages
    (marketing)/     landing and SEO-focused pages
    (support)/       support, contact, feedback, help
    api/             server routes for email and support
    globals.css
    layout.tsx
  features/
    invoices/
      components/    PDF invoice templates
public/              PWA manifest, icons, previews, service worker
amplify/             Amplify backend configuration
gradle/              Android/TWA packaging support
```

## Main Areas

- `src/app/(dashboard)` contains the primary app experience.
- `src/features/invoices/components` contains reusable PDF renderers used by invoice pages.
- `src/app/api` contains the small backend surface used by the frontend.

## Commands

```bash
npm run dev
npm run build
npm run start
npm run lint
```

## Cleanup Applied

- Grouped App Router pages by concern using route groups
- Moved invoice PDF components into a dedicated feature folder
- Removed legacy React entry files that were not used by Next.js
- Removed backup `.save` pages and unused helper/components
- Removed local `.next` build output from the workspace

## Notes

- The current app still relies heavily on `localStorage` for business data.
- `npm run lint` still reports pre-existing code quality issues inside active pages; structural cleanup is complete, but the app would benefit from a separate lint and typing pass.
