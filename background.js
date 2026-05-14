let PORN_DOMAINS = [];

function loadPornList(callback) {
    const url = chrome.runtime.getURL("pornlist.json");

    fetch(url)
        .then(res => res.json())
        .then(list => {
            PORN_DOMAINS = list || [];
            console.log("Porn list loaded:", PORN_DOMAINS.length, "domains");
            if (callback) callback();
        })
        .catch(err => {
            console.error("Failed to load pornlist.json:", err);
            if (callback) callback();
        });
}

function buildAndApplyRules() {
    chrome.storage.local.get({ blocked: [], adblock: false, pornEnabled: false }, res => {
        const blocked = res.blocked || [];
        const adblock = !!res.adblock;
        const pornEnabled = !!res.pornEnabled;

        const rules = [];

        for (let i = 0; i < blocked.length; i++) {
            rules.push({
                id: i + 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: blocked[i],
                    resourceTypes: [
                      "main_frame",
                      "sub_frame",
                      "script",
                      "image",
                      "xmlhttprequest",
                      "media",
                      "websocket"
                    ]
                }
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
                    condition: {
                        urlFilter: adDomains[i],
                        resourceTypes: ["script", "image", "xmlhttprequest", "sub_frame"]
                    }
                });
            }
        }

        if (pornEnabled) {
            for (let i = 0; i < PORN_DOMAINS.length; i++) {
                rules.push({
                    id: 2000 + i,
                    priority: 1,
                    action: { type: "block" },
                    condition: {
                        urlFilter: "||" + PORN_DOMAINS[i] + "^",
                        resourceTypes: [
                          "main_frame",
                          "sub_frame",
                          "script",
                          "image",
                          "xmlhttprequest",
                          "media",
                          "websocket"
                            ]
                    }
                });
            }
        }

        chrome.declarativeNetRequest.getDynamicRules(existing => {
            const existingIds = existing.map(r => r.id);
            chrome.declarativeNetRequest.updateDynamicRules({
                removeRuleIds: existingIds,
                addRules: rules
            }, () => {
                if (chrome.runtime.lastError) {
                    console.warn("updateDynamicRules failed:", chrome.runtime.lastError);
                }
            });
        });
    });
}

chrome.runtime.onInstalled.addListener(() => {
    loadPornList(() => buildAndApplyRules());
});

chrome.runtime.onStartup.addListener(() => {
    loadPornList(() => buildAndApplyRules());
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && (changes.blocked || changes.adblock || changes.pornEnabled)) {
        loadPornList(() => buildAndApplyRules());
    }
});

