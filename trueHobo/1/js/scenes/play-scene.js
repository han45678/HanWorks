// ----------------------------------------------------------------------------
// SCENE E: MAIN GAMEPLAY SCENE (5.jpg & 6.jpg - 60秒壓住同位置抽煙屁股控溫戰)
// ----------------------------------------------------------------------------
class PlayScene extends Phaser.Scene {
    constructor() {
        super({ key: 'PlayScene' });
    }

    create() {
        setupView(this);
        const W = GAME_W;
        const H = GAME_H;
        const butt = GAME_STATE.selectedButt;
        this.cameras.main.fadeIn(300, 0, 0, 0);

        // Gameplay State Variables
        this.timeLeft = 60.0;
        this.score = 0;
        this.heat = 15;             // 0 ~ 100%
        this.idleTime = 0;          // Seconds since last inhale
        this.isInhaling = false;
        this.inhaleDuration = 0;    // 這一口吸了多久（放開時決定吐煙量）
        this.isBurnStunned = false; // Brief cooldown when burned at 100%
        this.burnCount = 0;
        this.depriveTicks = 0;
        this.combo = 0;
        this.maxCombo = 0;
        this.goldenTime = 0;
        this.isGameOver = false;
        this.holdRingColor = null;

        // 1. 原圖：img5 待機（菸頭熄暗）與 img6 吸菸（菸頭發紅）交叉淡入
        this.imgIdle = addArtImage(this, 'img5', 0);
        this.imgInhale = addArtImage(this, 'img6', 1).setAlpha(0);
        // 燙到時的反應圖（瞪眼、冒汗、口鼻噴煙）；沒有這張圖時只保留閃紅與對話框
        this.imgBurn = this.textures.exists('img7') ? addArtImage(this, 'img7', 1.5).setAlpha(0) : null;
        const fx = ART_FX.img5;
        addNeonGlow(this, fx.neon, 2);
        addLampGlow(this, fx.lamp, 2);

        this.emberX = fx.ember.x;
        this.emberY = fx.ember.y;
        this.mouthX = fx.mouth.x;
        this.mouthY = fx.mouth.y;

        // 菸頭火光（光暈 + 白熱核心）
        this.emberHalo = this.add.image(this.emberX, this.emberY, glowKey(this, 0xff4400)).setBlendMode(ADD).setAlpha(0).setDepth(5);
        this.emberCore = this.add.image(this.emberX, this.emberY, glowKey(this, 0xffc46b)).setBlendMode(ADD).setAlpha(0).setDepth(5);

        // 煙：平常細細一縷，吸的時候濃煙 + 火星，放開時從嘴角吐出一大口
        this.wispSmoke = this.add.particles(this.emberX + 4, this.emberY - 6, 'fx-smoke', {
            speedX: { min: -6, max: 14 },
            speedY: { min: -55, max: -35 },
            accelerationX: 6,
            scale: { start: 0.1, end: 0.55 },
            alpha: { start: 0.22, end: 0 },
            rotate: { min: 0, max: 360 },
            lifespan: 2800,
            frequency: 200,
            tint: 0xdfe7ee
        }).setDepth(6);
        this.inhaleSmoke = this.add.particles(this.emberX + 6, this.emberY - 8, 'fx-smoke', {
            speedX: { min: -10, max: 30 },
            speedY: { min: -110, max: -60 },
            accelerationX: 10,
            scale: { start: 0.2, end: 1.2 },
            alpha: { start: 0.5, end: 0 },
            rotate: { min: 0, max: 360 },
            lifespan: 2200,
            frequency: 70,
            emitting: false,
            tint: 0xe6edf3
        }).setDepth(6);
        this.sparks = this.add.particles(this.emberX, this.emberY, 'fx-spark', {
            speedX: { min: -40, max: 50 },
            speedY: { min: -120, max: -40 },
            gravityY: 60,
            scale: { start: 0.55, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: { min: 300, max: 650 },
            frequency: 90,
            emitting: false,
            blendMode: ADD
        }).setDepth(7);
        this.exhaleSmoke = this.add.particles(this.mouthX + 6, this.mouthY + 4, 'fx-smoke', {
            speedX: { min: 40, max: 150 },
            speedY: { min: -40, max: 25 },
            accelerationY: -12,
            scale: { start: 0.25, end: 1.7 },
            alpha: { start: 0.4, end: 0 },
            rotate: { min: 0, max: 360 },
            lifespan: { min: 1400, max: 2200 },
            emitting: false,
            tint: 0xe8eef3
        }).setDepth(6);

        addRain(this, { density: 0.8 });
        addFilmFinish(this, { vignette: 0.5 });

        // 燙傷閃紅、菸癮發作的紅色暗角
        this.damageFlash = this.add.rectangle(W / 2, H / 2, W, H, 0xff0000, 1).setAlpha(0).setDepth(30);
        this.redVignette = this.add.image(W / 2, H / 2, 'fx-vignette-red').setDisplaySize(W, H).setAlpha(0).setDepth(30);
        this.craveVignette = this.add.image(W / 2, H / 2, 'fx-vignette-red').setDisplaySize(W, H).setAlpha(0).setDepth(12);

        // 2. Interactive "PRESS & HOLD SAME SPOT" Target Zone (壓住同一個位置抽煙屁股)
        // Positioned over Ah-Rui's hand & cigarette butt area
        this.holdCenterX = W * 0.54;
        this.holdCenterY = H * 0.58;
        this.holdRadius = Math.min(W, H) * 0.19; // Generous enough for thumb/mouse, strict enough that dragging away releases

        this.holdZone = this.add.container(this.holdCenterX, this.holdCenterY).setDepth(15);
        this.holdRing = this.add.graphics();
        this.holdCore = this.add.image(0, 0, glowKey(this, 0xff7a1a)).setBlendMode(ADD).setScale(0.55).setAlpha(0.55);
        const holdDot = this.add.circle(0, 0, 9, 0xfff3c4, 0.95).setStrokeStyle(3, 0x000000, 0.9);
        this.holdZone.add([this.add.circle(0, 0, this.holdRadius, 0xffffff, 0.05), this.holdRing, this.holdCore, holdDot]);
        this.drawHoldRing(0xfbbf24);
        this.tweens.add({ targets: this.holdRing, angle: 360, duration: 9000, repeat: -1 });
        this.tweens.add({ targets: this.holdCore, scale: 0.8, alpha: 0.3, duration: 650, yoyo: true, repeat: -1 });

        this.holdLabel = this.add.text(this.holdCenterX, this.holdCenterY + this.holdRadius + 26, '👆 壓住此處不放 = 抽煙屁股\n(太燙前要適時放開！)', {
            fontFamily: FONT_UI,
            fontSize: '14px',
            fontStyle: '900',
            color: '#fef08a',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(16);

        // Unified Pointer Input (Supports Mobile Touch & Desktop Mouse)
        this.input.on('pointerdown', (pointer) => {
            this.checkPointerHold(pointer, true);
        });
        this.input.on('pointermove', (pointer) => {
            if (pointer.isDown) {
                this.checkPointerHold(pointer, false);
            }
        });
        this.input.on('pointerup', () => {
            this.stopInhaling();
        });
        this.input.on('pointerupoutside', () => {
            this.stopInhaling();
        });

        // 3. TOP HUD (Timer, Score, Selected Cigarette Butt Info, Visual Cigarette Length Bar)
        this.createHUD(W, H, butt);

        // 4. RIGHT VERTICAL HEAT GAUGE (燙度計 + 黃金過癮區) & BOTTOM CRAVING METER (菸癮空虛計)
        this.createGauges(W, H, butt);

        // 黃金過癮區加分倍數：每 0.3 秒重抽 x1.2 ~ x2.0
        this.rerollZoneBonus();
        this.time.addEvent({ delay: ZONE_BONUS.rerollMs, loop: true, callback: () => this.rerollZoneBonus() });

        // 5. 燙到時的漫畫爆炸對話框（台語罵聲）：放在右上方巷子上空，不擋住瞪大的眼睛
        const burstX = 384;
        const burstY = 264;
        this.burst = this.add.container(burstX, burstY).setDepth(40).setAlpha(0);
        const burstGfx = this.add.graphics();
        drawShoutBurst(burstGfx, 280, 190, {
            baseX: -60,
            baseY: 75,
            x: 262 - burstX,
            y: 420 - burstY
        });
        this.sbText = this.add.text(0, -16, '', {
            fontFamily: FONT_UI,
            fontSize: '19px',
            fontStyle: '900',
            color: '#c81e1e',
            align: 'center',
            lineSpacing: 2
        }).setOrigin(0.5);
        this.sbSub = this.add.text(0, 36, '', {
            fontFamily: FONT_UI,
            fontSize: '14px',
            fontStyle: '900',
            color: INK
        }).setOrigin(0.5);
        this.burst.add([burstGfx, this.sbText, this.sbSub]);
    }

    // 重抽黃金過癮區倍數，燙度計旁的數字跟著跳一下；倍數越高顏色越偏橘
    rerollZoneBonus() {
        if (this.isGameOver) return;
        const m = rollZoneBonus();
        this.zoneBonus = m;
        this.zoneBonusTxt
            .setText(`x${m.toFixed(1)}`)
            .setColor(m >= 1.8 ? '#fb923c' : (m >= 1.5 ? '#facc15' : '#fef3c7'));
        this.tweens.killTweensOf(this.zoneBonusTxt);
        this.zoneBonusTxt.setScale(1.25);
        this.tweens.add({ targets: this.zoneBonusTxt, scale: 1, duration: 140, ease: 'Quad.easeOut' });
    }

    drawHoldRing(color) {
        const g = this.holdRing;
        const r = this.holdRadius;
        const seg = 16;
        g.clear();
        // 黑邊 + 彩色虛線圈，像漫畫分鏡的對焦框
        for (let i = 0; i < seg; i++) {
            const a0 = (i / seg) * Math.PI * 2;
            const a1 = a0 + (Math.PI * 2 / seg) * 0.6;
            g.lineStyle(8, 0x000000, 0.7);
            g.beginPath();
            g.arc(0, 0, r, a0, a1);
            g.strokePath();
            g.lineStyle(4, color, 0.95);
            g.beginPath();
            g.arc(0, 0, r, a0, a1);
            g.strokePath();
        }
        this.holdRingColor = color;
    }

    createHUD(W, H, butt) {
        const top = 44;
        drawComicPanel(this, 10, top, W - 20, 116, { fill: 0x0b0e14, alpha: 0.88, accent: 0xf59e0b, accentAlpha: 0.45, shadow: 5, depth: 20 });

        // Countdown Timer (Left)
        this.add.text(26, top + 12, '⏱ 剩餘時間', {
            fontFamily: FONT_UI, fontSize: '12px', fontStyle: 'bold', color: '#9ca3af'
        }).setDepth(21);
        this.timerTxt = this.add.text(24, top + 26, '60.0s', {
            fontFamily: FONT_NUM, fontSize: '38px', fontStyle: '900', color: '#fbbf24', stroke: '#000000', strokeThickness: 5
        }).setDepth(21);

        // Score & Combo (Right)
        this.add.text(W - 26, top + 12, `🏆 總分 (${butt.name} x${butt.scoreMultiplier})`, {
            fontFamily: FONT_UI, fontSize: '12px', fontStyle: 'bold', color: '#9ca3af'
        }).setOrigin(1, 0).setDepth(21);
        this.scoreTxt = this.add.text(W - 24, top + 23, '0', {
            fontFamily: FONT_NUM, fontSize: '42px', fontStyle: '900', color: '#4ade80', stroke: '#000000', strokeThickness: 5
        }).setOrigin(1, 0).setDepth(21);

        this.comboTxt = this.add.text(W - 26, top + 78, '', {
            fontFamily: FONT_UI, fontSize: '13px', fontStyle: '900', color: '#f59e0b', stroke: '#000000', strokeThickness: 3
        }).setOrigin(1, 0).setDepth(21);

        // 菸蒂長度：濾嘴後面只剩一小截菸紙（長短依菸蒂種類），隨 60 秒燒到濾嘴
        this.add.text(26, top + 82, '菸蒂長度', {
            fontFamily: FONT_UI, fontSize: '12px', fontStyle: 'bold', color: '#d6d3d1'
        }).setDepth(21);
        const barY = top + 91;
        const maxStub = Math.max(...CIGARETTE_BUTTS.map(b => b.stubLen));
        if (!this.textures.exists('hud-butt')) {
            this.textures.createCanvas('hud-butt', (CIG_BAR.filterW + maxStub + 10) * RENDER_SCALE, (CIG_BAR.h + 4) * RENDER_SCALE);
        }
        this.cigBarTex = this.textures.get('hud-butt');
        this.cigBarX = 88;  // 貼圖左邊留 2px 描邊，濾嘴從 x=90 開始
        this.cigBarStub = butt.stubLen;
        this.cigBarPaperW = -1;
        this.add.image(this.cigBarX, barY, 'hud-butt').setOrigin(0, 0.5).setScale(1 / RENDER_SCALE).setDepth(21);
        this.drawCigBar(butt.stubLen);
        this.cigBarGlow = this.add.image(this.cigBarTipX, barY, glowKey(this, 0xff5a00)).setBlendMode(ADD).setScale(0.28).setDepth(22);
        // 火頭：貼著菸紙末端、跟菸紙一樣高的橢圓（像燒紅的切面，不要像一顆紅點）
        this.cigBarEmber = this.add.ellipse(this.cigBarTipX, barY, 6, CIG_BAR.h - 2, 0xff4d00).setStrokeStyle(1.2, 0x7a1d00).setDepth(22);
        this.tweens.add({ targets: this.cigBarGlow, alpha: 0.4, duration: 500, yoyo: true, repeat: -1 });
    }

    // 菸紙長度變動（取整數 px）才重畫，火頭跟著停在菸紙末端
    drawCigBar(paperW) {
        const w = Math.round(paperW);
        if (w === this.cigBarPaperW) return;
        this.cigBarPaperW = w;
        const ctx = this.cigBarTex.getContext();
        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        ctx.setTransform(RENDER_SCALE, 0, 0, RENDER_SCALE, 0, 0);
        const paperEnd = drawButtShape(ctx, CIG_BAR.filterW, w, CIG_BAR.h);
        this.cigBarTex.refresh();
        this.cigBarTipX = this.cigBarX + paperEnd + 1.5;
    }

    createGauges(W, H, butt) {
        // RIGHT GAUGE: Heat Meter (燙度計 0~100%)
        const gx = W - 36;
        const gy = H * 0.54;
        const gh = 300;
        const gw = 22;
        const top = gy - gh / 2;
        const bottom = gy + gh / 2;

        this.gaugeX = gx;
        this.gaugeY = gy;
        this.gaugeH = gh;

        this.gaugeDanger = this.add.image(gx, gy, glowKey(this, 0xff2200)).setBlendMode(ADD).setDisplaySize(gw * 5, gh * 1.3).setAlpha(0).setDepth(19);

        const frame = this.add.graphics().setDepth(20);
        frame.fillStyle(0x000000, 0.85);
        frame.fillRoundedRect(gx - gw / 2 - 6 + 4, top - 6 + 4, gw + 12, gh + 12, 10);
        frame.fillStyle(0x0b0e14, 0.94);
        frame.fillRoundedRect(gx - gw / 2 - 6, top - 6, gw + 12, gh + 12, 10);
        frame.lineStyle(3, 0x000000, 1);
        frame.strokeRoundedRect(gx - gw / 2 - 6, top - 6, gw + 12, gh + 12, 10);

        // Dynamic Heat Fill Bar（漸層依黃金區間繪製，用 crop 顯示目前高度）
        this.heatFill = this.add.image(gx, bottom, ensureHeatTexture(this, butt))
            .setOrigin(0.5, 1)
            .setDisplaySize(gw, gh)
            .setDepth(21);

        const overlay = this.add.graphics().setDepth(22);
        overlay.lineStyle(1, 0xffffff, 0.16);
        for (let i = 1; i < 10; i++) {
            const ty = bottom - (gh * i) / 10;
            overlay.lineBetween(gx - gw / 2, ty, gx + gw / 2, ty);
        }

        // Golden Sweet Spot Zone highlight on Heat Gauge
        const sweetTopY = bottom - (butt.sweetMax / 100) * gh;
        const sweetBotY = bottom - (butt.sweetMin / 100) * gh;
        overlay.fillStyle(0xfde047, 0.12);
        overlay.fillRect(gx - gw / 2, sweetTopY, gw, sweetBotY - sweetTopY);
        overlay.lineStyle(2, 0xfde047, 0.95);
        overlay.lineBetween(gx - gw / 2, sweetTopY, gx + gw / 2, sweetTopY);
        overlay.lineBetween(gx - gw / 2, sweetBotY, gx + gw / 2, sweetBotY);
        const bx = gx - gw / 2 - 11;
        overlay.lineStyle(5, 0x000000, 0.8);
        overlay.strokePoints([{ x: bx + 5, y: sweetTopY }, { x: bx, y: sweetTopY }, { x: bx, y: sweetBotY }, { x: bx + 5, y: sweetBotY }]);
        overlay.lineStyle(2.5, 0xfde047, 1);
        overlay.strokePoints([{ x: bx + 5, y: sweetTopY }, { x: bx, y: sweetTopY }, { x: bx, y: sweetBotY }, { x: bx + 5, y: sweetBotY }]);

        // 區域標籤 + 目前加分倍數（每 0.3 秒重抽，見 rerollZoneBonus）
        const sweetMidY = (sweetTopY + sweetBotY) / 2;
        this.add.text(bx - 6, sweetMidY + 3, '黃金\n過癮區', {
            fontFamily: FONT_UI,
            fontSize: '10px',
            fontStyle: '900',
            color: '#fde047',
            align: 'right',
            stroke: '#000',
            strokeThickness: 3
        }).setOrigin(1, 1).setDepth(22);
        this.zoneBonusTxt = this.add.text(bx - 6, sweetMidY + 3, '', {
            fontFamily: FONT_NUM,
            fontSize: '16px',
            fontStyle: '900',
            color: '#fde047',
            stroke: '#000',
            strokeThickness: 4
        }).setOrigin(1, 0).setDepth(22);

        // 目前溫度刻度線
        this.heatMarker = this.add.rectangle(gx, bottom, gw + 10, 4, 0xffffff, 1).setStrokeStyle(1.5, 0x000000).setDepth(23);

        this.add.text(gx, top - 24, '🔥 燙度', {
            fontFamily: FONT_UI, fontSize: '12px', fontStyle: '900', color: '#f87171', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(22);

        this.heatPctTxt = this.add.text(gx, bottom + 22, '15%', {
            fontFamily: FONT_NUM, fontSize: '18px', fontStyle: '900', color: '#ffffff', stroke: '#000', strokeThickness: 4
        }).setOrigin(0.5).setDepth(22);

        // Bottom Status Bar: Nicotine Deprivation (太久沒吸到煙焦慮計)
        drawComicPanel(this, 18, H - 58, W - 36, 40, { fill: 0x0b0e14, alpha: 0.9, shadow: 4, depth: 20 });

        this.cravingBar = this.add.rectangle(22, H - 38, 0, 32, 0xef4444, 0.6)
            .setOrigin(0, 0.5)
            .setDepth(21);

        this.statusTxt = this.add.text(W / 2, H - 38, '💡 壓住畫面中央的菸蒂不放開始抽菸！', {
            fontFamily: FONT_UI,
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#e7e5e4'
        }).setOrigin(0.5).setDepth(22);
    }

    checkPointerHold(pointer, isInitialDown) {
        if (this.isGameOver || this.isBurnStunned) return;

        // 攝影機有放大，要換算回 540x960 的世界座標
        const p = this.cameras.main.getWorldPoint(pointer.x, pointer.y);
        const dist = Phaser.Math.Distance.Between(p.x, p.y, this.holdCenterX, this.holdCenterY);
        if (dist <= this.holdRadius * 1.15) {
            if (!this.isInhaling) {
                this.isInhaling = true;
                if (isInitialDown) {
                    audioEngine.init();
                }
            }
        } else {
            // Dragged finger/cursor outside the same position -> stop inhaling
            this.stopInhaling();
        }
    }

    stopInhaling() {
        if (this.isInhaling && this.inhaleDuration > 0.35 && !this.isGameOver) {
            // 放開時從嘴角吐出一口煙，吸越久煙越多
            this.exhaleSmoke.explode(Math.min(24, Math.round(8 + this.inhaleDuration * 6)));
        }
        this.isInhaling = false;
        this.inhaleDuration = 0;
        audioEngine.setInhaleSound(false);
    }

    triggerBurnPenalty() {
        const butt = GAME_STATE.selectedButt;
        this.isInhaling = false;
        this.inhaleDuration = 0;
        this.isBurnStunned = true;
        this.burnCount++;
        this.combo = 0;
        this.score = Math.max(0, this.score - butt.burnPenalty);
        audioEngine.setInhaleSound(false);

        // Play authentic Taiwanese Hokkien burn voice ("啊娘喂！燒啦！")
        const spokenLine = audioEngine.playTaiwaneseBurnVoice();

        // Screen shake、紅色閃光、火星四濺、嗆出一口煙
        this.cameras.main.shake(380, 0.024);
        this.damageFlash.setAlpha(0.3);
        this.redVignette.setAlpha(1);
        this.tweens.add({ targets: this.damageFlash, alpha: 0, duration: 380 });
        this.tweens.add({ targets: this.redVignette, alpha: 0, duration: 900, ease: 'Quad.easeIn' });
        this.sparks.explode(26);
        this.exhaleSmoke.explode(10);

        // 硬切到燙傷反應圖，帶一點放大的衝擊感
        if (this.imgBurn) {
            const s = this.imgBurn.baseScale;
            this.tweens.killTweensOf(this.imgBurn);
            this.imgBurn.setAlpha(1).setScale(s * 1.06);
            this.tweens.add({ targets: this.imgBurn, scale: s, duration: 260, ease: 'Back.easeOut' });
            // 冷卻 1.25 秒結束前淡回原圖
            this.time.delayedCall(980, () => {
                this.tweens.add({ targets: this.imgBurn, alpha: 0, duration: 240 });
            });
        }

        // 爆炸對話框
        this.sbText.setText(`🔥 ${splitShout(spokenLine)}`);
        this.sbSub.setText(`（燙到手跟嘴唇 -${butt.burnPenalty} 分）`);
        this.tweens.killTweensOf(this.burst);
        this.burst.setAlpha(1).setScale(0.5).setAngle(-8);
        this.tweens.add({
            targets: this.burst,
            scale: 1,
            angle: 0,
            duration: 220,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.tweens.add({
                    targets: this.burst,
                    alpha: 0,
                    delay: 1150,
                    duration: 300
                });
            }
        });

        this.spawnFloatingText(this.holdCenterX, this.holdCenterY - 50, `💥 燒燙燙！-${butt.burnPenalty}`, '#ef4444');

        // Force 1.25s cooldown where Ah-Rui shakes his burned hand
        this.time.delayedCall(1250, () => {
            this.isBurnStunned = false;
            this.heat = Math.min(this.heat, 55);
        });
    }

    spawnFloatingText(x, y, msg, color = '#fde047') {
        const txt = this.add.text(x, y, msg, {
            fontFamily: FONT_UI,
            fontSize: '19px',
            fontStyle: '900',
            color: color,
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setDepth(35).setScale(0.7);

        this.tweens.add({ targets: txt, scale: 1, duration: 120, ease: 'Back.easeOut' });
        this.tweens.add({
            targets: txt,
            y: y - 55,
            alpha: 0,
            duration: 750,
            onComplete: () => txt.destroy()
        });
    }

    update(time, delta) {
        if (this.isGameOver) return;
        const dt = delta / 1000;
        const butt = GAME_STATE.selectedButt;
        const W = GAME_W;

        // 1. Update 60-Second Countdown
        this.timeLeft = Math.max(0, this.timeLeft - dt);
        this.timerTxt.setText(`${this.timeLeft.toFixed(1)}s`);
        if (this.timeLeft <= 10) {
            this.timerTxt.setColor('#ef4444');
        }

        // 剩下的菸紙隨 60 秒燒向濾嘴（最後剩 3px）
        this.drawCigBar(3 + (this.cigBarStub - 3) * (this.timeLeft / 60));
        this.cigBarEmber.x = this.cigBarTipX;
        this.cigBarGlow.x = this.cigBarTipX;

        if (this.timeLeft <= 0) {
            this.finishGame();
            return;
        }

        // 2. Handle Inhaling vs Releasing Physics
        const inhalingNow = this.isInhaling && !this.isBurnStunned;
        let deprived = false;
        if (inhalingNow) {
            this.idleTime = 0;
            this.inhaleDuration += dt;

            // Increase heat (higher quality butts heat up faster + slight ember turbulence)
            const jitter = 1 + Math.sin(time * 0.015) * 0.15;
            this.heat = Math.min(100, this.heat + butt.heatRate * jitter * dt);

            // Switch visual to 6.jpg (glowing ember)
            this.imgInhale.setAlpha(Phaser.Math.Linear(this.imgInhale.alpha, 1, 0.22));
            const heatRatio = this.heat / 100;
            const flick = 0.85 + Math.random() * 0.15;
            this.emberCore.setAlpha((0.55 + heatRatio * 0.45) * flick).setScale(0.2 + heatRatio * 0.12);
            this.emberHalo.setAlpha((0.35 + heatRatio * 0.4) * flick).setScale(0.6 + heatRatio * 0.7);
            setEmitting(this.inhaleSmoke, true);
            setEmitting(this.sparks, true);

            audioEngine.setInhaleSound(true, heatRatio);

            // Continuous Carrying / Inhaling Score Gain (一直有攜帶/吸食就會加分)
            const inSweetSpot = (this.heat >= butt.sweetMin && this.heat <= butt.sweetMax);
            const zoneBonus = inSweetSpot ? this.zoneBonus : 1.0;
            if (inSweetSpot) {
                this.goldenTime += dt;
            }

            this.combo += dt * 4;
            if (Math.floor(this.combo) > this.maxCombo) {
                this.maxCombo = Math.floor(this.combo);
            }
            const comboMult = 1 + Math.min(2.0, Math.floor(this.combo) * 0.05);
            const pointsEarned = 42 * butt.scoreMultiplier * zoneBonus * comboMult * dt;
            this.score += pointsEarned;

            // Occasional floating feedback in Golden Sweet Spot
            if (inSweetSpot && Math.random() < 0.08) {
                this.spawnFloatingText(
                    this.emberX + Phaser.Math.Between(-30, 30),
                    this.emberY - 30,
                    `過癮！+${Math.round(pointsEarned * 8)}`,
                    '#fbbf24'
                );
            }

            this.statusTxt.setText(
                inSweetSpot
                    ? `🔥 黃金過癮區！分數 x${this.zoneBonus.toFixed(1)} 狂飆中！(注意別破百燙傷)`
                    : '💨 正在猛吸菸屁股… 持續加分中！'
            );
            this.statusTxt.setColor(inSweetSpot ? '#fde047' : '#86efac');

            // Check if Heat hit 100% -> BURN!
            if (this.heat >= 100) {
                this.triggerBurnPenalty();
            }
        } else {
            // Not Inhaling -> Cool down ember & switch back to 5.jpg
            this.heat = Math.max(0, this.heat - butt.coolRate * dt);
            this.imgInhale.setAlpha(Phaser.Math.Linear(this.imgInhale.alpha, 0, 0.18));
            // 沒在吸：菸頭只剩微弱餘燼
            this.emberCore.setAlpha(0);
            this.emberHalo.setAlpha(0.1 + Math.sin(time * 0.004) * 0.04).setScale(0.45);
            setEmitting(this.inhaleSmoke, false);
            setEmitting(this.sparks, false);

            if (!this.isBurnStunned) {
                this.idleTime += dt;
                // Nicotine Deprivation Penalty (太久沒吸到煙也會扣分: threshold 2.0 seconds)
                const maxSafeIdle = 2.0;
                const craveRatio = Math.min(1, this.idleTime / maxSafeIdle);
                this.cravingBar.width = craveRatio * (W - 44);

                if (this.idleTime >= maxSafeIdle) {
                    deprived = true;
                    this.combo = 0;
                    const penaltyRate = 35 * butt.scoreMultiplier;
                    this.score = Math.max(0, this.score - penaltyRate * dt);
                    this.statusTxt.setText('⚠️ 太久沒吸到煙！菸癮發作空虛扣分中！快壓住抽菸！');
                    this.statusTxt.setColor('#fca5a5');

                    this.depriveTicks += dt;
                    if (this.depriveTicks >= 0.9) {
                        this.depriveTicks = 0;
                        audioEngine.playCoughWarning();
                        this.spawnFloatingText(this.holdCenterX, this.holdCenterY, '💨 太久沒吸扣分！', '#f87171');
                    }
                } else {
                    this.statusTxt.setText('👆 壓住中央圈圈不放抽煙屁股 (超過 2 秒沒吸會扣分)');
                    this.statusTxt.setColor('#e7e5e4');
                }
            } else {
                this.statusTxt.setText('🥵 燙傷甩手冷卻中… 啊娘喂好燙！');
                this.statusTxt.setColor('#f87171');
            }
        }

        if (this.isInhaling) {
            this.cravingBar.width = 0;
        }
        this.craveVignette.setAlpha(deprived
            ? 0.24 + Math.sin(time * 0.008) * 0.1
            : Phaser.Math.Linear(this.craveVignette.alpha, 0, 0.1));

        // 壓按圈顏色跟著溫度區間變化（綠：還沒到 → 黃：過癮區內 → 橘：超過過癮區 → 紅：快燙傷）
        let ringColor = 0xfbbf24;
        if (this.isBurnStunned) {
            ringColor = 0xef4444;
        } else if (inhalingNow) {
            if (this.heat >= 88) ringColor = 0xef4444;
            else if (this.heat > butt.sweetMax) ringColor = 0xf97316;
            else if (this.heat >= butt.sweetMin) ringColor = 0xfde047;
            else ringColor = 0x4ade80;
        }
        if (ringColor !== this.holdRingColor) this.drawHoldRing(ringColor);
        this.holdZone.setScale(Phaser.Math.Linear(this.holdZone.scaleX, inhalingNow ? 0.93 : 1, 0.2));
        this.holdLabel.setAlpha(Phaser.Math.Linear(this.holdLabel.alpha, inhalingNow ? 0.35 : 1, 0.15));

        // 3. Update Right Heat Gauge Visuals
        const fillH = Math.max(2, (this.heat / 100) * this.gaugeH);
        const texW = this.heatFill.frame.width;
        const texH = this.heatFill.frame.height;
        const cropH = (texH * fillH) / this.gaugeH;
        this.heatFill.setCrop(0, texH - cropH, texW, cropH);
        this.heatMarker.y = this.gaugeY + this.gaugeH / 2 - fillH;
        this.heatPctTxt.setText(`${Math.round(this.heat)}%`);
        this.heatPctTxt.setColor(this.heat >= 88 ? '#f87171' : '#ffffff');
        this.gaugeDanger.setAlpha(this.heat >= 88 ? 0.4 + Math.sin(time * 0.025) * 0.25 : 0);

        // 4. Update Score & Combo Text
        this.scoreTxt.setText(`${Math.floor(this.score)}`);
        this.comboTxt.setText(this.combo >= 2 ? `🔥 連吸 Combo x${Math.floor(this.combo)}` : '');
    }

    finishGame() {
        this.isGameOver = true;
        audioEngine.setInhaleSound(false);

        GAME_STATE.lastResult = {
            score: Math.floor(this.score),
            butt: GAME_STATE.selectedButt,
            burnCount: this.burnCount,
            maxCombo: this.maxCombo,
            goldenTime: this.goldenTime.toFixed(1)
        };

        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.time.delayedCall(520, () => {
            this.scene.start('ResultScene');
        });
    }
}
