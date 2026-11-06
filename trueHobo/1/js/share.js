/**
 * ============================================================================
 * 8. 分享戰績（結算畫面：下載一張戰績圖，玩家想分享到哪裡都可以）
 * ============================================================================
 * - 戰績圖 = images/og-image.jpg（網址分享時的預覽圖）+ 底部一條橫幅（這局抽的菸蒂、最終總得分），用 canvas 合成成 JPG。
 * - 結算畫面一打開就先在背景做好，按下按鈕直接下載；不指定社群，也不叫分享選單。
 * - og-image.jpg 在 BootScene 載入完成後就先在背景下載（ShareKit.loadBase），結算時通常已經好了。
 * - 雙擊開檔（file://）時本機圖片畫進畫布後畫布就不能匯出，改讀 js/og-image-data.js（og-image.jpg 轉成的 data URL）。
 *   換了 og-image.jpg 之後要重新產生這個檔案，在遊戲資料夾執行：
 *     printf "// 由 images/og-image.jpg 產生（說明見 js/share.js）\nwindow.OG_IMAGE_DATA_URL = 'data:image/jpeg;base64,%s';\n" "$(base64 -i images/og-image.jpg)" > js/og-image-data.js
 *   上線（GitHub Pages）不會載入這個檔案。
 * - 底圖載入失敗時不產生替代圖（避免分享出去的圖不對），按鈕會提示失敗並重新產生。
 * - 下載按鈕要用 pointerup：手機上只有放開手指（touchend）才算使用者操作，下載才不會被擋。
 */
const SHARE_BASE_IMAGE = './images/og-image.jpg';
const SHARE_BASE_DATA_SCRIPT = './js/og-image-data.js';
const SHARE_W = 1080;          // 戰績圖寬度（底圖等比例縮放到這個寬度）
const SHARE_BANNER_H = 280;    // 底部戰績橫幅高度

const ShareKit = {
    // 手機 / 平板（iPadOS 的 UA 會假裝是 Mac，用觸控點數判斷）
    isMobile() {
        const ua = navigator.userAgent;
        return /Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    },

    // 載入底圖 og-image.jpg（只載一次），回傳 Promise<Image>；失敗時 reject，下次再呼叫會重試
    loadBase() {
        if (!ShareKit.basePromise) {
            ShareKit.basePromise = ShareKit.baseSrc()
                .then(src => new Promise((resolve, reject) => {
                    const img = new Image();
                    img.onload = () => resolve(img);
                    img.onerror = () => reject(new Error('og-image load failed'));
                    img.src = src;
                }))
                .catch(err => {
                    ShareKit.basePromise = null;
                    throw err;
                });
        }
        return ShareKit.basePromise;
    },

    // 底圖網址：上線時用 og-image.jpg；雙擊開檔（file://）時改用 js/og-image-data.js 裡的 data URL（畫進畫布後才能匯出）
    baseSrc() {
        if (!IS_LOCAL_FILE) return Promise.resolve(withVersion(SHARE_BASE_IMAGE));
        if (window.OG_IMAGE_DATA_URL) return Promise.resolve(window.OG_IMAGE_DATA_URL);
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = withVersion(SHARE_BASE_DATA_SCRIPT);
            script.onload = () => (window.OG_IMAGE_DATA_URL ? resolve(window.OG_IMAGE_DATA_URL) : reject(new Error('no OG_IMAGE_DATA_URL')));
            script.onerror = () => {
                script.remove();
                reject(new Error('og-image-data.js load failed'));
            };
            document.head.appendChild(script);
        });
    },

    /**
     * 產生戰績圖（底圖 + 底部橫幅），回傳 Promise<File>
     * info：結算資料（score、butt）
     */
    makeImage(info) {
        const butt = info.butt;
        const cjk = ['阿睿這次抽的是最終總得分得分倍率【】', butt.name, butt.difficultyLabel, butt.stars].join('');
        const fontsReady = document.fonts && document.fonts.load
            ? Promise.all([700, 900].flatMap(w => [
                document.fonts.load(`${w} 30px "Noto Serif TC"`, cjk),
                document.fonts.load(`${w} 30px "Noto Serif"`, '0123456789.x')
            ])).catch(() => { })
            : Promise.resolve();
        return Promise.all([ShareKit.loadBase(), fontsReady]).then(([base]) => ShareKit.renderCard(base, info));
    },

    renderCard(base, info) {
        const W = SHARE_W;
        const baseH = Math.round(W * base.naturalHeight / base.naturalWidth);
        const canvas = document.createElement('canvas');
        canvas.width = W;
        canvas.height = baseH + SHARE_BANNER_H;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(base, 0, 0, W, baseH);
        drawResultBanner(ctx, baseH, W, SHARE_BANNER_H, info);
        return new Promise((resolve, reject) => {
            try {
                canvas.toBlob(blob => {
                    if (blob) resolve(new File([blob], `truehobo-score-${info.score}.jpg`, { type: 'image/jpeg' }));
                    else reject(new Error('toBlob failed'));
                }, 'image/jpeg', 0.9);
            } catch (e) {
                reject(e);
            }
        });
    },

    download(file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        // iPhone 會先問要不要下載，網址留久一點
        setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
};

// 文字（可描邊、錯位黑影）；超過 maxW 會自動縮小字級
function cardText(ctx, str, x, y, opts) {
    let size = opts.size;
    const font = s => `${opts.weight ?? 900} ${s}px ${FONT_SERIF}`;
    ctx.font = font(size);
    if (opts.maxW) {
        while (size > 10 && ctx.measureText(str).width > opts.maxW) ctx.font = font(--size);
    }
    ctx.textAlign = opts.align ?? 'center';
    ctx.textBaseline = 'middle';
    ctx.lineJoin = 'round';
    if (opts.shadow) {
        ctx.fillStyle = '#000';
        ctx.strokeStyle = '#000';
        ctx.lineWidth = opts.stroke || 0.01;
        if (opts.stroke) ctx.strokeText(str, x + opts.shadow, y + opts.shadow);
        ctx.fillText(str, x + opts.shadow, y + opts.shadow);
    }
    if (opts.stroke) {
        ctx.lineWidth = opts.stroke;
        ctx.strokeStyle = opts.strokeColor ?? '#000';
        ctx.strokeText(str, x, y);
    }
    ctx.fillStyle = opts.color ?? '#fff';
    ctx.fillText(str, x, y);
}

// 底部戰績橫幅：左邊這局抽的菸蒂（名稱、難度、菸蒂圖、倍率），右邊最終總得分
function drawResultBanner(ctx, top, W, h, info) {
    const butt = info.butt;
    const color = butt.badgeColor;

    // 底色 + 上緣漫畫框線（黑粗線 + 橘線）
    const bg = ctx.createLinearGradient(0, top, 0, top + h);
    bg.addColorStop(0, '#161c27');
    bg.addColorStop(1, '#07090d');
    ctx.fillStyle = bg;
    ctx.fillRect(0, top, W, h);
    ctx.fillStyle = '#000';
    ctx.fillRect(0, top, W, 10);
    ctx.fillStyle = '#f59e0b';
    ctx.fillRect(0, top + 10, W, 6);

    const divX = 650;
    ctx.fillStyle = 'rgba(245,158,11,0.35)';
    ctx.fillRect(divX - 1, top + 52, 3, h - 92);

    // 左：菸蒂
    const left = 64;
    const right = divX - 40;
    const row1 = top + 70;
    const row2 = top + 142;
    const row3 = top + 222;
    cardText(ctx, '阿睿這次抽的是', left, row1, { size: 28, weight: 700, color: '#a8a29e', align: 'left' });
    cardText(ctx, `${butt.difficultyLabel} ${butt.stars}`, right, row1, { size: 28, color, align: 'right' });
    cardText(ctx, `【${butt.name}】`, left - 14, row2, { size: 56, color, stroke: 9, shadow: 5, align: 'left', maxW: right - left + 28 });
    const s = 4;
    ctx.save();
    ctx.translate(left, row3 - ((CIG_BAR.h + 4) / 2) * s);
    ctx.scale(s, s);
    drawButtShape(ctx, CIG_BAR.filterW, butt.stubLen, CIG_BAR.h);
    ctx.restore();
    cardText(ctx, `得分倍率 x${butt.scoreMultiplier.toFixed(1)}`, right, row3, { size: 28, weight: 700, color: '#fbbf24', align: 'right' });

    // 右：分數
    const cx = (divX + W) / 2;
    cardText(ctx, '最終總得分', cx, top + 72, { size: 30, weight: 700, color: '#a8a29e' });
    cardText(ctx, `${info.score}`, cx, top + 172, { size: 128, color: '#fef08a', stroke: 12, shadow: 7, maxW: W - divX - 70 });
}
