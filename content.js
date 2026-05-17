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
    document.documentElement.style.overflow = "hidden";

    const overlay = document.createElement("div");
    overlay.id = "site-blocker-overlay";
    overlay.style.cssText = [
        "position:fixed", "top:0", "left:0", "width:100%", "height:100%",
        "z-index:2147483647", "background:white", "display:flex",
        "flex-direction:column", "justify-content:center", "align-items:center",
        "font-family:system-ui, Arial"
    ].join(";");

    overlay.innerHTML = `
        <div style="text-align:center; max-width:90%; padding:20px;">
            <h1 style="margin:0 0 12px 0; font-size:28px;">This site is blocked</h1>
            <p style="margin:0 0 18px 0; color:#444;">You've blocked access to this site.</p>
            <div style="font-size:13px; color:#666; margin-bottom:14px;">
                To remove the block, open the extension popup and remove the site.
            </div>
            <button id="site-blocker-return"
                style="padding:8px 14px; border-radius:6px; border:1px solid #ccc; cursor:pointer;">
                Go back
            </button>
        </div>
    `;

    document.documentElement.appendChild(overlay);
    overlay.querySelector("#site-blocker-return").addEventListener("click", () => {
        try {
            if (window.history.length > 1) window.history.back();
            else window.location.href = "about:blank";
        } catch {
            window.location.href = "about:blank";
        }
    });
}

function removeOverlay() {
    const el = document.getElementById("site-blocker-overlay");
    if (el) { el.remove(); document.documentElement.style.overflow = ""; }
}

function checkBlocking() {
    try {
        const hostname = window.location.hostname;
        if (!hostname) return;
        if (matchesBlocked(hostname)) injectOverlay();
        else removeOverlay();
    } catch {}
}

let cosmeticStyleEl = null;

function buildCosmeticCSS(selectors) {
    const valid = selectors.filter(s => typeof s === "string" && !s.startsWith("##") && s.trim());
    if (!valid.length) return "";
    return valid.join(",\n") + " {\n  display: none !important;\n  visibility: hidden !important;\n}";
}

function injectCosmeticCSS(css) {
    if (!css) return;
    if (!cosmeticStyleEl) {
        cosmeticStyleEl = document.createElement("style");
        cosmeticStyleEl.id = "hard-blocker-cosmetic";
        (document.head || document.documentElement).appendChild(cosmeticStyleEl);
    }
    cosmeticStyleEl.textContent = css;
}

function removeCosmeticCSS() {
    if (cosmeticStyleEl) { cosmeticStyleEl.remove(); cosmeticStyleEl = null; }
}

let cosmeticObserver = null;

function startCosmeticObserver(selectors) {
    if (cosmeticObserver) return;
    const validSelectors = selectors.filter(s => typeof s === "string" && !s.startsWith("##") && s.trim());
    if (!validSelectors.length) return;
    const combined = validSelectors.join(",");

    cosmeticObserver = new MutationObserver(mutations => {
        for (const m of mutations) {
            for (const node of m.addedNodes) {
                if (node.nodeType !== 1) continue;
                try {
                    if (node.matches(combined)) node.style.setProperty("display", "none", "important");
                    node.querySelectorAll(combined).forEach(el =>
                        el.style.setProperty("display", "none", "important")
                    );
                } catch {}
            }
        }
    });

    cosmeticObserver.observe(document.documentElement, { childList: true, subtree: true });
}

function stopCosmeticObserver() {
    if (cosmeticObserver) { cosmeticObserver.disconnect(); cosmeticObserver = null; }
}

function loadAndApplyCosmetic(adblockEnabled) {
    if (!adblockEnabled) {
        removeCosmeticCSS();
        stopCosmeticObserver();
        return;
    }
    const url = chrome.runtime.getURL("cosmetic_filters.json");
    fetch(url)
        .then(r => r.json())
        .then(selectors => {
            injectCosmeticCSS(buildCosmeticCSS(selectors));
            startCosmeticObserver(selectors);
        })
        .catch(err => console.error("Hard Blocker: failed to load cosmetic_filters.json", err));
}

chrome.storage.local.get({ blocked: [], adblock: false }, res => {
    blockedList = res.blocked || [];
    checkBlocking();
    loadAndApplyCosmetic(!!res.adblock);
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area !== "local") return;
    if (changes.blocked) {
        blockedList = changes.blocked.newValue || [];
        checkBlocking();
    }
    if (changes.adblock) {
        loadAndApplyCosmetic(!!changes.adblock.newValue);
    }
});

chrome.runtime.onMessage.addListener((msg, _sender, sendResponse) => {
    if (!msg) return;
    if (msg.type === "update-blocked") {
        blockedList = msg.blocked || [];
        checkBlocking();
        sendResponse({ ok: true });
    }
});