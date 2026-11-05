// ----------------------------------------------------------------------------
// SCENE F: SETTLEMENT SCREEN (60秒結算遊戲總分)
// ----------------------------------------------------------------------------
class ResultScene extends Phaser.Scene {
    constructor() {
        super({ key: 'ResultScene' });
    }

    create() {
        setupView(this);
        const W = GAME_W;
        const H = GAME_H;
        const res = GAME_STATE.lastResult || {
            score: 0,
            butt: CIGARETTE_BUTTS[0],
            burnCount: 0,
            maxCombo: 0,
            goldenTime: '0.0'
        };

        this.cameras.main.fadeIn(400, 0, 0, 0);

        // Background：阿睿抽著菸的側臉，壓暗當結算底圖
        const bg = addArtImage(this, 'img6');
        kenBurns(this, bg, ART_FX.img6.ember, 1.06, 10000, true);
        addRain(this, { density: 0.7 });
        addFilmFinish(this, { vignette: 0.7 });
        this.add.rectangle(W / 2, H / 2, W, H, 0x05060a, 0.5).setDepth(10);

        // Rank Evaluation
        let rankTitle = '【滿嘴水泡的街頭菜鳥】';
        let rankQuote = '「阿睿嘴唇腫得像香腸，下次記得別吸太猛啊！」';
        let rankColor = '#9ca3af';

        if (res.score >= 8500) {
            rankTitle = '【傳說巷弄菸神・街友本色】';
            rankQuote = '「連剩 3mm 的菸屁股都能抽得行雲流水，整條巷子都尊稱阿睿一聲哥！」';
            rankColor = '#fbbf24';
        } else if (res.score >= 4500) {
            rankTitle = '【老練控溫撿菸客】';
            rankQuote = '「收放自如、深諳菸蒂燃燒物理學，這口煙抽出了人生哲學！」';
            rankColor = '#4ade80';
        } else if (res.score >= 1800) {
            rankTitle = '【巷口資深吞雲者】';
            rankQuote = '「雖然偶爾被燙到罵幾句台語，但總算過足了菸癮！」';
            rankColor = '#38bdf8';
        }

        // 分享用的戰績資料；戰績圖（0.webp 當背景）一進結算就先在背景做好（按下分享時才能立刻叫出分享選單）
        this.shareInfo = { ...res, rankTitle, rankColor, rankQuote };
        this.shareImage = null;
        ShareKit.makeImage(this.textures.get('img0').getSourceImage(), this.shareInfo)
            .then(file => { this.shareImage = file; })
            .catch(() => { this.shareImage = false; });

        // Settlement Card
        drawComicPanel(this, 18, 90, W - 36, 788, { fill: 0x0b0e14, alpha: 0.92, accent: 0xd97706, accentAlpha: 0.8, shadow: 8, depth: 20 });

        this.add.text(W / 2, 128, '⏱ 60 秒時間到・街頭結算', {
            fontFamily: FONT_UI,
            fontSize: '16px',
            fontStyle: 'bold',
            color: '#f59e0b'
        }).setOrigin(0.5).setDepth(21);

        const rankTxt = this.add.text(W / 2, 170, rankTitle, {
            fontFamily: FONT_UI,
            fontSize: '26px',
            fontStyle: '900',
            color: rankColor,
            stroke: '#000',
            strokeThickness: 6
        }).setOrigin(0.5).setDepth(21).setShadow(4, 4, '#000', 0, true, false);

        // Total Score Display
        this.add.text(W / 2, 214, '最終總得分', {
            fontFamily: FONT_UI,
            fontSize: '14px',
            color: '#a8a29e'
        }).setOrigin(0.5).setDepth(21);

        const scoreNum = this.add.text(W / 2, 268, '0', {
            fontFamily: FONT_NUM,
            fontSize: '72px',
            fontStyle: '900',
            color: '#fef08a',
            stroke: '#000',
            strokeThickness: 7
        }).setOrigin(0.5).setDepth(21).setShadow(5, 5, '#000', 0, true, false);

        // 這局抽的是哪一根菸屁股：獨立一張卡片（名稱、菸蒂圖、難度、倍率、過癮區寬度）
        const buttCard = this.createButtCard(W, 328, res.butt);

        // Stats Breakdown Box
        const statY = 446;
        const stats = [
            { label: '🔥 黃金過癮區停留', val: `${res.goldenTime} 秒` },
            { label: '⚡ 最高連吸 Combo', val: `${res.maxCombo} 連段` },
            { label: '🥵 燙到手嘴罵台語次數', val: `${res.burnCount} 次` }
        ];

        const statRows = stats.map((st, i) => {
            const y = statY + i * 46;
            return [
                this.add.rectangle(W / 2, y, W - 84, 38, 0x161b26, 0.92).setStrokeStyle(2, 0x000000).setDepth(21),
                this.add.text(56, y, st.label, {
                    fontFamily: FONT_UI, fontSize: '14px', color: '#d6d3d1'
                }).setOrigin(0, 0.5).setDepth(22),
                this.add.text(W - 56, y, st.val, {
                    fontFamily: FONT_UI, fontSize: '15px', fontStyle: 'bold', color: '#fbbf24'
                }).setOrigin(1, 0.5).setDepth(22)
            ];
        });
        statRows.unshift(buttCard);

        // 評語放在漫畫旁白框
        const quoteFont = `italic bold 14px ${FONT_UI}`;
        drawComicPanel(this, 42, 575, W - 84, 70, { fill: PAPER, alpha: 0.97, shadow: 5, halftone: true, depth: 21 });
        this.add.text(W / 2, 610, wrapCJK(rankQuote, quoteFont, W - 116), {
            fontFamily: FONT_UI,
            fontSize: '14px',
            fontStyle: 'italic bold',
            color: INK,
            align: 'center',
            lineSpacing: 4
        }).setOrigin(0.5).setDepth(22);

        // 分享戰績：IG 限時動態／FB 貼文／Threads 貼文
        this.createShareRow(W, 668);

        // Action Buttons
        const btnRetry = createComicButton(this, W / 2, 770, W - 84, 52, '再撿一根 (重選菸屁股挑戰)', { fontSize: '19px', icon: true, iconScale: 1.15 });
        btnRetry.on('pointerdown', () => {
            audioEngine.playLighterFlick();
            this.scene.start('SelectButtScene');
        });

        const btnHome = createComicButton(this, W / 2, 834, W - 84, 44, '🎬 回到遊戲封面', {
            fill: 0x1f2937,
            color: '#e5e7eb',
            fontSize: '16px',
            shadow: 5,
            shine: 0.06
        });
        btnHome.on('pointerdown', () => {
            this.scene.start('CoverScene');
        });

        // 進場動畫：評等蓋章、分數跳動、統計逐列滑入
        rankTxt.setScale(2.2).setAlpha(0);
        this.tweens.add({
            targets: rankTxt,
            scale: 1,
            alpha: 1,
            delay: 250,
            duration: 380,
            ease: 'Back.easeOut',
            onComplete: () => this.cameras.main.shake(140, 0.006)
        });
        this.tweens.addCounter({
            from: 0,
            to: res.score,
            delay: 300,
            duration: 1200,
            ease: 'Cubic.easeOut',
            onUpdate: (tween) => scoreNum.setText(`${Math.floor(tween.getValue())}`)
        });
        statRows.forEach((row, i) => {
            row.forEach(o => {
                const targetX = o.x;
                o.setAlpha(0).setX(targetX + 40);
                this.tweens.add({ targets: o, alpha: 1, x: targetX, delay: 500 + i * 110, duration: 280, ease: 'Quad.easeOut' });
            });
        });
    }

    // 分享列：標題 + 三顆社群圖示按鈕（IG 限時動態／FB 貼文／Threads 貼文）；labelY 為標題的位置，按鈕在下面一列
    createShareRow(W, labelY) {
        ensureSocialIcons(this);
        this.add.text(W / 2, labelY, '📣 分享戰績', {
            fontFamily: FONT_UI, fontSize: '13px', fontStyle: '900', color: '#fbbf24'
        }).setOrigin(0.5).setDepth(22);

        // 三個按鈕都分享戰績圖 + 文字：手機叫系統分享選單；電腦下載戰績圖並開發文頁
        const targets = [
            {
                // 限時動態：只複製網址，玩家加「連結」貼紙時直接貼上
                icon: 'icon-instagram', fill: 0xc13584, copyUrlOnly: true,
                pick: '選 Instagram →「限時動態」，再加「連結」貼紙\n遊戲網址已複製，在貼紙裡貼上即可',
                desktop: '電腦不能直接發 IG 限時動態（要用手機）\n已下載戰績圖、複製網址，並開啟 IG',
                web: () => ShareKit.instagramWeb()
            },
            {
                icon: 'icon-facebook', fill: 0x1877f2,
                pick: '在分享選單選 Facebook\n文字和連結已複製，貼上即可',
                desktop: '電腦不能把圖片直接帶進 FB（要用手機）\n已下載戰績圖、複製文字：新增貼文加入圖片即可',
                web: () => ShareKit.facebookWeb()
            },
            {
                icon: 'icon-threads', fill: 0x111111, withText: true,
                pick: '在分享選單選 Threads\n文字沒帶到的話，已複製好貼上即可',
                desktop: '電腦不能把圖片直接帶進 Threads（要用手機）\n文字已帶入，加入已下載的戰績圖即可',
                web: text => ShareKit.threadsWeb(text)
            }
        ];
        const shareTo = t => () => {
            const file = this.shareImage;
            if (!file) {
                this.showToast(file === false ? '戰績圖產生失敗，請重新整理後再試一次' : '戰績圖還在產生中，請再按一次');
                return;
            }
            const text = ShareKit.text(this.shareInfo);
            ShareKit.copyText(t.copyUrlOnly ? SHARE_URL : text);
            if (ShareKit.canShareImage(file)) {
                this.showToast(t.pick);
                ShareKit.shareImage(file, t.withText ? text : null).then(result => {
                    // App 內建瀏覽器等不給叫分享選單：改成下載
                    if (result === 'failed') {
                        ShareKit.download(file);
                        this.showToast('這個瀏覽器不能直接分享，戰績圖已下載\n文字和連結已複製');
                    }
                });
                return;
            }
            const opened = t.web ? ShareKit.openWindow(t.web(text)) : true;
            ShareKit.download(file);
            this.showToast(opened ? t.desktop : '戰績圖已下載、文字已複製\n發文視窗被瀏覽器擋下了，請允許彈出視窗');
        };

        const buttons = targets.map(t => ({ icon: t.icon, fill: t.fill, action: shareTo(t) }));
        const gap = 12;
        const bw = (W - 84 - gap * (buttons.length - 1)) / buttons.length;
        buttons.forEach((b, i) => {
            const btn = createComicButton(this, 42 + bw / 2 + i * (bw + gap), labelY + 36, bw, 40, '', {
                fill: b.fill, shadow: 4, border: 2.5, shine: 0.12, depth: 25
            });
            btn.add(this.add.image(0, 0, b.icon).setScale(1.2 / SOCIAL_ICON.res));
            // 手機上要等手指放開（touchend）才算使用者操作，開分享視窗 / 分享選單才不會被擋
            btn.on('pointerup', b.action);
        });
    }

    // 底部提示訊息（面板下方），幾秒後淡出
    showToast(msg) {
        if (this.toast) this.toast.destroy();
        const text = this.add.text(0, 0, msg, {
            fontFamily: FONT_UI, fontSize: '12px', fontStyle: 'bold', color: '#fef3c7', align: 'center', lineSpacing: 3
        }).setOrigin(0.5);
        const bg = this.add.rectangle(0, 0, text.width + 28, text.height + 14, 0x0b0e14, 0.94).setStrokeStyle(2, 0xf59e0b, 0.9);
        this.toast = this.add.container(GAME_W / 2, 918, [bg, text]).setDepth(60).setAlpha(0);
        this.tweens.add({ targets: this.toast, alpha: 1, duration: 160 });
        this.tweens.add({ targets: this.toast, alpha: 0, delay: 4200, duration: 400 });
    }

    // 菸屁股卡片（top 為卡片上緣），回傳組成的所有物件，進場動畫用
    createButtCard(W, top, butt) {
        const x = 42;
        const w = W - 84;
        const h = 90;
        const color = hexColor(butt.badgeColor);
        const parts = drawComicPanel(this, x, top, w, h, {
            fill: 0x161b26, alpha: 0.95, shadow: 5, border: 2.5, accent: color, accentAlpha: 0.55, depth: 21
        });
        parts.push(this.add.rectangle(x, top + h / 2, 8, h, color, 1).setOrigin(0, 0.5).setDepth(22));

        const left = x + 18;
        const right = x + w - 18;
        const row1 = top + 18;
        const row2 = top + 46;
        const row3 = top + 74;

        const label = this.add.text(left, row1, '阿睿這次抽的是', {
            fontFamily: FONT_UI, fontSize: '12px', fontStyle: 'bold', color: '#a8a29e'
        }).setOrigin(0, 0.5).setDepth(22);
        parts.push(label, ...placeIconBeforeText(this, label, left, row1, 0));

        parts.push(
            this.add.text(right, row1, `${butt.difficultyLabel} ${butt.stars}`, {
                fontFamily: FONT_UI, fontSize: '12px', fontStyle: '900', color: butt.badgeColor
            }).setOrigin(1, 0.5).setDepth(22),
            this.add.text(left, row2, `【${butt.name}】`, {
                fontFamily: FONT_UI, fontSize: '22px', fontStyle: '900', color: butt.badgeColor, stroke: '#000', strokeThickness: 4
            }).setOrigin(0, 0.5).setDepth(22),
            this.add.image(right, row2, buttPictureKey(this, butt)).setOrigin(1, 0.5).setScale(1.3 / BUTT_PIC_RES).setDepth(22),
            this.add.text(left, row3, butt.subtitle, {
                fontFamily: FONT_UI, fontSize: '12px', color: '#d6d3d1'
            }).setOrigin(0, 0.5).setDepth(22),
            this.add.text(right, row3, `得分倍率 x${butt.scoreMultiplier.toFixed(1)} · 過癮區 ${butt.sweetMax - butt.sweetMin}%`, {
                fontFamily: FONT_UI, fontSize: '12px', fontStyle: 'bold', color: '#fbbf24'
            }).setOrigin(1, 0.5).setDepth(22)
        );
        return parts;
    }
}

// 結算卡片上的菸屁股圖（濾嘴 + 該菸蒂原本剩下的菸紙長度），用高解析度畫，顯示時再縮回來
const BUTT_PIC_RES = 3;
function buttPictureKey(scene, butt) {
    const key = `butt-pic-${butt.id}`;
    if (scene.textures.exists(key)) return key;
    const w = CIG_BAR.filterW + butt.stubLen + 10;
    const h = CIG_BAR.h + 4;
    const canvasTex = scene.textures.createCanvas(key, w * BUTT_PIC_RES, h * BUTT_PIC_RES);
    const ctx = canvasTex.getContext();
    ctx.scale(BUTT_PIC_RES, BUTT_PIC_RES);
    drawButtShape(ctx, CIG_BAR.filterW, butt.stubLen, CIG_BAR.h);
    canvasTex.refresh();
    return key;
}
