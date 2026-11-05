/**
 * PWA 的 service worker：這個遊戲一定要連網才能玩，所以「不快取任何遊戲檔案」，
 * 只負責開啟時連不上網路，顯示「無法連線」頁（取代瀏覽器 / 主畫面 App 自己的錯誤畫面）。
 * 玩到一半才斷線，由 js/main.js 的 setupOfflineGuard() 蓋上同樣的無法連線畫面。
 *
 * 由 js/main.js 的 registerServiceWorker() 用 ./sw.js?v=版本號 註冊，APP_VERSION 一改就會換新版。
 */

// 舊版 sw.js 曾把遊戲存進快取供離線遊玩，啟用時清掉。
// 同網域（han45678.github.io）的其他遊戲共用快取空間，只清這個資料夾的（名稱開頭是資料夾路徑）
const CACHE_PREFIX = `${new URL('./', self.location.href).pathname}:`;

// 無法連線頁（樣式跟 css/style.css 的 .offline 一樣；連上網路會自動重新載入）
const OFFLINE_HTML = `<!DOCTYPE html>
<html lang="zh-TW">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
<meta name="theme-color" content="#080a0f">
<title>無法連線 | 街友本色 I - 煙屁股大作戰</title>
<style>
html, body { margin: 0; height: 100%; background: #080a0f; }
.offline {
    position: fixed; inset: 0;
    display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 14px;
    padding: 24px; text-align: center; box-sizing: border-box;
    background: radial-gradient(circle at center, #161c24 0%, #05070a 100%);
    font-family: "Noto Serif TC", "Noto Serif", "Songti TC", "PMingLiU", serif;
    -webkit-user-select: none; user-select: none; -webkit-tap-highlight-color: transparent;
}
.offline h1 {
    margin: 0 0 4px; font-size: 44px; font-weight: 900; color: #f59e0b;
    text-shadow: -2px -2px 0 #000, 2px -2px 0 #000, -2px 2px 0 #000, 2px 2px 0 #000, 0 4px 12px rgba(0, 0, 0, 0.9);
}
.offline p { margin: 0; font-size: 17px; font-weight: 700; color: #fde68a; }
.offline small { font-size: 13px; color: #a8a29e; }
.offline button {
    margin-top: 18px; padding: 12px 38px;
    font: inherit; font-size: 22px; font-weight: 900; color: #0b0b0b;
    background: linear-gradient(#f7b13c 0 42%, #f59e0b 42%);
    border: 3.5px solid #000; border-radius: 0; box-shadow: 6px 6px 0 rgba(0, 0, 0, 0.9);
    cursor: pointer;
}
.offline button:active { transform: translate(3px, 3px); box-shadow: 3px 3px 0 rgba(0, 0, 0, 0.9); }
</style>
</head>
<body>
<div class="offline">
    <h1>無法連線</h1>
    <p>街友本色 I 需要網路才能玩</p>
    <small>請確認網路連線，連上後會自動重新載入</small>
    <button type="button" onclick="location.reload()">重新連線</button>
</div>
<script>window.addEventListener('online', function () { location.reload(); });</script>
</body>
</html>`;

self.addEventListener('install', () => self.skipWaiting());

self.addEventListener('activate', event => {
    event.waitUntil((async () => {
        const keys = await caches.keys();
        await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX)).map(key => caches.delete(key)));
        await self.clients.claim();
    })());
});

// 只經手「開啟頁面」：一律走網路，連不上就回無法連線頁；其他請求（遊戲檔案、廣告等）都不經手，照常走網路
self.addEventListener('fetch', event => {
    if (event.request.mode !== 'navigate') return;
    event.respondWith(fetch(event.request).catch(() => new Response(OFFLINE_HTML, {
        status: 503,
        headers: { 'Content-Type': 'text/html; charset=utf-8', 'Cache-Control': 'no-store' }
    })));
});
