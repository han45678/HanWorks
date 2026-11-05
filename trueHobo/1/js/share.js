/**
 * ============================================================================
 * 8. 分享戰績（結算畫面：IG 限時動態／FB 貼文／Threads 貼文，按鈕用各社群的圖示）
 * ============================================================================
 * 三個按鈕都分享「戰績圖」+ 分享文字（遊戲名稱、分數、遊戲連結）：
 * - Android：分享選單沒辦法指定 App，所以改成「戰績圖存到手機 + 複製文字 + 直接跳進對應的 App」，
 *   玩家在 App 裡選最新一張圖（IG 開限時動態相機、FB 開 App、Threads 開發文畫面並帶入文字）。
 * - iPhone 等其他手機：系統分享選單帶著戰績圖（IG、FB、Threads 的圖示在第一排），玩家點選發佈。
 *   FB 不允許網頁預先帶入文字，所以文字會自動複製，貼上即可；Threads 會連文字一起帶過去。
 *   IG 限時動態的「連結」貼紙網頁無法自動加上（Instagram 只開放給註冊的 App），
 *   所以只複製遊戲網址，玩家加連結貼紙時直接貼上（貼整段文字貼紙不收）。
 * - 電腦：瀏覽器沒有辦法把圖片交給 IG／FB／Threads，改成下載戰績圖 + 複製文字，並開該社群的網頁
 *   （IG 限時動態只能用手機發）。系統分享選單只在手機、而且是 https 網址（GitHub Pages）才有。
 * - 戰績圖：0.webp 當背景、標題「街友本色 I - 煙屁股大作戰」，中間是跟結算畫面一樣的結算面板，網址印在圖上；
 *   雙擊開檔（file://）時 0.webp 會讓畫布不能匯出，改用程式畫的街景當背景，一樣能產生戰績圖。
 * - 分享按鈕要用 pointerup：手機上只有放開手指（touchend）才算使用者操作，pointerdown 開視窗、叫分享選單會被擋。
 */
const SHARE_URL = 'https://han45678.github.io/HanWorks/trueHobo/1/';
const SHARE_URL_LABEL = 'han45678.github.io/HanWorks/trueHobo/1';
const SHARE_TITLE = '街友本色 I - 煙屁股大作戰';
const SHARE_TAGS = '#街友本色 #煙屁股大作戰';

const ShareKit = {
    // 手機 / 平板（iPadOS 的 UA 會假裝是 Mac，用觸控點數判斷）才叫系統分享選單；電腦的分享選單裡沒有 IG、FB
    isMobile() {
        const ua = navigator.userAgent;
        return /Android|iPhone|iPad|iPod/i.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    },

    // 分享文字（網址前後留空白，App 才會把網址正確辨識成連結，不會連括號一起吃進去）
    text(info) {
        return `我${SHARE_TITLE}\n得到了${info.score}分,遊戲連結（ ${SHARE_URL} ）`;
    },

    copyText(text) {
        try {
            if (navigator.clipboard && window.isSecureContext) {
                navigator.clipboard.writeText(text).catch(() => ShareKit.copyFallback(text));
                return true;
            }
        } catch (e) { }
        return ShareKit.copyFallback(text);
    },

    // 不支援 Clipboard API（例如雙擊開檔 file://）時用隱藏的 textarea 複製
    copyFallback(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.setAttribute('readonly', '');
        ta.style.cssText = 'position:fixed;top:0;left:0;opacity:0;';
        document.body.appendChild(ta);
        ta.select();
        let ok = false;
        try {
            ok = document.execCommand('copy');
        } catch (e) { }
        ta.remove();
        return ok;
    },

    // 開新分頁；被瀏覽器擋下時回傳 false
    openWindow(url) {
        const w = window.open(url, '_blank');
        if (w) {
            try {
                w.opener = null;
            } catch (e) { }
        }
        return !!w;
    },

    // 電腦版：開各社群網頁（電腦瀏覽器沒有辦法把圖片直接交給 IG / FB / Threads，只有手機的分享選單可以）
    instagramWeb() {
        return 'https://www.instagram.com/';
    },

    facebookWeb() {
        return 'https://www.facebook.com/';
    },

    threadsWeb(text) {
        return `https://www.threads.com/intent/post?text=${encodeURIComponent(text)}`;
    },

    isAndroid() {
        return /Android/i.test(navigator.userAgent);
    },

    /**
     * Android：用 intent 網址直接打開對應的 App（網頁沒辦法指定分享選單裡的 App，也沒辦法把圖片塞進 App，
     * 所以先把戰績圖存到手機，再跳進 App 讓玩家選最新一張圖）；沒裝 App 時改開網頁版
     * - IG：限時動態相機　- FB：FB App　- Threads：發文畫面（文字已帶入）
     */
    androidAppUrl(app, text) {
        const fallback = url => `S.browser_fallback_url=${encodeURIComponent(url)}`;
        if (app === 'instagram') {
            return `intent://story-camera#Intent;scheme=instagram;package=com.instagram.android;${fallback(ShareKit.instagramWeb())};end`;
        }
        if (app === 'facebook') {
            return `intent://www.facebook.com/#Intent;scheme=https;package=com.facebook.katana;${fallback(ShareKit.facebookWeb())};end`;
        }
        const threads = ShareKit.threadsWeb(text);
        return `intent://${threads.replace(/^https:\/\//, '')}#Intent;scheme=https;package=com.instagram.barcelona;${fallback(threads)};end`;
    },

    openApp(url) {
        window.location.href = url;
    },

    // 這台裝置能不能用系統分享選單分享圖片（只在手機用：電腦的分享選單裡沒有 IG、FB、Threads）
    canShareImage(file) {
        return ShareKit.isMobile() && !!navigator.canShare && navigator.canShare({ files: [file] });
    },

    // 系統分享選單分享圖片；text 有給才一起帶（IG、FB 帶文字時，部分手機的分享選單會不顯示它們，所以只給 Threads）
    // 回傳 Promise：'shared' | 'cancelled' | 'failed'
    shareImage(file, text) {
        const data = { files: [file] };
        if (text && navigator.canShare({ files: [file], text })) data.text = text;
        return navigator.share(data)
            .then(() => 'shared')
            .catch(e => (e && e.name === 'AbortError' ? 'cancelled' : 'failed'));
    },

    download(file) {
        const url = URL.createObjectURL(file);
        const a = document.createElement('a');
        a.href = url;
        a.download = file.name;
        document.body.appendChild(a);
        a.click();
        a.remove();
        setTimeout(() => URL.revokeObjectURL(url), 10000);
    },

    /**
     * 產生戰績圖 1080x1920（結算畫面一打開就先做好，按下按鈕時才能立刻叫出分享選單，不會因為等待而失去「使用者操作」）
     * art：背景圖（0.webp）。回傳 Promise<File>
     */
    makeImage(art, info) {
        const allText = [
            SHARE_TITLE, '60 秒時間到街頭結算最終總得分阿睿這次抽的是得分倍率過癮區黃金過癮區停留最高連吸連段燙到手嘴罵台語次數秒你也來撿一根試試',
            info.rankTitle, info.rankQuote, info.butt.name, info.butt.subtitle, info.butt.difficultyLabel, info.butt.stars, SHARE_TAGS
        ].join('');
        const fontsReady = document.fonts && document.fonts.load
            ? Promise.all([400, 700, 900].flatMap(w => [
                document.fonts.load(`${w} 30px "Noto Serif TC"`, allText),
                document.fonts.load(`italic ${w} 30px "Noto Serif TC"`, info.rankQuote),
                document.fonts.load(`${w} 30px "Noto Serif"`, `True Hobo I: Butt Brawl 0123456789 x Combo ${SHARE_URL_LABEL}`)
            ])).catch(() => { })
            : Promise.resolve();
        return fontsReady.then(() => ShareKit.renderCard(ShareKit.exportableArt(art), info));
    },

    // 背景圖能不能畫進要匯出的畫布：雙擊開檔（file://）時本機圖片算跨來源，畫進去後畫布就不能匯出，
    // 這時改用程式畫的街景（跟 0.webp 同一個場景的備援美術）
    exportableArt(art) {
        try {
            const probe = document.createElement('canvas');
            probe.width = probe.height = 1;
            const pctx = probe.getContext('2d');
            pctx.drawImage(art, 0, 0, 1, 1);
            pctx.getImageData(0, 0, 1, 1);
            return art;
        } catch (e) {
            const canvas = document.createElement('canvas');
            canvas.width = 1080;
            canvas.height = 1920;
            const ctx = canvas.getContext('2d');
            ctx.scale(2, 2);
            ComicArtGenerator.drawScene0_NeonStreet(ctx, 540, 960);
            return canvas;
        }
    },

    // 以 540x960 的邏輯座標作圖（跟遊戲畫面同一套尺寸），輸出時放大 2 倍 = 1080x1920
    renderCard(art, info) {
        const S = 2;
        const W = 540;
        const H = 960;
        const canvas = document.createElement('canvas');
        canvas.width = W * S;
        canvas.height = H * S;
        const ctx = canvas.getContext('2d');
        ctx.scale(S, S);
        drawShareCard(ctx, W, H, art, info);
        return new Promise((resolve, reject) => {
            try {
                canvas.toBlob(blob => {
                    if (blob) resolve(new File([blob], 'truehobo-result.jpg', { type: 'image/jpeg' }));
                    else reject(new Error('toBlob failed'));
                }, 'image/jpeg', 0.92);
            } catch (e) {
                reject(e);
            }
        });
    }
};

// 文字（可描邊、錯位黑影）；超過 maxW 會自動縮小字級
function cardText(ctx, str, x, y, opts) {
    let size = opts.size;
    const font = s => `${opts.italic ? 'italic ' : ''}${opts.weight ?? 900} ${s}px ${FONT_SERIF}`;
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
    return ctx.measureText(str).width;
}

function cardRoundRect(ctx, x, y, w, h, r) {
    ctx.beginPath();
    if (ctx.roundRect) ctx.roundRect(x, y, w, h, r);
    else ctx.rect(x, y, w, h);
}

// 漫畫分格框：錯位黑影 + 底色 + 黑框（+ 內側細框）
function cardPanel(ctx, x, y, w, h, opts) {
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(x + opts.shadow, y + opts.shadow, w, h);
    ctx.fillStyle = opts.fill;
    ctx.fillRect(x, y, w, h);
    ctx.lineWidth = opts.border;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, w, h);
    if (opts.accent) {
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = opts.accent;
        ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
    }
}

// 戰績圖（9:16）：0.webp 背景 + 標題 + 跟結算畫面相同的結算面板 + 遊戲網址
function drawShareCard(ctx, W, H, art, info) {
    const cx = W / 2;
    // 面板內各元素的位置都跟結算畫面一樣（相對面板上緣）
    const L = { title: 60, en: 98, panel: 132, cta: 772, url: 828, tags: 878 };

    // 背景：0.webp（霓虹街頭的阿睿），稍微壓暗讓字清楚
    ctx.fillStyle = '#080a0f';
    ctx.fillRect(0, 0, W, H);
    if (art && art.width) {
        const s = Math.max(W / art.width, H / art.height);
        const dw = art.width * s;
        const dh = art.height * s;
        ctx.drawImage(art, (W - dw) / 2, (H - dh) / 2, dw, dh);
    }
    const shade = ctx.createLinearGradient(0, 0, 0, H);
    shade.addColorStop(0, 'rgba(5,6,10,0.55)');
    shade.addColorStop(0.3, 'rgba(5,6,10,0.25)');
    shade.addColorStop(0.75, 'rgba(5,6,10,0.35)');
    shade.addColorStop(1, 'rgba(5,6,10,0.85)');
    ctx.fillStyle = shade;
    ctx.fillRect(0, 0, W, H);

    // 標題：街友本色 I - 煙屁股大作戰（跟封面一樣的金橘漸層）
    const titleGrad = ctx.createLinearGradient(0, L.title - 20, 0, L.title + 20);
    titleGrad.addColorStop(0, '#fff3b0');
    titleGrad.addColorStop(0.45, '#fbbf24');
    titleGrad.addColorStop(1, '#ea580c');
    cardText(ctx, SHARE_TITLE, cx, L.title, { size: 38, color: titleGrad, stroke: 8, shadow: 4, maxW: W - 40 });
    cardText(ctx, 'True Hobo I: Butt Brawl', cx, L.en, { size: 18, color: '#fde68a', stroke: 5 });

    // 結算面板（與結算畫面相同：評等、分數、菸屁股卡片、統計、評語）
    const P = L.panel;
    cardPanel(ctx, 18, P, W - 36, 580, { fill: 'rgba(11,14,20,0.9)', border: 3, shadow: 8, accent: 'rgba(217,119,6,0.8)' });

    cardText(ctx, '⏱ 60 秒時間到・街頭結算', cx, P + 38, { size: 16, weight: 700, color: '#f59e0b' });
    cardText(ctx, info.rankTitle, cx, P + 80, { size: 26, color: info.rankColor, stroke: 6, shadow: 4, maxW: W - 70 });
    cardText(ctx, '最終總得分', cx, P + 124, { size: 14, weight: 400, color: '#a8a29e' });
    cardText(ctx, `${info.score}`, cx, P + 178, { size: 72, color: '#fef08a', stroke: 7, shadow: 5 });

    drawShareButtCard(ctx, 42, P + 238, W - 84, 90, info.butt);

    const stats = [
        { label: '🔥 黃金過癮區停留', val: `${info.goldenTime} 秒` },
        { label: '⚡ 最高連吸 Combo', val: `${info.maxCombo} 連段` },
        { label: '🥵 燙到手嘴罵台語次數', val: `${info.burnCount} 次` }
    ];
    stats.forEach((st, i) => {
        const y = P + 356 + i * 46;
        ctx.fillStyle = 'rgba(22,27,38,0.92)';
        ctx.fillRect(42, y - 19, W - 84, 38);
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#000';
        ctx.strokeRect(42, y - 19, W - 84, 38);
        cardText(ctx, st.label, 56, y, { size: 14, weight: 400, color: '#d6d3d1', align: 'left' });
        cardText(ctx, st.val, W - 56, y, { size: 15, weight: 700, color: '#fbbf24', align: 'right' });
    });

    // 評語框
    const qy = P + 485;
    cardPanel(ctx, 42, qy, W - 84, 70, { fill: '#f2e8cf', border: 3, shadow: 5 });
    const quoteFont = `italic 700 14px ${FONT_SERIF}`;
    const lines = wrapCJK(info.rankQuote, quoteFont, W - 116).split('\n');
    const lineH = 20;
    lines.forEach((line, i) => {
        cardText(ctx, line, cx, qy + 35 + (i - (lines.length - 1) / 2) * lineH, { size: 14, weight: 700, italic: true, color: '#1c1917' });
    });

    // 號召 + 遊戲網址（IG 連結不能點，網址直接印在圖上）
    cardText(ctx, '你也來撿一根試試？', cx, L.cta, { size: 26, color: '#ffffff', stroke: 6 });
    ctx.font = `900 17px ${FONT_SERIF}`;
    const urlText = `👉 ${SHARE_URL_LABEL}`;
    const urlW = ctx.measureText(urlText).width + 44;
    const urlH = 38;
    ctx.fillStyle = 'rgba(0,0,0,0.9)';
    cardRoundRect(ctx, cx - urlW / 2 + 4, L.url - urlH / 2 + 4, urlW, urlH, 19);
    ctx.fill();
    ctx.fillStyle = '#f59e0b';
    cardRoundRect(ctx, cx - urlW / 2, L.url - urlH / 2, urlW, urlH, 19);
    ctx.fill();
    ctx.lineWidth = 3;
    ctx.strokeStyle = '#000';
    ctx.stroke();
    cardText(ctx, urlText, cx, L.url + 1, { size: 17, color: '#111111' });
    cardText(ctx, SHARE_TAGS, cx, L.tags, { size: 15, weight: 700, color: '#e7e5e4', stroke: 4 });
}

/**
 * 分享按鈕上的社群圖示（白色，放在品牌色按鈕上）：用基本圖形畫，不另外載入圖檔
 * 以 22x22 的邏輯尺寸、3 倍解析度畫進貼圖，顯示時縮回 1/3 才會銳利
 */
const SOCIAL_ICON = { size: 22, res: 3 };
function ensureSocialIcons(scene) {
    const make = (key, draw) => {
        if (scene.textures.exists(key)) return;
        const px = SOCIAL_ICON.size * SOCIAL_ICON.res;
        const tex = scene.textures.createCanvas(key, px, px);
        const ctx = tex.getContext();
        ctx.scale(SOCIAL_ICON.res, SOCIAL_ICON.res);
        draw(ctx);
        tex.refresh();
    };
    const SANS = '"Helvetica Neue", Helvetica, Arial, sans-serif';

    // Instagram：圓角方框 + 鏡頭圓圈 + 右上角小圓點
    make('icon-instagram', ctx => {
        ctx.strokeStyle = '#ffffff';
        ctx.fillStyle = '#ffffff';
        ctx.lineWidth = 2.2;
        cardRoundRect(ctx, 2.5, 2.5, 17, 17, 5.2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(11, 11, 4.1, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.arc(15.9, 6.1, 1.25, 0, Math.PI * 2);
        ctx.fill();
    });

    // Facebook：白色圓形 + 藍色 f
    make('icon-facebook', ctx => {
        ctx.fillStyle = '#ffffff';
        ctx.beginPath();
        ctx.arc(11, 11, 10, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = '#1877f2';
        ctx.font = `bold 19px ${SANS}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'alphabetic';
        ctx.fillText('f', 12.2, 21.5);
    });

    // Threads：白色 @
    make('icon-threads', ctx => {
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 21px ${SANS}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('@', 11, 12);
    });
}

// 菸屁股卡片（跟結算畫面的 createButtCard 同一個樣子）
function drawShareButtCard(ctx, x, y, w, h, butt) {
    const color = butt.badgeColor;
    ctx.fillStyle = 'rgba(0,0,0,0.85)';
    ctx.fillRect(x + 5, y + 5, w, h);
    ctx.fillStyle = 'rgba(22,27,38,0.95)';
    ctx.fillRect(x, y, w, h);
    ctx.lineWidth = 2.5;
    ctx.strokeStyle = '#000';
    ctx.strokeRect(x, y, w, h);
    ctx.save();
    ctx.globalAlpha = 0.55;
    ctx.lineWidth = 1.5;
    ctx.strokeStyle = color;
    ctx.strokeRect(x + 5, y + 5, w - 10, h - 10);
    ctx.restore();
    ctx.fillStyle = color;
    ctx.fillRect(x, y, 8, h);

    const left = x + 18;
    const right = x + w - 18;
    const row1 = y + 18;
    const row2 = y + 46;
    const row3 = y + 74;

    // 小菸屁股圖示 + 「阿睿這次抽的是」
    ctx.save();
    ctx.translate(left, row1 - 7);
    drawButtShape(ctx, 19, 10, 10);
    ctx.restore();
    cardText(ctx, '阿睿這次抽的是', left + BUTT_ICON.w + 6, row1, { size: 12, weight: 700, color: '#a8a29e', align: 'left' });
    cardText(ctx, `${butt.difficultyLabel} ${butt.stars}`, right, row1, { size: 12, color, align: 'right' });

    cardText(ctx, `【${butt.name}】`, left, row2, { size: 22, color, stroke: 4, align: 'left' });
    // 菸屁股圖（該菸蒂原本剩下的菸紙長度），1.3 倍
    const picScale = 1.3;
    const picW = (CIG_BAR.filterW + butt.stubLen + 10) * picScale;
    ctx.save();
    ctx.translate(right - picW, row2 - ((CIG_BAR.h + 4) / 2) * picScale);
    ctx.scale(picScale, picScale);
    drawButtShape(ctx, CIG_BAR.filterW, butt.stubLen, CIG_BAR.h);
    ctx.restore();

    cardText(ctx, butt.subtitle, left, row3, { size: 12, weight: 400, color: '#d6d3d1', align: 'left' });
    cardText(ctx, `得分倍率 x${butt.scoreMultiplier.toFixed(1)} · 過癮區 ${butt.sweetMax - butt.sweetMin}%`, right, row3, { size: 12, weight: 700, color: '#fbbf24', align: 'right' });
}
