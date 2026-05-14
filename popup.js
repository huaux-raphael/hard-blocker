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
            console.log("Porn list loaded:", P3_DOMAINS.length, "domains");
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
      const li = document.createElement("li");
      li.textContent = "No sites blocked yet.";
      li.style.color = "#666";
      listEl.appendChild(li);
    } else {
      for (const d of list) {
        const li = document.createElement("li");
        li.innerHTML = `<span style="word-break:break-all">${d}</span>`;
        const removeBtn = document.createElement("button");
        removeBtn.textContent = "Remove";
        removeBtn.dataset.domain = d;
        removeBtn.addEventListener("click", onRemoveDomain);
        li.appendChild(removeBtn);
        listEl.appendChild(li);
      }
    }

    clearHistoryToggle.checked = !!res.clearHistory;
    adblockToggle.checked = !!res.adblock;
    pornToggle.checked = !!res.pornEnabled;
  });
}

async function updateRules() {
  const data = await new Promise(res => chrome.storage.local.get({ blocked: [], adblock: false, pornEnabled: false }, res));
  const blocked = data.blocked || [];
  const adblock = !!data.adblock;
  const pornEnabled = !!data.pornEnabled;

  const rules = [];

  for (let i = 0; i < blocked.length; i++) {
    const domain = blocked[i];
    rules.push({
      id: 1 + i,
      priority: 1,
      action: { type: "block" },
      condition: { urlFilter: domain, resourceTypes: ["main_frame"] }
    });
  }

  if (adblock) {
    const adDomains = [
      "doubleclick.net",
      "googlesyndication.com",
      "adservice.google.com",
      "ads.youtube.com",
      "adnxs.com",
      "ads.pubmatic.com",
      "taboola.com",
      "outbrain.com",
      "ads.yahoo.com"
    ];
    for (let i = 0; i < adDomains.length; i++) {
      rules.push({
        id: 1000 + i,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: adDomains[i], resourceTypes: ["script","image","xmlhttprequest","sub_frame"] }
      });
    }
  }

  if (pornEnabled) {
    for (let i = 0; i < P3_DOMAINS.length; i++) {
      rules.push({
        id: 2000 + i,
        priority: 1,
        action: { type: "block" },
        condition: { urlFilter: P3_DOMAINS[i], resourceTypes: ["main_frame"] }
      });
    }
  }

  chrome.declarativeNetRequest.getDynamicRules(existing => {
    const existingIds = existing.map(r => r.id);
    chrome.declarativeNetRequest.updateDynamicRules({
      removeRuleIds: existingIds,
      addRules: rules
    }, () => {
      if (chrome.runtime.lastError) console.warn("updateDynamicRules:", chrome.runtime.lastError);
    });
  });
}

function clearHistoryForDomain(domain) {
  if (!domain) return;
  chrome.history.search({ text: domain, maxResults: 5000 }, results => {
    for (const item of results) {
      try {
        const u = new URL(item.url);
        if (normalizeHost(u.hostname).endsWith(domain)) chrome.history.deleteUrl({ url: item.url });
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
    chrome.storage.local.set({ blocked: list }, () => { updateRules(); refreshUI(); });
  });
}

addBtn.addEventListener("click", () => {
  const raw = siteInput.value.trim();
  if (!raw) return;
  const domain = extractDomain(raw);
  if (!domain) return;
  chrome.storage.local.get({ blocked: [], clearHistory: false }, res => {
    const list = res.blocked || [];
    if (!list.includes(domain)) list.push(domain);
    chrome.storage.local.set({ blocked: list }, () => {
      if (res.clearHistory) clearHistoryForDomain(domain);
      updateRules();
      refreshUI();
      siteInput.value = "";
    });
  });
});

blockCurrentBtn.addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (!tabs.length) return;
    try {
      const url = new URL(tabs[0].url);
      const domain = normalizeHost(url.hostname);
      chrome.storage.local.get({ blocked: [], clearHistory: false }, res => {
        const list = res.blocked || [];
        if (!list.includes(domain)) list.push(domain);
        chrome.storage.local.set({ blocked: list }, () => {
          if (res.clearHistory) clearHistoryForDomain(domain);
          updateRules();
          refreshUI();
        });
      });
    } catch {
      alert("Cannot block this page (internal page or unsupported).");
    }
  });
});

clearHistoryToggle.addEventListener("change", e => {
  chrome.storage.local.set({ clearHistory: e.target.checked }, () => {
    if (e.target.checked) chrome.storage.local.get({ pornEnabled: false }, res => {
      if (res.pornEnabled) clearPornHistory();
    });
  });
});

adblockToggle.addEventListener("change", e => {
  chrome.storage.local.set({ adblock: e.target.checked }, updateRules);
});

pornToggle.addEventListener("change", e => {
  chrome.storage.local.set({ pornEnabled: e.target.checked }, () => {
    updateRules();
    if (e.target.checked) chrome.storage.local.get({ clearHistory: false }, res => {
      if (res.clearHistory) clearPornHistory();
    });
  });
});

// Export / Import
exportBtn.addEventListener("click", async () => {
  const data = await new Promise(res => chrome.storage.local.get({ blocked: [], adblock: false, clearHistory: false, pornEnabled: false }, res));
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
      const blocked = Array.isArray(obj.blocked) ? obj.blocked.map(extractDomain) : [];
      const adblock = !!obj.adblock;
      const clearHistory = !!obj.clearHistory;
      const pornEnabled = !!obj.pornEnabled;
      chrome.storage.local.set({ blocked, adblock, clearHistory, pornEnabled }, () => { updateRules(); refreshUI(); alert("Imported successfully."); });
    } catch {
      alert("Invalid file.");
    }
  };
  reader.readAsText(f);
});

loadPornList(() => { refreshUI(); updateRules(); });
