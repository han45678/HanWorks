/**
 * ============================================================================
 * 5. SHARED VISUAL FX (柔光、煙霧、雨絲、暗角、底片顆粒、漫畫框)
 * ============================================================================
 */
const FxTextures = {
    generate(scene) {
        const make = (key, w, h, draw) => {
            if (scene.textures.exists(key)) return;
            const canvasTex = scene.textures.createCanvas(key, w, h);
            draw(canvasTex.getContext(), w, h);
            canvasTex.refresh();
        };

        // 柔光圓：霓虹、菸頭、路燈光暈
        make('fx-glow', 128, 128, (ctx, w, h) => {
            const g = ctx.createRadialGradient(w / 2, h / 2, 0, w / 2, h / 2, w / 2);
            g.addColorStop(0, 'rgba(255,255,255,1)');
            g.addColorStop(0.25, 'rgba(255,255,255,0.55)');
            g.addColorStop(0.6, 'rgba(255,255,255,0.12)');
            g.addColorStop(1, 'rgba(255,255,255,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
        });

        // 煙霧團：幾顆柔邊圓疊出不規則的雲
        make('fx-smoke', 128, 128, (ctx, w, h) => {
            for (let i = 0; i < 9; i++) {
                const a = (i / 9) * Math.PI * 2;
                const r = 18 + (i % 3) * 7;
                const cx = w / 2 + Math.cos(a) * 16;
                const cy = h / 2 + Math.sin(a) * 14;
                const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, r + 14);
                g.addColorStop(0, 'rgba(255,255,255,0.32)');
                g.addColorStop(1, 'rgba(255,255,255,0)');
                ctx.fillStyle = g;
                ctx.fillRect(0, 0, w, h);
            }
        });

        make('fx-rain', 4, 64, (ctx, w, h) => {
            const g = ctx.createLinearGradient(0, 0, 0, h);
            g.addColorStop(0, 'rgba(200,225,255,0)');
            g.addColorStop(1, 'rgba(200,225,255,0.9)');
            ctx.fillStyle = g;
            ctx.fillRect(1, 0, 2, h);
        });

        make('fx-spark', 16, 16, (ctx, w, h) => {
            const g = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
            g.addColorStop(0, 'rgba(255,255,230,1)');
            g.addColorStop(0.4, 'rgba(255,190,80,0.9)');
            g.addColorStop(1, 'rgba(255,80,0,0)');
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
        });

        // 暗角（黑）與燙傷閃紅（紅）分開做，Canvas renderer 不支援 tint
        const vignette = (rgb) => (ctx, w, h) => {
            const g = ctx.createRadialGradient(w / 2, h * 0.48, w * 0.32, w / 2, h * 0.5, h * 0.62);
            g.addColorStop(0, `rgba(${rgb},0)`);
            g.addColorStop(1, `rgba(${rgb},1)`);
            ctx.fillStyle = g;
            ctx.fillRect(0, 0, w, h);
        };
        make('fx-vignette', 270, 480, vignette('0,0,0'));
        make('fx-vignette-red', 270, 480, vignette('220,20,0'));

        // 底片顆粒：黑白雜點各帶隨機透明度
        make('fx-grain', 128, 128, (ctx, w, h) => {
            const img = ctx.createImageData(w, h);
            for (let i = 0; i < img.data.length; i += 4) {
                const v = Math.random() < 0.5 ? 0 : 255;
                img.data[i] = img.data[i + 1] = img.data[i + 2] = v;
                img.data[i + 3] = Math.random() * 90;
            }
            ctx.putImageData(img, 0, 0);
        });

        // 漫畫網點
        make('fx-halftone', 10, 10, (ctx) => {
            ctx.fillStyle = 'rgba(60,40,20,0.22)';
            ctx.beginPath();
            ctx.arc(5, 5, 1.8, 0, Math.PI * 2);
            ctx.fill();
        });

        // 菸屁股圖示（取代 🚬）：用高解析度畫，顯示時再縮回來才夠銳利
        make('icon-butt', BUTT_ICON.w * BUTT_ICON.res, BUTT_ICON.h * BUTT_ICON.res, (ctx) => {
            ctx.scale(BUTT_ICON.res, BUTT_ICON.res);
            drawButtShape(ctx, 19, 10, 10);
        });
    }
};

// 菸屁股：濾嘴 + 一小截皺掉的菸紙 + 捻熄燒焦的頭（🚬 表情符號畫的是整根新菸，不像撿來的菸蒂）
// 圖示與 HUD 共用；座標為邏輯像素（ctx 已依解析度縮放），四周留 2px 給描邊；回傳菸紙末端的 x
const BUTT_ICON = { w: 39, h: 14, res: 3 };
const CIG_BAR = { filterW: 36, h: 14 };
function drawButtShape(ctx, filterW, paperW, h) {
    const x0 = 2;
    const top = 2;
    const bottom = top + h;
    const x1 = x0 + filterW;
    const x2 = x1 + paperW;
    const jag = Math.min(4, h * 0.3);
    ctx.lineJoin = 'round';
    ctx.lineWidth = 1.6;
    ctx.strokeStyle = '#000';

    // 菸紙：尾端被捻熄壓扁，邊緣參差
    const paper = new Path2D();
    paper.moveTo(x1, top + 0.6);
    paper.lineTo(x2, top + 0.6);
    paper.lineTo(x2 + jag, top + h * 0.22);
    paper.lineTo(x2 + jag * 0.25, top + h * 0.45);
    paper.lineTo(x2 + jag * 0.9, top + h * 0.7);
    paper.lineTo(x2 + jag * 0.1, bottom - 0.6);
    paper.lineTo(x1, bottom - 0.6);
    paper.closePath();
    ctx.fillStyle = '#e9e2d1';
    ctx.fill(paper);

    ctx.save();
    ctx.clip(paper);
    // 靠濾嘴那段被菸油燻黃
    const stain = ctx.createLinearGradient(x1, 0, x1 + Math.max(6, paperW * 0.7), 0);
    stain.addColorStop(0, 'rgba(176,128,52,0.55)');
    stain.addColorStop(1, 'rgba(176,128,52,0)');
    ctx.fillStyle = stain;
    ctx.fillRect(x1, top, paperW + jag, h);
    // 皺摺
    if (paperW > 9) {
        ctx.strokeStyle = 'rgba(60,45,30,0.35)';
        ctx.lineWidth = 0.8;
        [0.38, 0.68].forEach((t, i) => {
            const cx = x1 + paperW * t;
            ctx.beginPath();
            ctx.moveTo(cx - 1.5, top + (i ? h * 0.55 : 1));
            ctx.lineTo(cx + 1.5, top + (i ? h - 1 : h * 0.5));
            ctx.stroke();
        });
    }
    // 燒焦的頭 + 灰燼
    const charW = Math.min(5, paperW * 0.7);
    ctx.fillStyle = '#2f2723';
    ctx.fillRect(x2 - charW, top, charW + jag + 1, h);
    ctx.fillStyle = '#8d8781';
    [[0.3, 0.3], [0.65, 0.62], [0.2, 0.82]].forEach(([tx, ty]) => {
        ctx.beginPath();
        ctx.arc(x2 - charW + (charW + jag) * tx, top + h * ty, h * 0.09, 0, Math.PI * 2);
        ctx.fill();
    });
    ctx.restore();
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 1.6;
    ctx.stroke(paper);

    // 濾嘴：軟木紋 + 金線
    ctx.fillStyle = '#d9893a';
    ctx.fillRect(x0, top, filterW, h);
    ctx.fillStyle = '#f6c27a';
    for (let i = 0; i * 5 + 3 < filterW - 3; i++) {
        ctx.beginPath();
        ctx.arc(x0 + 3 + i * 5, top + h * (i % 2 ? 0.68 : 0.32), h * 0.09, 0, Math.PI * 2);
        ctx.fill();
    }
    ctx.fillStyle = '#f2d27a';
    ctx.fillRect(x1 - 2.2, top, 1.2, h);
    ctx.strokeRect(x0, top, filterW, h);
    return x2;
}

// 燙度計漸層依各菸蒂的黃金區間產生（下綠→黃金區→上紅）
function ensureHeatTexture(scene, butt) {
    const key = `fx-heat-${butt.id}`;
    if (scene.textures.exists(key)) return key;
    const w = 40, h = 600;
    const canvasTex = scene.textures.createCanvas(key, w, h);
    const ctx = canvasTex.getContext();
    const lo = butt.sweetMin / 100;
    const hi = butt.sweetMax / 100;
    const g = ctx.createLinearGradient(0, h, 0, 0);
    g.addColorStop(0, '#15803d');
    g.addColorStop(lo - 0.08, '#65a30d');
    g.addColorStop(lo, '#facc15');
    g.addColorStop(hi, '#f59e0b');
    g.addColorStop(Math.min(1, hi + 0.04), '#f97316');
    g.addColorStop(1, '#dc2626');
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.fillStyle = 'rgba(255,255,255,0.25)';
    ctx.fillRect(w * 0.18, 0, w * 0.14, h);
    canvasTex.refresh();
    return key;
}

// 帶顏色的柔光圓：直接把顏色畫進貼圖，不用 setTint（Canvas 模式不支援 tint，本機開檔時會用 Canvas）
function glowKey(scene, color) {
    const key = `fx-glow-${color.toString(16)}`;
    if (scene.textures.exists(key)) return key;
    const { r, g, b } = Phaser.Display.Color.IntegerToRGB(color);
    const canvasTex = scene.textures.createCanvas(key, 128, 128);
    const ctx = canvasTex.getContext();
    const grad = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
    [[0, 1], [0.25, 0.55], [0.6, 0.12], [1, 0]].forEach(([stop, a]) => grad.addColorStop(stop, `rgba(${r},${g},${b},${a})`));
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 128, 128);
    canvasTex.refresh();
    return key;
}

// 上下壓暗用的垂直漸層（Graphics 的 fillGradientStyle 只有 WebGL 支援）
function shadeKey(scene, rgb, topAlpha, bottomAlpha) {
    const key = `fx-shade-${rgb}-${topAlpha}-${bottomAlpha}`;
    if (scene.textures.exists(key)) return key;
    const canvasTex = scene.textures.createCanvas(key, 4, 256);
    const ctx = canvasTex.getContext();
    const grad = ctx.createLinearGradient(0, 0, 0, 256);
    grad.addColorStop(0, `rgba(${rgb},${topAlpha})`);
    grad.addColorStop(1, `rgba(${rgb},${bottomAlpha})`);
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 4, 256);
    canvasTex.refresh();
    return key;
}

function hexColor(str) {
    return Phaser.Display.Color.HexStringToColor(str).color;
}

function setupView(scene) {
    scene.cameras.main.setZoom(RENDER_SCALE).centerOn(GAME_W / 2, GAME_H / 2);
}

// 依原圖比例鋪滿畫面（cover），不再硬拉成 540x960
function fitCover(img) {
    const s = Math.max(GAME_W / img.width, GAME_H / img.height);
    img.setPosition(GAME_W / 2, GAME_H / 2).setScale(s);
    img.baseScale = s;
    return img;
}

function addArtImage(scene, key, depth = 0) {
    return fitCover(scene.add.image(GAME_W / 2, GAME_H / 2, key).setDepth(depth));
}

// 以 focus 為定點慢慢推近（Ken Burns），focus 在畫面上的位置維持不動
function kenBurns(scene, img, focus, zoom = 1.06, duration = 6000, yoyo = false) {
    scene.tweens.killTweensOf(img);
    const s = img.baseScale;
    img.setPosition(GAME_W / 2, GAME_H / 2).setScale(s);
    scene.tweens.add({
        targets: img,
        scale: s * zoom,
        x: focus.x + (GAME_W / 2 - focus.x) * zoom,
        y: focus.y + (GAME_H / 2 - focus.y) * zoom,
        duration,
        ease: 'Sine.easeInOut',
        yoyo,
        repeat: yoyo ? -1 : 0
    });
}

// 記錄物件在原圖上的座標，之後用 syncToArt 讓它跟著鏡頭推移
function trackArt(obj) {
    obj.artX = obj.x;
    obj.artY = obj.y;
    obj.artScaleX = obj.scaleX;
    obj.artScaleY = obj.scaleY;
    return obj;
}

function syncToArt(img, objs) {
    const k = img.scale / img.baseScale;
    objs.forEach(o => {
        if (!o.active) return;
        o.x = img.x + (o.artX - GAME_W / 2) * k;
        o.y = img.y + (o.artY - GAME_H / 2) * k;
        o.setScale(o.artScaleX * k, o.artScaleY * k);
    });
}

// 霓虹招牌：ADD 光暈 + 偶爾接觸不良的閃爍
function addNeonGlow(scene, signs, depth = 3) {
    const objs = [];
    (signs || []).forEach(sign => {
        const glow = scene.add.image(sign.x, sign.y, glowKey(scene, sign.color))
            .setDisplaySize(sign.w * 2.6 + 30, sign.h * 1.5 + 30)
            .setBlendMode(ADD)
            .setDepth(depth);
        const dim = scene.add.rectangle(sign.x, sign.y, sign.w, sign.h, 0x000000, 1)
            .setAlpha(0)
            .setDepth(depth);
        const base = Phaser.Math.FloatBetween(0.32, 0.46);
        glow.setAlpha(base);

        const flicker = () => {
            if (!glow.active) return;
            if (Math.random() < 0.12) {
                const steps = [[0, 0.05, 0.55], [60, base + 0.15, 0], [120, 0.08, 0.45], [190, base, 0]];
                steps.forEach(([delay, glowAlpha, dimAlpha]) => {
                    scene.time.delayedCall(delay, () => {
                        if (!glow.active) return;
                        glow.setAlpha(glowAlpha);
                        dim.setAlpha(dimAlpha);
                    });
                });
            } else {
                glow.setAlpha(base + Phaser.Math.FloatBetween(-0.06, 0.06));
            }
            scene.time.delayedCall(Phaser.Math.Between(140, 1100), flicker);
        };
        flicker();
        objs.push(trackArt(glow), trackArt(dim));
    });
    return objs;
}

function addLampGlow(scene, lamp, depth = 3) {
    if (!lamp) return [];
    const glow = scene.add.image(lamp.x, lamp.y, glowKey(scene, 0x9fe7ff))
        .setBlendMode(ADD)
        .setScale(1.1)
        .setAlpha(0.35)
        .setDepth(depth);
    scene.tweens.add({ targets: glow, alpha: 0.2, duration: 1800, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
    return [trackArt(glow)];
}

function addRain(scene, opts = {}) {
    const density = opts.density ?? 1;
    return scene.add.particles(0, 0, 'fx-rain', {
        x: { min: -60, max: GAME_W + 20 },
        y: { min: -90, max: -20 },
        speedY: { min: 950, max: 1250 },
        speedX: { min: -150, max: -110 },
        rotate: 7,
        scaleX: 0.5,
        scaleY: { min: 0.5, max: 1.1 },
        alpha: { min: 0.1, max: 0.3 },
        lifespan: 1150,
        frequency: Math.round(22 / density),
        blendMode: ADD
    }).setDepth(opts.depth ?? 8);
}

// 暗角 + 底片顆粒，讓整體更接近原圖的漫畫印刷質感
function addFilmFinish(scene, opts = {}) {
    const depth = opts.depth ?? 9;
    scene.add.image(GAME_W / 2, GAME_H / 2, 'fx-vignette')
        .setDisplaySize(GAME_W, GAME_H)
        .setAlpha(opts.vignette ?? 0.55)
        .setDepth(depth);
    const grain = scene.add.tileSprite(GAME_W / 2, GAME_H / 2, GAME_W, GAME_H, 'fx-grain')
        .setTileScale(0.5)
        .setAlpha(opts.grain ?? 0.4)
        .setDepth(depth);
    scene.time.addEvent({
        delay: 70,
        loop: true,
        callback: () => grain.setTilePosition(Phaser.Math.Between(0, 127), Phaser.Math.Between(0, 127))
    });
}

function setEmitting(emitter, on) {
    if (on && !emitter.emitting) emitter.start();
    else if (!on && emitter.emitting) emitter.stop();
}

// 漫畫分格：黑色粗框 + 錯位黑影（x, y 為左上角），回傳組成的所有物件
function drawComicPanel(scene, x, y, w, h, opts = {}) {
    const depth = opts.depth ?? 20;
    const shadow = opts.shadow ?? 6;
    const parts = [];
    const g = scene.add.graphics().setDepth(depth);
    if (shadow) {
        g.fillStyle(0x000000, 0.85);
        g.fillRect(x + shadow, y + shadow, w, h);
    }
    g.fillStyle(opts.fill ?? 0x0d1017, opts.alpha ?? 0.92);
    g.fillRect(x, y, w, h);
    parts.push(g);
    if (opts.halftone) {
        parts.push(scene.add.tileSprite(x + w / 2, y + h / 2, w, h, 'fx-halftone')
            .setTileScale(0.6)
            .setAlpha(0.7)
            .setDepth(depth));
    }
    const frame = scene.add.graphics().setDepth(depth);
    frame.lineStyle(opts.border ?? 3, 0x000000, 1);
    frame.strokeRect(x, y, w, h);
    if (opts.accent !== undefined) {
        frame.lineStyle(1.5, opts.accent, opts.accentAlpha ?? 0.9);
        frame.strokeRect(x + 5, y + 5, w - 10, h - 10);
    }
    parts.push(frame);
    return parts;
}

// 色塊標籤（章節名、副標題）
function addTagLabel(scene, x, y, label, opts = {}) {
    const text = scene.add.text(0, 0, label, {
        fontFamily: opts.fontFamily ?? FONT_UI,
        fontSize: opts.fontSize ?? '16px',
        fontStyle: '900',
        color: opts.color ?? '#ffffff'
    }).setOrigin(0.5);
    const padX = opts.padX ?? 14;
    const padY = opts.padY ?? 5;
    const w = text.width + padX * 2;
    const h = text.height + padY * 2;
    const shadow = opts.shadow ?? 4;
    const g = scene.add.graphics();
    if (shadow) {
        g.fillStyle(0x000000, 0.9);
        g.fillRect(-w / 2 + shadow, -h / 2 + shadow, w, h);
    }
    g.fillStyle(opts.fill ?? 0xb91c1c, 1);
    g.fillRect(-w / 2, -h / 2, w, h);
    g.lineStyle(opts.border ?? 3, 0x000000, 1);
    g.strokeRect(-w / 2, -h / 2, w, h);
    const tag = scene.add.container(x, y, [g, text]).setDepth(opts.depth ?? 21);
    if (opts.angle) tag.setAngle(opts.angle);
    tag.boxW = w;
    tag.boxH = h;
    return tag;
}

function createComicButton(scene, x, y, w, h, label, opts = {}) {
    const shadow = opts.shadow ?? 6;
    const g = scene.add.graphics();
    g.fillStyle(0x000000, 0.9);
    g.fillRect(-w / 2 + shadow, -h / 2 + shadow, w, h);
    g.fillStyle(opts.fill ?? 0xf59e0b, 1);
    g.fillRect(-w / 2, -h / 2, w, h);
    g.fillStyle(0xffffff, opts.shine ?? 0.2);
    g.fillRect(-w / 2, -h / 2, w, h * 0.42);
    g.lineStyle(opts.border ?? 3.5, 0x000000, 1);
    g.strokeRect(-w / 2, -h / 2, w, h);
    const text = scene.add.text(0, 1, label, {
        fontFamily: FONT_UI,
        fontSize: opts.fontSize ?? '22px',
        fontStyle: '900',
        color: opts.color ?? '#0b0b0b'
    }).setOrigin(0.5);
    const parts = [g, text];
    // opts.icon：文字前面的菸屁股圖示，圖示 + 文字整組置中
    if (opts.icon) parts.push(...placeIconBeforeText(scene, text, 0, 1, 0.5, opts.iconScale));
    const btn = scene.add.container(x, y, parts).setDepth(opts.depth ?? 25);
    btn.setSize(w, h).setInteractive({ useHandCursor: true });
    return btn;
}

// 在文字前面放菸屁股圖示，originX 決定整組（圖示 + 文字）以 x 為左緣/中心/右緣
function placeIconBeforeText(scene, text, x, y, originX = 0.5, iconScale = 1) {
    const icon = scene.add.image(0, y, 'icon-butt').setScale(iconScale / BUTT_ICON.res);
    const gap = 6;
    const left = x - (icon.displayWidth + gap + text.width) * originX;
    icon.x = left + icon.displayWidth / 2;
    text.setOrigin(0, 0.5).setPosition(left + icon.displayWidth + gap, y);
    if (text.depth) icon.setDepth(text.depth);
    return [icon];
}

// 中文沒有空白可斷行，依實際字寬手動換行
function wrapCJK(text, font, maxWidth) {
    const ctx = wrapCJK.ctx || (wrapCJK.ctx = document.createElement('canvas').getContext('2d'));
    ctx.font = font;
    return text.split('\n').map(para => {
        const lines = [];
        let line = '';
        for (const ch of para) {
            if (line && ctx.measureText(line + ch).width > maxWidth) {
                lines.push(line);
                line = ch;
            } else {
                line += ch;
            }
        }
        lines.push(line);
        return lines.join('\n');
    }).join('\n');
}

// 台語罵聲在「！」處斷成兩行（取兩行長度最平均的位置），讓爆炸框可以窄一點
function splitShout(line) {
    const chars = Array.from(line);
    let best = line;
    let bestMax = chars.length;
    chars.forEach((ch, i) => {
        if (ch !== '！' || i === chars.length - 1) return;
        const longest = Math.max(i + 1, chars.length - i - 1);
        if (longest < bestMax) {
            bestMax = longest;
            best = `${chars.slice(0, i + 1).join('')}\n${chars.slice(i + 1).join('')}`;
        }
    });
    return best;
}

// 燙到時的漫畫爆炸對話框，tail 指向嘴巴
function drawShoutBurst(g, w, h, tail) {
    const spikes = 16;
    const pts = [];
    for (let i = 0; i < spikes * 2; i++) {
        const a = (i / (spikes * 2)) * Math.PI * 2 - Math.PI / 2;
        const r = i % 2 === 0 ? 1 + ((i * 7) % 5) * 0.025 : 0.8;
        pts.push({ x: Math.cos(a) * (w / 2) * r, y: Math.sin(a) * (h / 2) * r });
    }
    const tailPts = [
        { x: tail.baseX - 24, y: tail.baseY },
        { x: tail.baseX + 24, y: tail.baseY },
        { x: tail.x, y: tail.y }
    ];
    const offset = (list, d) => list.map(p => ({ x: p.x + d, y: p.y + d }));
    g.fillStyle(0x000000, 0.85);
    g.fillPoints(offset(tailPts, 6), true);
    g.fillPoints(offset(pts, 7), true);
    g.fillStyle(0xffffff, 1);
    g.fillPoints(tailPts, true);
    g.lineStyle(4, 0x000000, 1);
    g.strokePoints(tailPts, true, true);
    g.fillStyle(0xffffff, 1);
    g.fillPoints(pts, true);
    g.fillStyle(0xfde047, 1);
    g.fillPoints(pts.map(p => ({ x: p.x * 0.82, y: p.y * 0.82 })), true);
    g.fillStyle(0xffffff, 1);
    g.fillEllipse(0, 0, w * 0.74, h * 0.62);
    g.lineStyle(4, 0x000000, 1);
    g.strokePoints(pts, true, true);
}

// 先載入網頁字型再建立文字，避免 Canvas 文字先用系統字型畫好就定型
function loadWebFonts() {
    if (!document.fonts || !document.fonts.load) return Promise.resolve();
    const sample = [
        '街友本色煙屁股大作戰阿睿的巷弄菸屁股生存戰台灣街頭寫實黑色幽默大作點擊進入遊戲跳過劇情繼續挑選',
        '剩餘時間總分菸蒂長度燙度黃金過癮區壓住此處不放抽煙太燙前要適時放開最終得分結算阿睿這次抽的是倍率狂飆中',
        '分享戰績貼文限動在選單已複製連結可到紙或說明字下載請用手機發佈還產生中再按一次視窗被瀏覽器擋了允許彈出後試',
        ...CIGARETTE_BUTTS.map(b => b.name + b.subtitle + b.desc + b.difficultyLabel)
    ].join('');
    const jobs = [
        ...[400, 700, 900].flatMap(weight => [
            document.fonts.load(`${weight} 20px "Noto Serif TC"`, sample),
            document.fonts.load(`${weight} 20px "Noto Serif"`, 'True Hobo I: Butt Brawl Combo 0123456789.s%x()|+-')
        ])
    ].map(p => p.catch(() => { }));
    return Promise.race([Promise.all(jobs), new Promise(resolve => setTimeout(resolve, 3000))]);
}
