let blockedList = [];

function extractHostname(hostname) {
  return (hostname || "").replace(/^www\./i, "").toLowerCase();
}

function matchesBlocked(hostname) {
  const h = extractHostname(hostname);
  for (const d of blockedList) {
    if (h === d || h.endsWith("." + d)) return true;
  }
  return false;
}

function injectOverlay() {
  if (document.getElementById("site-blocker-overlay")) return;
  const overlay = document.createElement("div");
  overlay.id = "site-blocker-overlay";
  overlay.style.position = "fixed";
  overlay.style.top = "0";
  overlay.style.left = "0";
  overlay.style.width = "100%";
  overlay.style.height = "100%";
  overlay.style.zIndex = "2147483647";
  overlay.style.background = "white";
  overlay.style.display = "flex";
  overlay.style.flexDirection = "column";
  overlay.style.justifyContent = "center";
  overlay.style.alignItems = "center";
  overlay.style.fontFamily = "system-ui, Arial";
  overlay.innerHTML = `
    <div style="text-align:center; max-width:90%; padding:20px;">
      <h1 style="margin:0 0 12px 0; font-size:28px;">This site is blocked</h1>
      <p style="margin:0 0 18px 0; color:#444;">You've blocked access to this site.</p>
      <div style="font-size:13px; color:#666; margin-bottom:14px;">To remove the block, open the extension popup and remove the site.</div>
      <button id="site-blocker-return" style="padding:8px 14px; border-radius:6px; border:1px solid #ccc; cursor:pointer;">Go back</button>
    </div>
  `;
  document.documentElement.appendChild(overlay);
  const btn = overlay.querySelector("#site-blocker-return");
  btn.addEventListener("click", () => {
    try {
      if (window.history.length > 1) window.history.back();
      else window.location.href = "about:blank";
    } catch (e) {
      window.location.href = "about:blank";
    }
  });
}

function removeOverlay() {
  const el = document.getElementById("site-blocker-overlay");
  if (el) el.remove();
}

function checkBlocking() {
  try {
    const hostname = window.location.hostname;
    if (!hostname) return;
    if (matchesBlocked(hostname)) {
      injectOverlay();
    } else {
      removeOverlay();
    }
  } catch (e) {
  }
}

chrome.storage.local.get({ blocked: [] }, (res) => {
  blockedList = res.blocked || [];
  checkBlocking();
});

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg && msg.type === "update-blocked") {
    blockedList = msg.blocked || [];
    checkBlocking();
    sendResponse({ ok: true });
  }
});
