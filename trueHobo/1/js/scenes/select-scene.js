// ----------------------------------------------------------------------------
// SCENE D: CIGARETTE BUTT SELECTION (3.jpg -> 4.jpg)
// 阿睿在鐵盤煙灰缸裡選了一個煙屁股 (越好的煙屁股 難度越高)
// ----------------------------------------------------------------------------
class SelectButtScene extends Phaser.Scene {
    constructor() {
        super({ key: 'SelectButtScene' });
    }

    create() {
        setupView(this);
        const W = GAME_W;
        const H = GAME_H;
        this.pickingUp = false;
        this.cameras.main.fadeIn(350, 0, 0, 0);

        // Background: 3.jpg Top-down Iron Tray Ashtray
        this.trayImg = addArtImage(this, 'img3');
        this.add.rectangle(W / 2, H / 2, W, H, 0x05070a, 0.18).setDepth(1);
        addRain(this, { density: 0.5 });
        addFilmFinish(this, { vignette: 0.45 });

        // Top Header（漫畫旁白框）
        drawComicPanel(this, 14, 48, W - 28, 76, { fill: PAPER, alpha: 0.97, shadow: 6, halftone: true, depth: 20 });
        const headTxt = this.add.text(W / 2, 74, '請在鐵盤上挑選一根「煙屁股」', {
            fontFamily: FONT_UI,
            fontSize: '20px',
            fontStyle: '900',
            color: '#b91c1c'
        }).setOrigin(0.5).setDepth(21);
        placeIconBeforeText(this, headTxt, W / 2, 74, 0.5, 1.2);
        this.add.text(W / 2, 102, '越高級的煙屁股得分倍率越高，但火頭極短、升溫超快！', {
            fontFamily: FONT_UI,
            fontSize: '12px',
            fontStyle: 'bold',
            color: '#44403c'
        }).setOrigin(0.5).setDepth(21);

        // 鐵盤上的菸蒂熱點：光暈圈住實際的菸蒂，編號牌拉線標在上方
        this.hotspots = CIGARETTE_BUTTS.map((butt, idx) => {
            const { x, y } = butt.trayPos;
            const color = hexColor(butt.badgeColor);
            const glow = this.add.image(x, y, glowKey(this, color)).setBlendMode(ADD).setScale(0.75).setAlpha(0.6).setDepth(10);
            const ring = this.add.circle(x, y, 22).setStrokeStyle(3, 0xffffff, 0.95).setDepth(11);
            const tagY = y - 46;
            const leader = this.add.graphics().setDepth(11);
            leader.lineStyle(4, 0x000000, 0.9);
            leader.lineBetween(x, y - 22, x, tagY + 13);
            leader.lineStyle(2, 0xffffff, 1);
            leader.lineBetween(x, y - 22, x, tagY + 13);
            const tag = this.add.circle(x, tagY, 14, color, 1).setStrokeStyle(3, 0x000000).setDepth(12);
            const num = this.add.text(x, tagY, `${idx + 1}`, {
                fontFamily: FONT_NUM,
                fontSize: '19px',
                fontStyle: '900',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            }).setOrigin(0.5).setDepth(13);

            const hit = this.add.circle(x, y, 32, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(14);
            hit.on('pointerover', () => this.highlight(idx, true));
            hit.on('pointerout', () => this.highlight(idx, false));
            hit.on('pointerdown', () => this.selectAndPickupButt(butt));

            this.tweens.add({ targets: ring, scale: 1.3, alpha: 0.45, duration: 700, yoyo: true, repeat: -1 });
            this.tweens.add({ targets: glow, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
            return { glow, tag, num, cardHi: null };
        });

        // Selection Cards Panel（縮矮一些，讓鐵盤露出更多）
        const cardH = 74;
        const gap = 8;
        const startY = H - 14 - (cardH * 4 + gap * 3) + cardH / 2;

        CIGARETTE_BUTTS.forEach((butt, idx) => {
            const cy = startY + idx * (cardH + gap);
            const color = hexColor(butt.badgeColor);
            drawComicPanel(this, 14, cy - cardH / 2, W - 28, cardH, { fill: 0x0e1218, alpha: 0.93, shadow: 5, depth: 20 });
            this.add.rectangle(14, cy, 9, cardH, color, 1).setOrigin(0, 0.5).setDepth(21);
            const cardHi = this.add.rectangle(W / 2, cy, W - 28, cardH, 0xffffff, 1).setAlpha(0).setDepth(21);
            this.hotspots[idx].cardHi = cardHi;

            this.add.text(34, cy - 25, `${idx + 1}. ${butt.name}`, {
                fontFamily: FONT_UI,
                fontSize: '17px',
                fontStyle: '900',
                color: '#ffffff'
            }).setDepth(22);

            // Difficulty & Stars
            this.add.text(W - 28, cy - 23, `${butt.difficultyLabel} ${butt.stars} | 倍率 x${butt.scoreMultiplier.toFixed(1)}`, {
                fontFamily: FONT_UI,
                fontSize: '13px',
                fontStyle: 'bold',
                color: butt.badgeColor
            }).setOrigin(1, 0).setDepth(22);

            // Description
            this.add.text(34, cy + 7, butt.desc, {
                fontFamily: FONT_UI,
                fontSize: '12px',
                color: '#a8a29e'
            }).setDepth(22);

            const hit = this.add.rectangle(W / 2, cy, W - 28, cardH, 0x000000, 0).setInteractive({ useHandCursor: true }).setDepth(23);
            hit.on('pointerover', () => this.highlight(idx, true));
            hit.on('pointerout', () => this.highlight(idx, false));
            hit.on('pointerdown', () => this.selectAndPickupButt(butt));
        });
    }

    // 卡片與鐵盤熱點互相連動高亮
    highlight(idx, on) {
        const h = this.hotspots[idx];
        h.cardHi.setAlpha(on ? 0.08 : 0);
        h.tag.setScale(on ? 1.25 : 1);
        h.num.setScale(on ? 1.25 : 1);
        h.glow.setScale(on ? 1.05 : 0.75);
    }

    selectAndPickupButt(butt) {
        if (this.pickingUp) return;
        this.pickingUp = true;
        GAME_STATE.selectedButt = butt;
        audioEngine.playLighterFlick();

        const W = GAME_W;
        const H = GAME_H;

        // Transition to 4.jpg：阿睿的髒手從鐵盤捏起菸蒂，鏡頭推近手指
        this.cameras.main.flash(160, 255, 236, 200);
        const handOverlay = addArtImage(this, 'img4', 50).setAlpha(0);
        kenBurns(this, handOverlay, ART_FX.img4.pinch, 1.1, 1700);

        const captionTop = H - 176;
        const caption = [
            ...drawComicPanel(this, 22, captionTop, W - 44, 120, { fill: PAPER, alpha: 0.97, shadow: 7, halftone: true, depth: 60 }),
            this.add.text(W / 2, captionTop + 60, `✋ 阿睿撿起了【${butt.name}】\n點火準備開抽！(限時 60 秒)`, {
                fontFamily: FONT_UI,
                fontSize: '21px',
                fontStyle: '900',
                color: INK,
                align: 'center',
                lineSpacing: 10
            }).setOrigin(0.5).setDepth(61)
        ];
        caption.forEach(o => o.setAlpha(0));

        this.tweens.add({ targets: handOverlay, alpha: 1, duration: 320 });
        this.tweens.add({
            targets: caption,
            alpha: 1,
            delay: 200,
            duration: 260,
            onComplete: () => {
                this.time.delayedCall(1050, () => {
                    this.cameras.main.fadeOut(260, 0, 0, 0);
                    this.time.delayedCall(270, () => this.scene.start('PlayScene'));
                });
            }
        });
    }
}
