/**
 * 底部橫幅廣告（其他頁面要用時，把這支檔案一起複製過去即可）
 *
 * 用法：
 *   1. head 放 AdSense 的 adsbygoogle.js，onerror 時呼叫 hideAdBar()（廣告腳本被擋就收起廣告列）
 *   2. body 放廣告列，尺寸用屬性設定（要跟 AdSense 後台廣告單元的尺寸一致）：
 *        <div id="ad-bar"
 *            data-slot="6817299480" data-size="728x90"
 *            data-mobile-slot="" data-mobile-size="320x50"></div>
 *      依開啟時的螢幕寬度，先用一般尺寸，放不下再用手機尺寸；slot 留空就不放那一個
 *      廣告列的位置樣式由該頁 CSS 的 #ad-bar 決定（body 會加上 ad-corner / ad-hidden / ad-narrow）
 *   3. 在廣告列後面載入本檔：<script src="./js/ads.js"></script>
 *
 * 版面：廣告放在畫面正下方並讓出空間（頁面高度用 CSS 變數 --ad-reserve 扣掉），
 * 兩側夠寬時改放左下角；都與內容保持 150px 以上距離（Google 建議遊戲頁廣告離遊戲至少 150px，避免誤觸）。
 * 沒有廣告可投放（例如網站尚未通過審核）或被擋時自動收起。
 */
(function () {
    const AD_CLIENT = 'ca-pub-9815906908978353';
    const AD_MARGIN = 8;
    const AD_GAP = 150;
    // 內容（遊戲畫布）的寬高比，用來算兩側空白放不放得下廣告
    const CONTENT_ASPECT = 9 / 16;

    const adBar = document.getElementById('ad-bar');
    if (!adBar) return;

    // "728x90" → { w: 728, h: 90 }
    function parseSize(str, fallback) {
        const m = /^\s*(\d+)\s*[x×]\s*(\d+)\s*$/i.exec(str || '');
        return m ? { w: Number(m[1]), h: Number(m[2]) } : fallback;
    }

    const data = adBar.dataset;
    const units = [
        { slot: data.slot ?? '', ...parseSize(data.size, { w: 728, h: 90 }) },
        { slot: data.mobileSlot ?? '', ...parseSize(data.mobileSize, { w: 320, h: 50 }) }
    ];

    // 依開啟時的螢幕寬度挑第一個放得下的廣告單元（固定尺寸的廣告單元不能自己改尺寸）
    const adUnit = units.find(u => u.slot && window.innerWidth >= u.w + AD_MARGIN * 2) || null;
    let adSlot = null;
    if (adUnit) {
        adBar.style.width = `${adUnit.w}px`;
        adBar.style.height = `${adUnit.h}px`;
        adSlot = document.createElement('ins');
        adSlot.className = 'adsbygoogle';
        adSlot.style.cssText = `display:inline-block;width:${adUnit.w}px;height:${adUnit.h}px`;
        adSlot.setAttribute('data-ad-client', AD_CLIENT);
        adSlot.setAttribute('data-ad-slot', adUnit.slot);
        adBar.appendChild(adSlot);
    } else {
        document.body.classList.add('ad-hidden');
    }

    function layoutAdBar() {
        const body = document.body;
        let reserve = 0;
        // 視窗縮到放不下時先收起（已投放的廣告不能換尺寸），放大回來再顯示
        body.classList.toggle('ad-narrow', !!adUnit && window.innerWidth < adUnit.w + AD_MARGIN * 2);
        if (adUnit && !body.classList.contains('ad-hidden') && !body.classList.contains('ad-narrow')) {
            // 內容全高顯示時的寬度；兩側空白放得下廣告 + 150px 就移到左下角，內容不用縮小
            const contentW = Math.min(window.innerWidth, window.innerHeight * CONTENT_ASPECT);
            const corner = (window.innerWidth - contentW) / 2 >= 16 + adUnit.w + AD_GAP;
            body.classList.toggle('ad-corner', corner);
            if (!corner) reserve = adUnit.h + AD_MARGIN + AD_GAP;
        }
        document.documentElement.style.setProperty('--ad-reserve', `${reserve}px`);
        // Phaser 遊戲頁：廣告列讓出空間後重新計算畫布大小（沒有 phaserGame 的頁面略過）
        if (typeof phaserGame !== 'undefined' && phaserGame) {
            phaserGame.scale.getParentBounds();
            phaserGame.scale.refresh();
        }
    }

    function hideAdBar() {
        document.body.classList.add('ad-hidden');
        layoutAdBar();
    }
    // head 的 adsbygoogle.js 載入失敗時（onerror）會呼叫
    window.hideAdBar = hideAdBar;

    layoutAdBar();
    window.addEventListener('resize', layoutAdBar);
    if (window.adScriptBlocked) hideAdBar();

    if (adSlot) {
        // 沒有廣告可投放時收起，把空間還給內容
        new MutationObserver(() => {
            if (adSlot.getAttribute('data-ad-status') === 'unfilled') hideAdBar();
        }).observe(adSlot, { attributes: true, attributeFilter: ['data-ad-status'] });
        (window.adsbygoogle = window.adsbygoogle || []).push({});
    }
})();
