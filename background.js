let PORN_DOMAINS = [];
let pornListLoaded = false;

function loadPornList(callback) {
    if (pornListLoaded) {
        if (callback) callback();
        return;
    }
    const url = chrome.runtime.getURL("pornlist.json");
    fetch(url)
        .then(res => res.json())
        .then(list => {
            PORN_DOMAINS = list || [];
            pornListLoaded = true;
            console.log("Porn list loaded:", PORN_DOMAINS.length, "domains");
            if (callback) callback();
        })
        .catch(err => {
            console.error("Failed to load pornlist.json:", err);
            if (callback) callback();
        });
}
const AD_DOMAINS = [
    // ── Google Ads & Syndication ──────────────────────────────────────────────
    "pagead2.googlesyndication.com",
    "googlesyndication.com",
    "afs.googlesyndication.com",
    "adservice.google.com",
    "pagead2.googleadservices.com",
    "googleadservices.com",
    "doubleclick.net",
    "ad.doubleclick.net",
    "stats.g.doubleclick.net",
    "static.doubleclick.net",
    "m.doubleclick.net",
    "mediavisor.doubleclick.net",

    // ── Google Analytics ──────────────────────────────────────────────────────
    "google-analytics.com",
    "ssl.google-analytics.com",
    "click.googleanalytics.com",
    "analytics.google.com",

    // ── Amazon Ads ────────────────────────────────────────────────────────────
    "advice-ads.s3.amazonaws.com",
    "adtago.s3.amazonaws.com",
    "analyticsengine.s3.amazonaws.com",
    "analytics.s3.amazonaws.com",
    "aax.amazon-adsystem.com",
    "amazon-adsystem.com",
    "s.amazon-adsystem.com",

    // ── Media.net ─────────────────────────────────────────────────────────────
    "adservetx.media.net",
    "static.media.net",
    "media.net",

    // ── AdColony ──────────────────────────────────────────────────────────────
    "adc3-launch.adcolony.com",
    "ads30.adcolony.com",
    "events3alt.adcolony.com",
    "wd.adcolony.com",

    // ── AppNexus / Xandr ──────────────────────────────────────────────────────
    "adnxs.com",
    "ib.adnxs.com",

    // ── PubMatic ──────────────────────────────────────────────────────────────
    "ads.pubmatic.com",
    "image2.pubmatic.com",
    "simage2.pubmatic.com",

    // ── Taboola ───────────────────────────────────────────────────────────────
    "taboola.com",
    "cdn.taboola.com",
    "trc.taboola.com",

    // ── Outbrain ──────────────────────────────────────────────────────────────
    "outbrain.com",
    "amplify.outbrain.com",
    "widgets.outbrain.com",

    // ── Yahoo / Oath / Verizon Media ──────────────────────────────────────────
    "ads.yahoo.com",
    "geo.yahoo.com",
    "udcm.yahoo.com",
    "analytics.query.yahoo.com",
    "log.fc.yahoo.com",
    "analytics.yahoo.com",
    "partnerads.ysm.yahoo.com",
    "gemini.yahoo.com",
    "adtech.yahooinc.com",

    // ── Hotjar ────────────────────────────────────────────────────────────────
    "events.hotjar.io",
    "identify.hotjar.com",
    "script.hotjar.com",
    "surveys.hotjar.com",
    "insights.hotjar.com",
    "adm.hotjar.com",
    "hotjar.com",

    // ── MouseFlow ─────────────────────────────────────────────────────────────
    "cdn.mouseflow.com",
    "cdn-test.mouseflow.com",
    "gtm.mouseflow.com",
    "api.mouseflow.com",
    "tools.mouseflow.com",
    "mouseflow.com",
    "o2.mouseflow.com",

    // ── FreshWorks / FreshMarketer ────────────────────────────────────────────
    "claritybt.freshmarketer.com",
    "fwtracks.freshmarketer.com",
    "freshmarketer.com",

    // ── LuckyOrange ───────────────────────────────────────────────────────────
    "upload.luckyorange.net",
    "cs.luckyorange.net",
    "luckyorange.com",
    "settings.luckyorange.net",
    "realtime.luckyorange.com",
    "api.luckyorange.com",
    "cdn.luckyorange.com",
    "w1.luckyorange.com",

    // ── Stats WP Plugin ───────────────────────────────────────────────────────
    "stats.wp.com",

    // ── Bugsnag ───────────────────────────────────────────────────────────────
    "notify.bugsnag.com",
    "api.bugsnag.com",
    "sessions.bugsnag.com",
    "app.bugsnag.com",

    // ── Sentry ────────────────────────────────────────────────────────────────
    "browser.sentry-cdn.com",
    "app.getsentry.com",
    "sentry-cdn.com",

    // ── Facebook / Meta Ads & Pixel ───────────────────────────────────────────
    "an.facebook.com",
    "pixel.facebook.com",
    "connect.facebook.net",
    "graph.facebook.com",

    // ── Twitter / X Ads ───────────────────────────────────────────────────────
    "static.ads-twitter.com",
    "ads-api.twitter.com",
    "ads.twitter.com",
    "analytics.twitter.com",

    // ── LinkedIn Ads ──────────────────────────────────────────────────────────
    "ads.linkedin.com",
    "analytics.pointdrive.linkedin.com",
    "px.ads.linkedin.com",
    "snap.licdn.com",

    // ── Pinterest Ads ─────────────────────────────────────────────────────────
    "log.pinterest.com",
    "trk.pinterest.com",
    "ads.pinterest.com",
    "ct.pinterest.com",

    // ── Reddit Ads ────────────────────────────────────────────────────────────
    "events.reddit.com",
    "events.redditmedia.com",
    "alb.reddit.com",
    "pixel.reddit.com",

    // ── TikTok / ByteDance Ads ────────────────────────────────────────────────
    "analytics.tiktok.com",
    "business-api.tiktok.com",
    "log.byteoversea.com",
    "analytics-sg.tiktok.com",
    "ads-sg.tiktok.com",
    "ads.tiktok.com",
    "ads-api.tiktok.com",
    "mon.tiktok.com",
    "log-va.tiktok.com",

    // ── Yandex Ads & Metrica ──────────────────────────────────────────────────
    "appmetrica.yandex.ru",
    "metrika.yandex.ru",
    "adfstat.yandex.ru",
    "adfox.yandex.ru",
    "mc.yandex.ru",
    "an.yandex.ru",
    "extmaps-api.yandex.net",
    "offerwall.yandex.net",

    // ── Unity Ads ─────────────────────────────────────────────────────────────
    "auction.unityads.unity3d.com",
    "adserver.unityads.unity3d.com",
    "config.unityads.unity3d.com",
    "webview.unityads.unity3d.com",

    // ── Realme ────────────────────────────────────────────────────────────────
    "iot-eu-logser.realme.com",
    "bdapi-in-ads.realmemobile.com",
    "iot-logser.realme.com",
    "bdapi-ads.realmemobile.com",

    // ── Xiaomi ────────────────────────────────────────────────────────────────
    "api.ad.xiaomi.com",
    "sdkconfig.ad.xiaomi.com",
    "data.mistat.india.xiaomi.com",
    "data.mistat.rus.xiaomi.com",
    "sdkconfig.ad.intl.xiaomi.com",
    "data.mistat.xiaomi.com",
    "tracking.rus.miui.com",

    // ── Oppo ──────────────────────────────────────────────────────────────────
    "data.ads.oppomobile.com",
    "adx.ads.oppomobile.com",
    "ck.ads.oppomobile.com",
    "adsfs.oppomobile.com",

    // ── Huawei ────────────────────────────────────────────────────────────────
    "metrics.data.hicloud.com",
    "metrics2.data.hicloud.com",
    "grs.hicloud.com",
    "logservice.hicloud.com",
    "logbak.hicloud.com",
    "logservice1.hicloud.com",

    // ── OnePlus ───────────────────────────────────────────────────────────────
    "open.oneplus.net",
    "click.oneplus.cn",

    // ── Samsung ───────────────────────────────────────────────────────────────
    "smetrics.samsung.com",
    "samsung-com.112.2o7.net",
    "nmetrics.samsung.com",
    "samsungads.com",
    "analytics-api.samsunghealthcn.com",

    // ── Apple Ads & Metrics ───────────────────────────────────────────────────
    "metrics.mzstatic.com",
    "metrics.icloud.com",
    "api-adservices.apple.com",
    "notes-analytics-events.apple.com",
    "weather-analytics-events.apple.com",
    "books-analytics-events.apple.com",
    "iadsdk.apple.com",

    // ── Microsoft Ads / Clarity ───────────────────────────────────────────────
    "bat.bing.com",
    "ads.microsoft.com",
    "clarity.ms",
    "c.clarity.ms",

    // ── Criteo ────────────────────────────────────────────────────────────────
    "static.criteo.net",
    "dis.criteo.com",
    "rtax.criteo.com",
    "gum.criteo.com",

    // ── OpenX ─────────────────────────────────────────────────────────────────
    "us-u.openx.net",
    "openx.net",

    // ── Rubicon / Magnite ─────────────────────────────────────────────────────
    "fastlane.rubiconproject.com",
    "rubiconproject.com",

    // ── Index Exchange ────────────────────────────────────────────────────────
    "casalemedia.com",
    "simage2.casalemedia.com",

    // ── Moat (Oracle) ─────────────────────────────────────────────────────────
    "moatads.com",
    "z.moatads.com",

    // ── Scorecard Research / comScore ─────────────────────────────────────────
    "beacon.scorecardresearch.com",
    "scorecardresearch.com",

    // ── Chartbeat ─────────────────────────────────────────────────────────────
    "static.chartbeat.com",
    "ping.chartbeat.net",

    // ── Nielsen ───────────────────────────────────────────────────────────────
    "secure-dcr.imrworldwide.com",
    "imrworldwide.com",

    // ── Mixpanel ──────────────────────────────────────────────────────────────
    "api.mixpanel.com",
    "cdn.mxpnl.com",

    // ── Segment ───────────────────────────────────────────────────────────────
    "api.segment.io",
    "cdn.segment.com",

    // ── Quantcast ─────────────────────────────────────────────────────────────
    "quantserve.com",
    "pixel.quantserve.com",

    // ── Snapchat Ads ──────────────────────────────────────────────────────────
    "tr.snapchat.com",
    "sc-static.net",

    // ── SpotX ─────────────────────────────────────────────────────────────────
    "search.spotxchange.com",
    "spotxchange.com",

    // ── Sharethrough ──────────────────────────────────────────────────────────
    "sharethrough.com",

    // ── TripleLift ────────────────────────────────────────────────────────────
    "tlx.3lift.com",
    "3lift.com",

    // ── Conversant / Epsilon ──────────────────────────────────────────────────
    "media.conversantmedia.com",
    "conversantmedia.com",
];

function buildAndApplyRules() {
    chrome.storage.local.get({ blocked: [], adblock: false, pornEnabled: false }, res => {
        const blocked = res.blocked || [];
        const adblock = !!res.adblock;
        const pornEnabled = !!res.pornEnabled;

        const rules = [];

        for (let i = 0; i < blocked.length && i < 999; i++) {
            rules.push({
                id: i + 1,
                priority: 1,
                action: { type: "block" },
                condition: {
                    urlFilter: "||" + blocked[i] + "^",
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
            for (let i = 0; i < AD_DOMAINS.length && i < 1000; i++) {
                rules.push({
                    id: 1000 + i,
                    priority: 1,
                    action: { type: "block" },
                    condition: {
                        urlFilter: "||" + AD_DOMAINS[i] + "^",
                        resourceTypes: [
                            "script",
                            "image",
                            "xmlhttprequest",
                            "sub_frame",
                            "media",
                            "websocket",
                            "ping"
                        ]
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
    pornListLoaded = false;
    loadPornList(() => buildAndApplyRules());
});

chrome.storage.onChanged.addListener((changes, area) => {
    if (area === "local" && (changes.blocked || changes.adblock || changes.pornEnabled)) {
        buildAndApplyRules();
    }
});