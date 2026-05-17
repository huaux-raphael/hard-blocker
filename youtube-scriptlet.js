(function () {
    "use strict";
    function trySkipAd() {
        const skipSelectors = [
            ".ytp-skip-ad-button",
            ".ytp-ad-skip-button",
            ".ytp-ad-skip-button-modern",
            "[class*='skip-ad']",
            "[class*='skip_ad']"
        ];
        for (const sel of skipSelectors) {
            const btn = document.querySelector(sel);
            if (btn) { btn.click(); return true; }
        }
        return false;
    }

    function injectAdHideCSS() {
        if (document.getElementById("hb-yt-cosmetic")) return;
        const style = document.createElement("style");
        style.id = "hb-yt-cosmetic";
        style.textContent = `
            /* Ad info overlay */
            .ytp-ad-overlay-container,
            .ytp-ad-text-overlay,
            .ytp-ad-image-overlay,
            /* Bottom banner ads */
            .ytp-ad-module,
            /* "Ads" label */
            .ytp-ad-simple-ad-badge,
            .ytp-ad-badge,
            /* Companion/sidebar ads */
            #companion_ad,
            #companion,
            ytd-companion-slot-renderer,
            /* In-feed promoted videos */
            ytd-promoted-sparkles-web-renderer,
            ytd-promoted-video-renderer,
            ytd-search-pyv-renderer,
            ytd-display-ad-renderer,
            ytd-statement-banner-renderer,
            ytd-banner-promo-renderer,
            ytd-in-feed-ad-layout-renderer,
            /* Masthead */
            ytd-masthead-ad-v4-renderer,
            ytd-rich-item-renderer[is-ad],
            /* Shopping shelf ads */
            ytd-merch-shelf-renderer,
            /* Shorts ads */
            ytd-ad-slot-renderer,
            /* Generic ad containers */
            [id^="google_ads"],
            [data-google-av-cxn] { display: none !important; }
        `;
        (document.head || document.documentElement).appendChild(style);
    }

    function fastForwardAd() {
        const video = document.querySelector("video");
        if (!video) return false;

        const isAd = !!(
            document.querySelector(".ad-showing") ||
            document.querySelector(".ytp-ad-player-overlay") ||
            document.querySelector(".ytp-ad-simple-ad-badge")
        );

        if (isAd && video.duration && !isNaN(video.duration) && video.currentTime < video.duration - 0.1) {
            video.currentTime = video.duration;
            return true;
        }
        return false;
    }

    function dismissAdBlockerDialog() {
        const selectors = [
            "tp-yt-paper-dialog yt-confirm-dialog-renderer",
            "ytd-enforcement-message-view-model",
            "[id='dialog'] ytd-enforcement-message-view-model",
            ".yt-confirm-dialog-renderer"
        ];
        for (const sel of selectors) {
            const dialog = document.querySelector(sel);
            if (dialog) {
                const closeBtn = dialog.querySelector(
                    "button[aria-label='Close'], .yt-icon-button, [aria-label='Dismiss'], yt-button-renderer:last-of-type button"
                );
                if (closeBtn) { closeBtn.click(); return; }
                dialog.style.setProperty("display", "none", "important");
                const player = document.querySelector("#movie_player");
                if (player) player.style.removeProperty("filter");
            }
        }

        const overlay = document.querySelector(".yt-playability-error-supported-renderers");
        if (overlay) overlay.style.setProperty("display", "none", "important");
    }

    function patchYTPlayer() {
        const player = document.querySelector("#movie_player");
        if (!player) return;

        if (typeof player.getAdState === "function") {
            try {
                const adState = player.getAdState();
                if (adState === 1) {
                    if (typeof player.skipAd === "function") player.skipAd();
                    else if (typeof player.cancelAd === "function") player.cancelAd();
                }
            } catch {}
        }
    }

    function poll() {
        injectAdHideCSS();
        trySkipAd();
        fastForwardAd();
        patchYTPlayer();
        dismissAdBlockerDialog();
    }

    injectAdHideCSS();
    const interval = setInterval(poll, 300);

    let lastUrl = location.href;
    new MutationObserver(() => {
        if (location.href !== lastUrl) {
            lastUrl = location.href;
            setTimeout(poll, 500);
            setTimeout(poll, 1200);
        }
    }).observe(document.documentElement, { subtree: true, childList: true });
    document.addEventListener("visibilitychange", () => {
        if (document.hidden) clearInterval(interval);
        else setInterval(poll, 300);
    });
})();
