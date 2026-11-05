/**
 * ============================================================================
 * 7. INITIALIZE PHASER 3 GAME
 * ============================================================================
 */
let phaserGame = null;

/**
 * 檢查有沒有新版：GitHub Pages 會把 index.html 快取 10 分鐘，玩家可能拿到舊的 index.html（連帶載入舊版號的檔案）。
 * 開啟時另外抓一次最新的 index.html（網址加時間戳、不走快取）比對 APP_VERSION，
 * 比較新就換到「?v=新版本號」的網址重新載入（新網址不會吃到任何快取）。
 */
function checkForNewVersion() {
    if (IS_LOCAL_FILE || !window.fetch) return;
    const params = new URLSearchParams(location.search);

    // 已經是新版：把網址上的 ?v= 收掉，玩家分享或加書籤時網址保持乾淨
    if (params.get('v') === APP_VERSION) {
        params.delete('v');
        const query = params.toString();
        history.replaceState(null, '', location.pathname + (query ? `?${query}` : '') + location.hash);
    }

    fetch(`${location.pathname}?vcheck=${Date.now()}`, { cache: 'no-store' })
        .then(r => (r.ok ? r.text() : Promise.reject(r.status)))
        .then(html => {
            const m = /APP_VERSION\s*=\s*'([^']+)'/.exec(html);
            const latest = m && m[1];
            if (!latest || latest === APP_VERSION) return;
            // 已經用新版號的網址重新載入過、拿到的還是舊版（CDN 還沒更新完）就不再重整，避免無限重整
            if (params.get('v') === latest) return;
            params.set('v', latest);
            location.replace(`${location.pathname}?${params}${location.hash}`);
        })
        .catch(() => { });
}

/**
 * PWA：註冊 service worker（sw.js）。它不快取遊戲（一定要連網才能玩），只在開啟時沒網路顯示「無法連線」頁。
 * 網址帶 ?v=版本號：APP_VERSION 一改，瀏覽器就會換新版 sw.js。
 */
function registerServiceWorker() {
    if (IS_LOCAL_FILE || !('serviceWorker' in navigator)) return;
    window.addEventListener('load', () => {
        navigator.serviceWorker.register(withVersion('./sw.js')).catch(() => { });
    });
}

/**
 * 玩到一半斷線：蓋上「無法連線」（index.html 的 #offline-overlay），遊戲、音效、封面影片全部停住；
 * 網路連回來就重新載入，從頭開始。
 */
function setupOfflineGuard() {
    const overlay = document.getElementById('offline-overlay');
    if (!overlay) return;
    const goOffline = () => {
        overlay.hidden = false;
        if (phaserGame) phaserGame.pause();
        if (audioEngine.ctx) audioEngine.ctx.suspend().catch(() => { });
        if ('speechSynthesis' in window) window.speechSynthesis.cancel();
        CoverVideo.stop();
    };
    window.addEventListener('offline', goOffline);
    window.addEventListener('online', () => { if (!overlay.hidden) location.reload(); });
    if (navigator.onLine === false) goOffline();
}

console.info(`街友本色 I - 煙屁股大作戰 v${APP_VERSION}`);
checkForNewVersion();
registerServiceWorker();
setupOfflineGuard();

window.onload = function () {
    const config = {
        type: IS_LOCAL_FILE ? Phaser.CANVAS : Phaser.AUTO,
        // 本機開檔不能用 XHR 讀圖，改用 <img>
        loader: { imageLoadType: IS_LOCAL_FILE ? 'HTMLImageElement' : 'XHR' },
        parent: 'phaser-container',
        width: GAME_W * RENDER_SCALE,
        height: GAME_H * RENDER_SCALE,
        backgroundColor: '#080a0f',
        // 手機長壓抽菸時不要跳出系統長按選單（電腦版右鍵也一併關閉）
        disableContextMenu: true,
        scale: {
            mode: Phaser.Scale.FIT,
            autoCenter: Phaser.Scale.CENTER_BOTH
        },
        scene: [BootScene, CoverScene, StoryScene, SelectButtScene, PlayScene, ResultScene]
    };

    phaserGame = new Phaser.Game(config);
};
