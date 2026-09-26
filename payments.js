/**
 * Paystack Inline JS (v2) demo integration.
 *
 * ⚠️ DEMO ONLY — pure front-end demo to show a client how the checkout
 * flow feels. Uses a TEST public key, so no real money moves.
 *
 * To go live for real, you'd additionally need a backend that:
 *   1. Calls POST /transaction/initialize with your SECRET key
 *      (never put the secret key in front-end code).
 *   2. Verifies the transaction server-side via
 *      GET /transaction/verify/:reference before marking an order "paid".
 * The "onSuccess" callback below is NOT proof of payment on its own —
 * it's enough for a demo / UI walkthrough only.
 */

// 1. Replace with YOUR OWN Paystack TEST public key
//    (Paystack dashboard → Settings → API Keys & Webhooks → Test Public Key)
const PAYSTACK_PUBLIC_KEY = "pk_test_076f72ec1bbec4ed41026cbee83da00fd7da43f6";

// 2. Currency your demo amounts represent (NGN, GHS, ZAR, KES; USD needs a
//    multi-currency Paystack account).
const CURRENCY = "NGN";

const EMAIL_STORAGE_KEY = "webkit_demo_email";

let capturedEmail = "";

document.addEventListener("DOMContentLoaded", () => {
  const gate = document.getElementById("email-gate");
  const siteContent = document.getElementById("site-content");
  const gateEmailInput = document.getElementById("gate-email");
  const gateContinue = document.getElementById("gate-continue");
  const gateError = document.getElementById("gate-error");
  const headbarUser = document.getElementById("headbar-user");

  // If the visitor already gave an email this session, skip the gate.
  const savedEmail = sessionStorage.getItem(EMAIL_STORAGE_KEY);
  if (savedEmail) {
    unlockSite(savedEmail);
  }

  gateContinue.addEventListener("click", handleGateSubmit);
  gateEmailInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleGateSubmit();
  });

  function handleGateSubmit() {
    const email = gateEmailInput.value.trim();
    if (!isValidEmail(email)) {
      gateError.textContent = "Please enter a valid email address.";
      gateEmailInput.focus();
      return;
    }
    gateError.textContent = "";
    sessionStorage.setItem(EMAIL_STORAGE_KEY, email);
    unlockSite(email);
  }

  function unlockSite(email) {
    capturedEmail = email;
    gate.style.display = "none";
    siteContent.classList.remove("site-hidden");
    if (headbarUser) headbarUser.textContent = email;
  }

  // ---- Pricing card checkout buttons ----
  const plans = document.querySelectorAll(".plan-card");

  plans.forEach((plan) => {
    const button = plan.querySelector(".submitbutton");
    const planName = plan.dataset.plan || "Selected Plan";
    const amount = Number(plan.dataset.amount);

    if (!button || !amount) return;

    button.addEventListener("click", () => {
      if (!capturedEmail) {
        alert("Please enter your email to continue.");
        return;
      }
     

      const originalLabel = button.textContent;
      button.textContent = "Processing...";
      button.style.pointerEvents = "none";

      const popup = new PaystackPop();
      popup.newTransaction({
        key: PAYSTACK_PUBLIC_KEY,
        email: capturedEmail,
        amount: amount * 100, // Paystack expects the smallest currency unit (kobo)
        currency: CURRENCY,
        ref: `demo_${plan.id}_${Date.now()}`,
        metadata: {
          custom_fields: [
            { display_name: "Plan", variable_name: "plan", value: planName },
          ],
        },
        onSuccess: (transaction) => {
          button.textContent = "✓ Activated";
          alert(
            `Payment successful!\nPlan: ${planName}\nReference: ${transaction.reference}\n\n(Test mode — no real money was charged.)`
          );
        },
        onCancel: () => {
          button.textContent = originalLabel;
          button.style.pointerEvents = "auto";
        },
        onError: (error) => {
          button.textContent = originalLabel;
          button.style.pointerEvents = "auto";
          alert("Payment failed: " + error.message);
        },
      });
    });
  });
});

function isValidEmail(value) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}
