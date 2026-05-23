const siteInput = document.getElementById("siteInput");
const addBtn = document.getElementById("addBtn");
const blockCurrentBtn = document.getElementById("blockCurrent");
const listEl = document.getElementById("list");
const clearHistoryToggle = document.getElementById("clearHistoryToggle");
const adblockToggle = document.getElementById("adblockToggle");
const pornToggle = document.getElementById("pornToggle");
const exportBtn = document.getElementById("exportBtn");
const importBtn = document.getElementById("importBtn");
const importFile = document.getElementById("importFile");
const removeAllBtn = document.getElementById("removeAllBtn");

const P3_KEYWORDS = [
    "porn","xxx","sex","nude","nudes","adult","xxxvideo","pornhub","xvideos","hentai","camgirl","camsex"
];

let P3_DOMAINS = [];

function loadPornList(callback) {
    const url = chrome.runtime.getURL("pornlist.json");
    fetch(url)
        .then(res => res.json())
        .then(list => {
            P3_DOMAINS = list || [];
            if (callback) callback();
        })
        .catch(err => {
            console.error("Failed to load pornlist.json:", err);
            if (callback) callback();
        });
}

function normalizeHost(host) {
    if (!host) return "";
    return host.replace(/^https?:\/\//i, "")
               .replace(/^www\./i, "")
               .split(/[\/:?#]/)[0]
               .toLowerCase()
               .trim();
}

function extractDomain(input) {
    try {
        const maybeUrl = input.includes("://") ? input : "https://" + input;
        const url = new URL(maybeUrl);
        return normalizeHost(url.hostname);
    } catch {
        return normalizeHost(input);
    }
}

function refreshUI() {
    chrome.storage.local.get({ blocked: [], clearHistory: false, adblock: false, pornEnabled: false }, res => {
        listEl.innerHTML = "";
        const list = res.blocked || [];
        if (!list.length) {
            const div = document.createElement("div");
            div.className = "site-item";
            div.innerHTML = `<span style="color:#999">No sites blocked yet.</span>`;
            listEl.appendChild(div);
        } else {
            for (const d of list) {
                const div = document.createElement("div");
                div.className = "site-item";
                div.innerHTML = `<span>${d}</span>`;
                const removeBtn = document.createElement("button");
                removeBtn.textContent = "Remove";
                removeBtn.className = "btn-remove";
                removeBtn.dataset.domain = d;
                removeBtn.addEventListener("click", onRemoveDomain);
                div.appendChild(removeBtn);
                listEl.appendChild(div);
            }
        }

        clearHistoryToggle.checked = !!res.clearHistory;
        adblockToggle.checked = !!res.adblock;
        pornToggle.checked = !!res.pornEnabled;
    });
}

function clearHistoryForDomain(domain) {
    if (!domain) return;
    chrome.history.search({ text: domain, maxResults: 5000 }, results => {
        for (const item of results) {
            try {
                const u = new URL(item.url);
                if (normalizeHost(u.hostname).endsWith(domain)) {
                    chrome.history.deleteUrl({ url: item.url });
                }
            } catch {}
        }
    });
}

function clearHistoryByKeywords(keywords) {
    if (!Array.isArray(keywords) || !keywords.length) return;
    chrome.history.search({ text: "", maxResults: 5000 }, results => {
        for (const item of results) {
            const urlLower = (item.url || "").toLowerCase();
            const titleLower = (item.title || "").toLowerCase();
            for (const kw of keywords) {
                if (urlLower.includes(kw) || titleLower.includes(kw)) {
                    chrome.history.deleteUrl({ url: item.url });
                    break;
                }
            }
        }
    });
}

function clearPornHistory() {
    for (const d of P3_DOMAINS) clearHistoryForDomain(d);
    clearHistoryByKeywords(P3_KEYWORDS);
}

function onRemoveDomain(e) {
    const domain = e.target.dataset.domain;
    chrome.storage.local.get({ blocked: [] }, res => {
        const list = (res.blocked || []).filter(d => d !== domain);
        chrome.storage.local.set({ blocked: list }, () => refreshUI());
    });
}

const blockCurrentToggle = document.getElementById("blockCurrentToggle");
blockCurrentToggle.addEventListener("change", function() {
    chrome.storage.local.set({ blockCurrentEnabled: this.checked });
});

addBtn.addEventListener("click", () => {
    const raw = siteInput.value.trim();
    if (!raw) return;
    const domain = extractDomain(raw);
    if (!domain) return;
    chrome.storage.local.get({ blocked: [], clearHistory: false }, res => {
        const list = res.blocked || [];
        if (list.length >= 999) { alert("You can block a maximum of 999 sites manually."); return; }
        if (!list.includes(domain)) list.push(domain);
        chrome.storage.local.set({ blocked: list }, () => {
            if (res.clearHistory) clearHistoryForDomain(domain);
            refreshUI();
            siteInput.value = "";
        });
    });
});

blockCurrentBtn.addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (!tabs.length) return;
        const tab = tabs[0];
        try {
            const url = new URL(tab.url);
            const domain = normalizeHost(url.hostname);
            chrome.storage.local.get({ blocked: [], clearHistory: false }, res => {
                const list = res.blocked || [];
                if (list.length >= 999) { alert("You can block a maximum of 999 sites manually."); return; }
                if (!list.includes(domain)) list.push(domain);
                chrome.storage.local.set({ blocked: list }, () => {
                    if (res.clearHistory) clearHistoryForDomain(domain);
                    refreshUI();
                    chrome.tabs.reload(tab.id);
                });
            });
        } catch {
            alert("Cannot block this page (internal page or unsupported).");
        }
    });
});

clearHistoryToggle.addEventListener("change", e => {
    chrome.storage.local.set({ clearHistory: e.target.checked }, () => {
        if (e.target.checked) {
            chrome.storage.local.get({ pornEnabled: false }, res => {
                if (res.pornEnabled) clearPornHistory();
            });
        }
    });
});

adblockToggle.addEventListener("change", e => {
    chrome.storage.local.set({ adblock: e.target.checked });
});

pornToggle.addEventListener("change", e => {
    chrome.storage.local.set({ pornEnabled: e.target.checked }, () => {
        if (e.target.checked) {
            chrome.storage.local.get({ clearHistory: false }, res => {
                if (res.clearHistory) clearPornHistory();
            });
        }
    });
});

removeAllBtn.addEventListener("click", () => {
    if (confirm("Remove all blocked sites?")) {
        chrome.storage.local.set({ blocked: [] }, () => refreshUI());
    }
});

exportBtn.addEventListener("click", async () => {
    const data = await new Promise(res =>
        chrome.storage.local.get({ blocked: [], adblock: false, clearHistory: false, pornEnabled: false }, res)
    );
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "blocked_sites_backup.json";
    a.click();
    URL.revokeObjectURL(url);
});

importBtn.addEventListener("click", () => importFile.click());
importFile.addEventListener("change", e => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = ev => {
        try {
            const obj = JSON.parse(ev.target.result);
            const blocked = Array.isArray(obj.blocked)
                ? obj.blocked.map(extractDomain).slice(0, 999)
                : [];
            const adblock = !!obj.adblock;
            const clearHistory = !!obj.clearHistory;
            const pornEnabled = !!obj.pornEnabled;
            chrome.storage.local.set({ blocked, adblock, clearHistory, pornEnabled }, () => {
                refreshUI();
                alert("Imported successfully.");
            });
        } catch {
            alert("Invalid file.");
        }
    };
    reader.readAsText(f);
});

document.body.classList.add("no-transition");

chrome.storage.local.get(
    { blocked: [], clearHistory: false, adblock: false, pornEnabled: false, blockCurrentEnabled: true },
    res => {
        clearHistoryToggle.checked  = !!res.clearHistory;
        adblockToggle.checked       = !!res.adblock;
        pornToggle.checked          = !!res.pornEnabled;
        blockCurrentToggle.checked  = res.blockCurrentEnabled !== false;

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.body.classList.remove("no-transition");
            });
        });
    }
);

loadPornList(() => refreshUI());