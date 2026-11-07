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
            hit.on('pointerover', () => {
                this.setHover(idx);
                this.scrollCardIntoView(idx);
            });
            hit.on('pointerout', () => this.setHover(-1));
            hit.on('pointerdown', () => this.selectAndPickupButt(butt));

            this.tweens.add({ targets: ring, scale: 1.3, alpha: 0.45, duration: 700, yoyo: true, repeat: -1 });
            this.tweens.add({ targets: glow, alpha: 0.3, duration: 700, yoyo: true, repeat: -1 });
            return { glow, tag, num, cardHi: null };
        });

        this.createCardList();
    }

    // 選菸卡片清單：一次只露出 4 張半（最後半張切在螢幕底，提示還能往下滑），
    // 超過的用滑鼠滾輪或手指上下拖曳捲動；菸蒂不到 5 根時整排貼底、不捲動
    createCardList() {
        const W = GAME_W;
        const H = GAME_H;
        const cardH = 66;
        const gap = 6;
        const slot = cardH + gap;
        const visibleCards = 4.5;
        const count = CIGARETTE_BUTTS.length;
        const contentH = count * cardH + (count - 1) * gap;
        const scrollable = count > visibleCards;
        const viewTop = scrollable
            ? H - (Math.floor(visibleCards) * slot + cardH * (visibleCards % 1))
            : H - 14 - contentH;

        this.scroller = {
            top: viewTop,
            cardH,
            slot,
            count,
            scroll: 0,
            // 捲到底時最後一張下緣離螢幕底 14px（跟不捲動時一樣）
            maxScroll: scrollable ? contentH - (H - 14 - viewTop) : 0,
            vel: 0,
            drag: null,
            tween: null
        };
        this.hoverIdx = -1;

        this.cardList = this.add.container(0, viewTop).setDepth(20);
        CIGARETTE_BUTTS.forEach((butt, idx) => {
            const cy = idx * slot + cardH / 2;
            const color = hexColor(butt.badgeColor);
            const cardHi = this.add.rectangle(W / 2, cy, W - 28, cardH, 0xffffff, 1).setAlpha(0);
            this.hotspots[idx].cardHi = cardHi;
            this.cardList.add([
                ...drawComicPanel(this, 14, cy - cardH / 2, W - 28, cardH, { fill: 0x0e1218, alpha: 0.93, shadow: 5 }),
                this.add.rectangle(14, cy, 9, cardH, color, 1).setOrigin(0, 0.5),
                cardHi,
                this.add.text(34, cy - 24, butt.name, {
                    fontFamily: FONT_UI,
                    fontSize: '17px',
                    fontStyle: '900',
                    color: '#ffffff'
                }),
                // Difficulty & Stars
                this.add.text(W - 28, cy - 22, `${butt.difficultyLabel} ${butt.stars} | 倍率 x${butt.scoreMultiplier.toFixed(1)}`, {
                    fontFamily: FONT_UI,
                    fontSize: '13px',
                    fontStyle: 'bold',
                    color: butt.badgeColor
                }).setOrigin(1, 0),
                // Description
                this.add.text(34, cy + 5, butt.desc, {
                    fontFamily: FONT_UI,
                    fontSize: '12px',
                    color: '#a8a29e'
                })
            ]);
        });

        // 整塊清單只用一個感應區：點擊時依手指位置換算是哪張卡
        //（被遮罩藏起來的卡片不會誤觸，也才分得出「點一下」和「拖曳捲動」）
        const zone = this.add.zone(W / 2, (viewTop + H) / 2, W, H - viewTop).setInteractive({ useHandCursor: true }).setDepth(23);
        zone.on('pointerdown', (pointer) => {
            if (this.pickingUp) return;
            this.stopListMotion();
            const y = this.toWorldY(pointer);
            this.scroller.drag = { startY: y, lastY: y, lastT: this.time.now, startScroll: this.scroller.scroll, idx: this.cardAt(y), moved: false };
            this.setHover(this.scroller.drag.idx);  // 手機沒有滑鼠移過，按下去就先亮起來
        });
        this.input.on('pointermove', (pointer) => {
            const y = this.toWorldY(pointer);
            const drag = this.scroller.drag;
            if (drag && pointer.isDown) {
                if (!drag.moved && Math.abs(y - drag.startY) > 8) {
                    drag.moved = true;
                    this.setHover(-1);
                }
                if (drag.moved) {
                    const now = this.time.now;
                    const dt = Math.max(1, now - drag.lastT);
                    this.scroller.vel = 0.7 * ((drag.lastY - y) / dt) + 0.3 * this.scroller.vel;
                    drag.lastY = y;
                    drag.lastT = now;
                    this.setListScroll(drag.startScroll - (y - drag.startY));
                }
            } else if (!pointer.isDown && y >= this.scroller.top) {
                this.setHover(this.cardAt(y));
            } else if (y >= this.scroller.top) {
                this.setHover(-1);
            }
        });
        const release = (pointer) => {
            const drag = this.scroller.drag;
            if (!drag) return;
            this.scroller.drag = null;
            // 剛放手時手指已經停住就不滑行
            if (!drag.moved || this.time.now - drag.lastT > 80) this.scroller.vel = 0;
            if (drag.moved) return;
            const idx = this.cardAt(this.toWorldY(pointer));
            if (idx >= 0 && idx === drag.idx) this.selectAndPickupButt(CIGARETTE_BUTTS[idx]);
            else this.setHover(-1);
        };
        this.input.on('pointerup', release);
        this.input.on('pointerupoutside', release);
        zone.on('pointerout', () => { if (!this.scroller.drag) this.setHover(-1); });

        if (!scrollable) return;

        const maskShape = this.make.graphics({ add: false });
        maskShape.fillStyle(0xffffff, 1).fillRect(0, viewTop - 3, W, H - viewTop + 3);
        this.cardList.setMask(maskShape.createGeometryMask());

        // 右側細捲軸：讓人一眼看出清單可以捲
        const trackTop = viewTop + 4;
        const trackH = H - 18 - trackTop;
        const thumbH = Math.max(28, trackH * (H - 14 - viewTop) / contentH);
        this.scroller.thumbRange = { top: trackTop, travel: trackH - thumbH };
        this.add.rectangle(W - 5, trackTop, 3, trackH, 0xffffff, 0.12).setOrigin(0.5, 0).setDepth(24);
        this.scrollThumb = this.add.rectangle(W - 5, trackTop, 3, thumbH, 0xffffff, 0.6).setOrigin(0.5, 0).setDepth(24);

        this.input.on('wheel', (pointer, over, dx, dy) => {
            if (this.pickingUp || this.scroller.drag) return;
            const y = this.toWorldY(pointer);
            if (y < this.scroller.top) return;
            this.stopListMotion();
            // Firefox 的滾輪有時以「行」為單位回報
            const lineMode = pointer.event && pointer.event.deltaMode === 1;
            this.setListScroll(this.scroller.scroll + (lineMode ? dy * 24 : dy) * 0.6);
            this.setHover(this.cardAt(y));
        });
    }

    update(time, delta) {
        const list = this.scroller;
        if (!list || list.drag || list.vel === 0) return;
        this.setListScroll(list.scroll + list.vel * delta);
        list.vel *= Math.pow(0.994, delta);
        if (Math.abs(list.vel) < 0.02 || list.scroll <= 0 || list.scroll >= list.maxScroll) list.vel = 0;
    }

    toWorldY(pointer) {
        return this.cameras.main.getWorldPoint(pointer.x, pointer.y).y;
    }

    // 世界座標 y 落在哪張卡片上（卡片之間的縫隙、清單外回傳 -1）
    cardAt(worldY) {
        const { top, scroll, slot, cardH, count } = this.scroller;
        const y = worldY - top + scroll;
        const idx = Math.floor(y / slot);
        if (idx < 0 || idx >= count || y - idx * slot > cardH) return -1;
        return idx;
    }

    setListScroll(value) {
        const list = this.scroller;
        list.scroll = Phaser.Math.Clamp(value, 0, list.maxScroll);
        this.cardList.y = list.top - list.scroll;
        if (this.scrollThumb) {
            this.scrollThumb.y = list.thumbRange.top + list.thumbRange.travel * (list.scroll / list.maxScroll);
        }
    }

    stopListMotion() {
        this.scroller.vel = 0;
        if (this.scroller.tween) {
            this.scroller.tween.stop();
            this.scroller.tween = null;
        }
    }

    // 滑到鐵盤上的菸蒂時，對應的卡片若被捲到看不見就自動捲出來
    scrollCardIntoView(idx) {
        const list = this.scroller;
        if (!list.maxScroll || list.drag) return;
        const cardTop = idx * list.slot;
        const viewH = GAME_H - 14 - list.top;
        let target = list.scroll;
        if (cardTop < list.scroll) target = cardTop;
        else if (cardTop + list.cardH > list.scroll + viewH) target = cardTop + list.cardH - viewH;
        if (target === list.scroll) return;
        this.stopListMotion();
        list.tween = this.tweens.addCounter({
            from: list.scroll,
            to: Phaser.Math.Clamp(target, 0, list.maxScroll),
            duration: 220,
            ease: 'Sine.easeOut',
            onUpdate: (tw) => this.setListScroll(tw.getValue()),
            onComplete: () => { list.tween = null; }
        });
    }

    setHover(idx) {
        if (idx === this.hoverIdx) return;
        if (this.hoverIdx >= 0) this.highlight(this.hoverIdx, false);
        this.hoverIdx = idx;
        if (idx >= 0) this.highlight(idx, true);
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
