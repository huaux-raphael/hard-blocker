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
    "analytics.facebook.com",
    "ads.facebook.com",

    // ── Twitter / X Ads ───────────────────────────────────────────────────────
    "static.ads-twitter.com",
    "ads-api.twitter.com",
    "ads.twitter.com",
    "analytics.twitter.com",
    "advertising.twitter.com",

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
    "ads-dev.pinterest.com",
    "analytics.pinterest.com",

    // ── Reddit Ads ────────────────────────────────────────────────────────────
    "events.reddit.com",
    "events.redditmedia.com",
    "alb.reddit.com",
    "pixel.reddit.com",
    "ads.reddit.com",
    "d.reddit.com",

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
    "appmetrica.yandex.com",
    "yandexadexchange.net",
    "analytics.mobile.yandex.net",
    "adsdk.yandex.ru",

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
    "data.mistat.intl.xiaomi.com",
    "tracking.miui.com",
    "tracking.intl.miui.com",
    "tracking.india.miui.com",

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
    "metrics1.data.hicloud.com",
    "metrics5.data.hicloud.com",
    "metrics-dra.dt.hicloud.com",

    // ── OnePlus ───────────────────────────────────────────────────────────────
    "open.oneplus.net",
    "click.oneplus.cn",

    // ── Samsung ───────────────────────────────────────────────────────────────
    "smetrics.samsung.com",
    "samsung-com.112.2o7.net",
    "nmetrics.samsung.com",
    "samsungads.com",
    "analytics-api.samsunghealthcn.com",
    "business.samsungusa.com",

    // ── Apple Ads & Metrics ───────────────────────────────────────────────────
    "metrics.mzstatic.com",
    "metrics.icloud.com",
    "api-adservices.apple.com",
    "notes-analytics-events.apple.com",
    "weather-analytics-events.apple.com",
    "books-analytics-events.apple.com",
    "iadsdk.apple.com",
    "securemetrics.apple.com",
    "supportmetrics.apple.com",

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

    // ── Mobile Ads ───────────────────────────────────────────────────────────
    // InMobi
    "inmobi.com",
    "api.inmobi.com",
    "sdk.inmobi.com",
    "ads.inmobi.com",
    "cf.hb.adriver.ru",
    // MoPub (Twitter/X mobile)
    "ads.mopub.com",
    "mopub.com",
    // IronSource / Unity LevelPlay
    "ironsource.com",
    "outcome-ssp.supersonicads.com",
    "admob.googleapis.com",
    // AdMob / Google Mobile
    "admob.com",
    "googleadmob.com",
    "mobile-gtm.googleapis.com",
    // Verizon / Oath mobile
    "ads.verizonmedia.com",
    "one.yahoo.com",
    // Chartboost
    "live.chartboost.com",
    "chartboost.com",
    // AppLovin
    "applovin.com",
    "rt.applovin.com",
    "d2.applovin.com",
    // Digital Turbine / Fyber
    "fyber.com",
    "inner-active.com",
    "inneractive.com",
    "digitalturbine.com",
    // Vungle / Liftoff
    "vungle.com",
    "api.vungle.com",
    "ads.vungle.com",
    // Moloco
    "moloco.com",
    "ad.moloco.com",
    // Smaato
    "prebid.smaato.net",
    "smaato.net",
    // Mintegral / Mobvista
    "mintegral.com",
    "api.mintegral.com",
    "hb.mintegral.com",
    // Yahoo Flurry analytics/ads
    "data.flurry.com",
    "api.flurry.com",
    "flurry.com",

    // ── Analytics (missing) ───────────────────────────────────────────────────
    // Amplitude
    "api.amplitude.com",
    "api2.amplitude.com",
    "amplitude.com",
    // Heap
    "heapanalytics.com",
    "cdn.heapanalytics.com",
    // FullStory
    "fullstory.com",
    "rs.fullstory.com",
    "edge.fullstory.com",
    // LogRocket
    "logrocket.com",
    "r.logrocket.io",
    // Pendo
    "app.pendo.io",
    "cdn.pendo.io",
    "data.pendo.io",
    // Matomo / Piwik (self-hosted but common CDN endpoints)
    "cdn.matomo.cloud",
    // Klaviyo
    "static.klaviyo.com",
    "a.klaviyo.com",
    // Braze
    "sdk.iad-01.braze.com",
    "sdk.fra-01.braze.com",
    "sdk.iad-02.braze.com",
    "sdk.iad-03.braze.com",
    "sdk.iad-05.braze.com",
    "braze.com",
    // Intercom tracking
    "api-iam.intercom.io",
    "widget.intercom.io",
    // Woopra
    "www.woopra.com",
    "static.woopra.com",

    // ── Audio Ads (missing) ───────────────────────────────────────────────────
    // Spotify Ad Studio
    "adeventtracker.spotify.com",
    "audio-ak-spotify-com.akamaized.net",
    "heads-fa.spotify.com",
    // AdsWizz / Pandora
    "adswizz.com",
    "deliver.adswizz.com",
    "inventory.adswizz.com",
    "impressions.adswizz.com",
    "cdn.adswizz.com",
    // Triton Digital (streaming audio)
    "tritondigital.com",
    "playerservices.streamtheworld.com",
    "cmod.tritondigital.com",
    // iHeartMedia / Omny
    "omny.fm",
    "traffic.omny.fm",
    // SoundCloud ads
    "promote.soundcloud.com",

    // ── Cross-Site Tracking (missing) ─────────────────────────────────────────
    // LiveRamp / IdentityLink
    "liveramp.com",
    "idsync.rlcdn.com",
    "rlcdn.com",
    // ID5 identity
    "id5-sync.com",
    // Neustar / TransUnion
    "neustar.biz",
    "tag.crsspxl.com",
    // TradeDesk UID2
    "global.uidapi.com",
    "uid2.prod.uidapi.com",
    // Lotame
    "ad.crwdcntrl.net",
    "crwdcntrl.net",
    "bcp.crwdcntrl.net",
    // Zeotap
    "zeotap.com",
    "spl.zeotap.com",
    // Permutive
    "permutive.com",
    "edge.permutive.app",
    // OneTrust (tracking consent but also ID sync)
    "cdn.cookielaw.org",
    // Publink / Epsilon
    "publink.com",
    "turn.com",
    "tns.turn.com",

    // ── Programmatic (missing) ────────────────────────────────────────────────
    // The Trade Desk
    "thetradedesk.com",
    "insight.adsrvr.org",
    "js.adsrvr.org",
    "match.adsrvr.org",
    "adsrvr.org",
    // DV360 / Display & Video 360
    "bid.g.doubleclick.net",
    "cm.g.doubleclick.net",
    // Xandr/Microsoft Invest
    "microsoft.com/ads",
    "secure.adnxs.com",
    // Magnite (ex-SpotX)
    "prebid.magnite.com",
    "streams.magnite.com",
    "magnite.com",
    // Freewheel (video programmatic)
    "freewheel.tv",
    "mssl.fwmrm.net",
    "fwmrm.net",
    // SmartAdServer / Equativ
    "smartadserver.com",
    "ced.sascdn.com",
    "sascdn.com",
    // Sovrn / VigLink
    "sovrn.com",
    "ap.lijit.com",
    "lijit.com",
    // Undertone / Perion
    "undertone.com",
    "cdn.undertone.com",
    // ── Kargo ─────────────────────────────────────────────────────────────────
    "krgo.com",
    "storage.krgo.com",

    // ── Spotify Ads (audio) ───────────────────────────────────────────────────
    // Ad delivery and tracking endpoints
    "audio-ads.spotify.com",
    "audio-fa.spotify.com",
    "audio-ec.spotify.com",
    "audio2.spotify.com",
    "www.audio2.spotify.com",
    "heads-fa.spotify.com",
    "heads-ec.spotify.com",
    "ads-fa.spotify.com",
    "adeventtracker.spotify.com",
    "analytics.spotify.com",
    "log.spotify.com",
    "crashdump.spotify.com",
    // Spotify audio ad CDN (serves actual mp3 ad streams)
    "audio-fa.scdn.co",
    "audio-ec.scdn.co",
    "audio-ak-spotify-com.akamaized.net",
    // Third-party networks Spotify routes ads through
    "media-match.com",
    "adclick.g.doubleclick.net",
    "pubads.g.doubleclick.net",
    "securepubads.g.doubleclick.net",
    "googleads.g.doubleclick.net",
    "pagead46.l.doubleclick.net",
    "ads.g.doubleclick.net",
    "s0.2mdn.net",
    "tpc.googlesyndication.com",
    "crashlytics.com",
    // Spotify Ad Studio
    "ads.spotify.com",
    "adstudio.spotify.com",

    // ── FingerprintJS (browser fingerprinting / tracking) ─────────────────────
    "fpjscdn.net",
    "fp.jsdelivr.net",
    "fpnpmcdn.net",
    "api.fpjs.io",
    "api2.fpjs.io",
    "api3.fpjs.io",
    "fingerprint.com",
    "cdn.fingerprint.com",
    "metrics.fingerprint.com",

    // ── Twitter/X Widgets & tracking ─────────────────────────────────────────
    "platform.twitter.com",
    "syndication.twitter.com",
    "widgets.twitter.com",
    "cdn.syndication.twimg.com",
    "t.co",

    // ── Pinterest tracking & widgets ──────────────────────────────────────────
    "widgets.pinterest.com",
    "assets.pinterest.com",
    "s.pinimg.com",
    "trk.pinterest.com",
    "ct.pinterest.com",
    "log.pinterest.com",

    // ── CoinHive & crypto miners ───────────────────────────────────────────────
    "coinhive.com",
    "coin-hive.com",
    "minero.cc",
    "jsecoin.com",
    "crypto-loot.com",
    "cryptoloot.pro",
    "coinimp.com",
    "webminepool.com",
    "webmine.pro",
    "webmine.cz",
    "moneroocean.stream",
    "authedmine.com",
    "miner.pr0gramm.com",
    "minecrunch.co",
    "minemytraffic.com",
    "2mdn.net",
    "ppoi.org",

    // ── MGID (programmatic native) ────────────────────────────────────────────
    "mgid.com",
    "mg.mgid.com",
    "cm.mgid.com",
    "jsc.mgid.com",
    "servicer.mgid.com",
    "a.mgid.com",
    "cdn.mgid.com",

    // ── Mintegral / Mobvista (additional endpoints) ───────────────────────────
    "cdn-adn.rayjump.com",
    "cdn-adn-ssl.rayjump.com",
    "rayjump.com",
    "mads.mintegral.com",
    "ss.mintegral.com",
    "net.mintegral.com",
    "sg-api.mintegral.com",
    "eu-api.mintegral.com",
    "us-api.mintegral.com",
    "adn.mintegral.com",

    // ── Google Analytics 4 (GA4) ──────────────────────────────────────────────
    "region1.google-analytics.com",
    "region1.analytics.google.com",
    "www.google-analytics.com",

    // ── Google Tag Manager (GTM) ──────────────────────────────────────────────
    "googletagmanager.com",
    "www.googletagmanager.com",
    "googletagservices.com",
    "www.googletagservices.com",
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