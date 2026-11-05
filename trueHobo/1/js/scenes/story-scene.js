// ----------------------------------------------------------------------------
// SCENE C: STORY CUTSCENE (0.jpg -> 1.jpg -> 2.jpg)
// 街友阿睿在熱鬧街頭走到巷子，巷子裡有一個煙灰垃圾桶，上方放著鐵盤當做煙灰缸
// 第一次一定要看完劇情，看完一次之後才出現「跳過劇情」
// ----------------------------------------------------------------------------

// 有沒有看完過劇情：記在玩家自己的瀏覽器（localStorage）；
// 無痕模式等讀寫失敗時，至少在這次開啟期間記得（重新整理後要再看一次）
const StoryProgress = {
    KEY: 'trueHobo1.storySeen',   // han45678.github.io 底下所有頁面共用 localStorage，名稱要帶遊戲代號
    seenThisSession: false,

    isSeen() {
        if (this.seenThisSession) return true;
        try {
            return localStorage.getItem(this.KEY) === '1';
        } catch (e) {
            return false;
        }
    },

    markSeen() {
        this.seenThisSession = true;
        try {
            localStorage.setItem(this.KEY, '1');
        } catch (e) { }
    }
};

class StoryScene extends Phaser.Scene {
    constructor() {
        super({ key: 'StoryScene' });
    }

    create() {
        setupView(this);
        const W = GAME_W;
        const H = GAME_H;
        this.cameras.main.fadeIn(400, 0, 0, 0);

        this.slides = [
            {
                img: 'img0',
                focus: { x: 245, y: 230 },
                title: '第一章：霓虹街頭的阿睿',
                text: '夜色微涼，熱鬧的台灣街頭人車鼎沸。\n街友阿睿摸了摸空空的大衣口袋，嘴裡那根菸早就熄了…'
            },
            {
                img: 'img1',
                focus: { x: 300, y: 430 },
                title: '第二章：轉入暗巷',
                text: '阿睿熟門熟路地轉進快炒店後方的潮濕暗巷。\n巷子正中央擺著一個生鏽的鐵皮垃圾桶。'
            },
            {
                img: 'img2',
                focus: ART_FX.img2.treasure,
                title: '第三章：鐵盤煙灰缸的寶藏',
                text: '垃圾桶上方被放了一個大鐵盤當作煙灰缸，\n裡頭堆滿了路人剛捻熄的各式菸屁股！阿睿眼睛亮了起來…'
            }
        ];

        this.currentSlideIndex = 0;
        this.typing = false;
        this.typeTimer = null;
        this.slideFx = [];
        this.chapterTag = null;

        // 兩層背景輪流交叉淡入
        this.bgFront = addArtImage(this, 'img0', 1);
        this.bgBack = addArtImage(this, 'img0', 0);

        addRain(this);
        addFilmFinish(this);

        // 漫畫旁白框
        this.boxX = 16;
        this.boxY = H - 182;
        this.boxW = W - 32;
        this.boxH = 160;
        drawComicPanel(this, this.boxX, this.boxY, this.boxW, this.boxH, {
            fill: PAPER,
            alpha: 0.97,
            shadow: 7,
            border: 3.5,
            halftone: true,
            depth: 20
        });

        this.storyTxt = this.add.text(this.boxX + 22, this.boxY + 34, '', {
            fontFamily: FONT_UI,
            fontSize: '17px',
            fontStyle: 'bold',
            color: INK,
            lineSpacing: 9
        }).setDepth(22);

        this.nextPrompt = this.add.text(this.boxX + this.boxW - 18, this.boxY + this.boxH - 20, '點擊繼續 ▶', {
            fontFamily: FONT_UI,
            fontSize: '14px',
            fontStyle: '900',
            color: '#b91c1c'
        }).setOrigin(1, 0.5).setDepth(22);

        this.tweens.add({
            targets: this.nextPrompt,
            alpha: 0.35,
            duration: 550,
            yoyo: true,
            repeat: -1
        });

        // 分鏡進度點
        this.progressDots = this.slides.map((_, i) =>
            this.add.circle(this.boxX + 26 + i * 18, this.boxY + this.boxH - 20, 5, 0xb91c1c, 1)
                .setStrokeStyle(2, 0x000000)
                .setDepth(22)
        );

        // Skip button（放左上）：看完過一次劇情才有
        if (StoryProgress.isSeen()) {
            const skipBtn = createComicButton(this, 72, 56, 112, 34, '跳過劇情 ⏭', {
                fill: 0x111827,
                color: '#e5e7eb',
                fontSize: '13px',
                shadow: 4,
                border: 2.5,
                shine: 0.06,
                depth: 30
            });

            skipBtn.on('pointerdown', (pointer, x, y, event) => {
                event.stopPropagation();
                this.scene.start('SelectButtScene');
            });
        }

        this.showSlide(0);

        this.input.on('pointerdown', () => {
            if (this.typing) {
                this.finishTyping();
                return;
            }
            this.currentSlideIndex++;
            if (this.currentSlideIndex < this.slides.length) {
                this.showSlide(this.currentSlideIndex);
            } else {
                // 最後一頁也看完了：之後再進劇情就可以跳過
                StoryProgress.markSeen();
                this.scene.start('SelectButtScene');
            }
        });
    }

    showSlide(idx) {
        const s = this.slides[idx];

        // 新圖放上層淡入，舊圖留在下層
        const incoming = this.bgBack;
        this.bgBack = this.bgFront;
        this.bgFront = incoming;
        incoming.setTexture(s.img);
        fitCover(incoming);
        incoming.setDepth(1).setAlpha(idx === 0 ? 1 : 0);
        this.bgBack.setDepth(0);
        kenBurns(this, incoming, s.focus, 1.07, 7000);
        if (idx > 0) {
            this.tweens.add({ targets: incoming, alpha: 1, duration: 450 });
        }

        // 該分鏡的霓虹 / 路燈 / 鐵盤閃光
        this.slideFx.forEach(o => o.destroy());
        const fx = ART_FX[s.img] || {};
        this.slideFx = [...addNeonGlow(this, fx.neon, 3), ...addLampGlow(this, fx.lamp, 3)];
        if (s.img === 'img0') {
            const ember = ART_FX.img0.ember;
            const glow = this.add.image(ember.x, ember.y, glowKey(this, 0xff6a1a)).setBlendMode(ADD).setScale(0.3).setAlpha(0.6).setDepth(4);
            this.tweens.add({ targets: glow, alpha: 0.3, duration: 800, yoyo: true, repeat: -1 });
            this.slideFx.push(trackArt(glow));
        }
        if (fx.treasure) {
            const glow = this.add.image(fx.treasure.x, fx.treasure.y, glowKey(this, 0xffc46b))
                .setBlendMode(ADD).setDisplaySize(260, 90).setAlpha(0.15).setDepth(4);
            this.tweens.add({ targets: glow, alpha: 0.45, duration: 700, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
            const glints = this.add.particles(fx.treasure.x, fx.treasure.y, 'fx-spark', {
                x: { min: -55, max: 55 },
                y: { min: -18, max: 14 },
                scale: { start: 0.6, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 520,
                frequency: 170,
                tint: 0xfff1b0,
                blendMode: ADD
            }).setDepth(5);
            this.slideFx.push(trackArt(glow), trackArt(glints));
        }

        // 章節標籤
        if (this.chapterTag) this.chapterTag.destroy();
        this.chapterTag = addTagLabel(this, 0, this.boxY, s.title, { fontSize: '15px', angle: -2, depth: 23 });
        this.chapterTag.x = this.boxX + 14 + this.chapterTag.boxW / 2;

        this.progressDots.forEach((dot, i) => dot.setFillStyle(i === idx ? 0xb91c1c : 0xd6cdb4, 1));
        this.nextPrompt.setText(idx === this.slides.length - 1 ? '點擊挑選菸屁股 ▶' : '點擊繼續 ▶');
        this.typeText(s.text);
    }

    typeText(fullText) {
        if (this.typeTimer) this.typeTimer.remove();
        this.fullText = fullText;
        this.typedLen = 0;
        this.typing = true;
        this.storyTxt.setText('');
        this.nextPrompt.setVisible(false);
        this.typeTimer = this.time.addEvent({
            delay: 32,
            loop: true,
            callback: () => {
                this.typedLen++;
                this.storyTxt.setText(this.fullText.slice(0, this.typedLen));
                if (this.typedLen >= this.fullText.length) this.finishTyping();
            }
        });
    }

    finishTyping() {
        if (this.typeTimer) {
            this.typeTimer.remove();
            this.typeTimer = null;
        }
        this.storyTxt.setText(this.fullText);
        this.typing = false;
        this.nextPrompt.setVisible(true);
    }

    update() {
        syncToArt(this.bgFront, this.slideFx);
    }
}
