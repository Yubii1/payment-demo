# Payment Integration Demo

A static pricing/checkout page demoing a real **Paystack** payment integration — built to show clients how a live checkout flow feels, end to end, without needing a backend.

🔗 **Live demo:** [https://payment-demo-xi.vercel.app/]

![status](https://img.shields.io/badge/status-demo-blue) ![stack](https://img.shields.io/badge/stack-HTML%20%7C%20CSS%20%7C%20JS-informational)

---

## What this is

This project is **not** a real store — it's a learning/demo project built to practice and showcase payment integration for a client who wanted to see how checkout would actually behave before committing to a full build.

It uses [Paystack's Inline JS (v2)](https://paystack.com/docs/developer-tools/inlinejs/) in **test mode**, so no real money ever moves.

## Features

- **Email gate** — visitors enter their email once on page load before the pricing page unlocks (stored for the session).
- **6 pricing tiers** — each with its own accent color and an "Activate" button.
- **Live Paystack checkout popup** — clicking Activate opens a real Paystack test-mode transaction popup, not a mockup.
- **Success / cancel / error handling** — button states and alerts reflect what Paystack actually returns.
- **Zero backend, zero build step** — plain HTML/CSS/JS, deployable as-is to any static host.

## Tech stack

| Layer | Tool |
|---|---|
| Markup / styling | HTML5, CSS3 (Google Fonts: Poppins) |
| Payment | [Paystack Inline JS v2](https://js.paystack.co/v2/inline.js) |
| Hosting | [Vercel](https://vercel.com) |

## Project structure

```
├── index.html      # Page markup, email gate, pricing cards
├── flexweb.css      # Styling
├── payments.js      # Email-gate logic + Paystack checkout wiring
└── README.md
```

## Running it locally

1. Clone the repo:
   ```bash
   git clone https://github.com/Yubii1/payment-demo.git
   cd payment-demo
   ```
2. Get a free **test public key** from your [Paystack dashboard](https://dashboard.paystack.com) under *Settings → API Keys & Webhooks*.
3. Open `payments.js` and replace the placeholder:
   ```js
   const PAYSTACK_PUBLIC_KEY = "pk_test_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX";
   ```
4. Serve the folder with a local server (don't just double-click the HTML file — the Paystack popup needs `http://`, not `file://`):
   ```bash
   npx serve .
   # or use the VS Code "Live Server" extension
   ```
5. Open the printed local URL, enter an email, pick a plan, and pay with a Paystack **test card**:

   | Field | Value |
   |---|---|
   | Card number | `4084 0840 8408 4081` |
   | CVV | `408` |
   | Expiry | any future date |
   | PIN | `0000` |
   | OTP | `123456` |

## Deploying

This is a static site — no build step needed.

- **Vercel:** run `npx vercel` from the project folder, or drag the folder into the Vercel dashboard.
- Make sure `index.html` sits at the project root so Vercel serves it automatically.

## ⚠️ Important note on production use

This demo intentionally keeps everything client-side for simplicity. A real production integration should **never** stop there:

- The `onSuccess` callback in the browser is a UX signal only — it is **not proof of payment** and can be spoofed.
- A real backend should call Paystack's `/transaction/initialize` (with the **secret key**, server-side only) and confirm every transaction via `/transaction/verify/:reference` before marking an order as paid.

This repo is a front-end checkout-flow demo, not a payment backend reference implementation.

## License

MIT — feel free to fork and adapt for your own demos.
