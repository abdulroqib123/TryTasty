const GA_ID = "G-DDLCL6XBQR";
const KEY = "consent-preferences";
const MAX_AGE_DAYS = 365;
const POLICY_URL = "/v3/doc/privacyGerman.html#cookies";
let analyticsLoaded = false;

// Read the saved choice and ignore it if missing or expired
function getConsent() {
  try {
    const saved = JSON.parse(localStorage.getItem(KEY));
    if (!saved) return null;
    const ageDays = (Date.now() - saved.time) / 86400000;
    return ageDays > MAX_AGE_DAYS ? null : saved;
  } catch {
    return null;
  }
}

// Save the visitor's choice with a timestamp
function saveConsent(statistics) {
  try {
    localStorage.setItem(KEY, JSON.stringify({ statistics, time: Date.now() }));
  } catch {}
}

// Load Google Analytics once
function loadAnalytics() {
  if (analyticsLoaded) return;
  analyticsLoaded = true;
  window["ga-disable-" + GA_ID] = false;

  window.dataLayer = window.dataLayer || [];
  function gtag() {
    dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag("js", new Date());
  gtag("config", GA_ID);

  const s = document.createElement("script");
  s.async = true;
  s.src = `https://www.googletagmanager.com/gtag/js?id=${GA_ID}`;
  document.head.appendChild(s);
}

// Stop tracking and remove GA cookies after a decline or withdrawal
function stopAnalytics() {
  window["ga-disable-" + GA_ID] = true;
  const host = location.hostname;
  const domains = [host, "." + host, "." + host.split(".").slice(-2).join(".")];
  const past = "expires=Thu, 01 Jan 1970 00:00:00 GMT";
  document.cookie.split(";").forEach((c) => {
    const name = c.split("=")[0].trim();
    if (!name.startsWith("_ga")) return;
    document.cookie = `${name}=; ${past}; path=/`;
    domains.forEach((d) => {
      document.cookie = `${name}=; ${past}; path=/; domain=${d}`;
    });
  });
}

// Show the banner with two equal buttons
function showBanner() {
  if (document.getElementById("tt-consent")) return;

  const box = document.createElement("div");
  box.id = "tt-consent";
  box.setAttribute("role", "dialog");
  box.setAttribute("aria-label", "Cookie settings");
  box.innerHTML = `
    <style>
      #tt-consent{position:fixed;left:16px;right:16px;bottom:16px;max-width:520px;z-index:9999;background:#111;border:1px solid #333;border-radius:12px;padding:20px;color:#fff;font:14px/1.5 -apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Arial,sans-serif;box-shadow:0 8px 30px rgba(0,0,0,.5)}
      #tt-consent h3{color:#bbb;}
      #tt-consent p{margin:0 0 16px;color:#b3b3b3}
      #tt-consent a{color:#ff6a00}
      #tt-consent .tt-btns{display:flex;gap:10px}
      #tt-consent button{flex:1;padding:12px;border-radius:10px;border:1px solid #ff6a00;background:#1c1c1c;color:#fff;font:inherit;font-weight:600;cursor:pointer}
      #tt-consent button:hover{background:#ff6a00;color:#000}
    </style>
<h3>Cookies and local storage</h3>
<p>
  We use cookies and local storage to analyze usage and to limit how often we
  show promotions for other Scybud products. Rejecting does not affect the app.
  <a href="/v3/doc/privacyGerman.html">Privacy policy</a>
</p>    <div class="tt-btns">
      <button type="button" data-choice="no">Decline</button>
      <button type="button" data-choice="yes">Accept</button>
    </div>`;

  box.addEventListener("click", (e) => {
    const choice = e.target.dataset.choice;
    if (!choice) return;
    const accepted = choice === "yes";
    saveConsent(accepted);
    if (accepted) loadAnalytics();
    else stopAnalytics();
    box.remove();
  });

  document.body.appendChild(box);
}

// Lets a footer link reopen the banner
window.openCookieSettings = showBanner;

// Apply the saved choice or ask for one
function init() {
  const consent = getConsent();
  if (!consent) showBanner();
  else if (consent.statistics) loadAnalytics();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
