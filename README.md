# FacturaBill

FacturaBill is a Next.js application for creating invoices and quotes, generating PDF documents, and sending them by email.

## Stack

- Next.js App Router
- React 19
- TypeScript
- Tailwind CSS 4
- `@react-pdf/renderer` for PDF generation
- AWS SES for email routes
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

## Environment Variables

Create a `.env.local` file based on `.env.example`.

- `SES_REGION`: AWS region where SES is configured
- `EMAIL_FROM`: verified SES sender
- `EMAIL_TO`: inbox for support / feedback notifications
- `SES_ACCESS_KEY_ID` and `SES_SECRET_ACCESS_KEY`: optional when deploying with an IAM role
- `NEXT_PUBLIC_GOOGLE_ADS_ID`, `NEXT_PUBLIC_GOOGLE_ADS_CONVERSION_LABEL`, `NEXT_PUBLIC_GOOGLE_ANALYTICS_ID`: optional analytics ids

## AWS Deployment Notes

- `next.config.ts` uses `output: "standalone"`, which is suitable for container or Node deployments on AWS.
- For production on AWS, prefer attaching an IAM role with SES permissions instead of hardcoding access keys.
- Run both `npm run lint` and `npm run build` before packaging the app.

## Cleanup Applied

- Grouped App Router pages by concern using route groups
- Moved invoice PDF components into a dedicated feature folder
- Removed legacy React entry files that were not used by Next.js
- Removed backup `.save` pages and unused helper/components
- Removed local `.next` build output from the workspace

## Notes

- The current app still relies heavily on `localStorage` for business data.
- Business data stored in the browser is not shared across devices or users unless you add a backend persistence layer.
