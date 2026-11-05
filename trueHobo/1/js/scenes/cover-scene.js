// ----------------------------------------------------------------------------
// SCENE B: COVER SCENE (遊戲封面：霓虹街頭 + 持續不斷電搖滾配樂)
// ----------------------------------------------------------------------------
class CoverScene extends Phaser.Scene {
    constructor() {
        super({ key: 'CoverScene' });
    }

    create() {
        setupView(this);
        const W = GAME_W;
        const H = GAME_H;
        const fx = ART_FX.img0;

        // 1. 封面原圖：以叼菸的臉為定點緩慢推近
        this.coverImg = addArtImage(this, 'img0');
        kenBurns(this, this.coverImg, { x: fx.ember.x - 10, y: fx.ember.y - 10 }, 1.05, 9000, true);
        this.artFx = addNeonGlow(this, fx.neon, 2);

        // 菸頭火光 + 裊裊白煙
        const emberGlow = this.add.image(fx.ember.x, fx.ember.y, glowKey(this, 0xff6a1a))
            .setBlendMode(ADD)
            .setScale(0.32)
            .setDepth(4);
        this.artFx.push(trackArt(emberGlow));
        this.tweens.add({ targets: emberGlow, alpha: { from: 0.35, to: 0.85 }, duration: 900, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });

        const smoke = this.add.particles(fx.ember.x + 4, fx.ember.y - 4, 'fx-smoke', {
            speedX: { min: 4, max: 22 },
            speedY: { min: -48, max: -28 },
            accelerationX: 9,
            scale: { start: 0.08, end: 0.75 },
            alpha: { start: 0.3, end: 0 },
            rotate: { min: 0, max: 360 },
            lifespan: 3600,
            frequency: 160,
            tint: 0xdde7ef
        }).setDepth(5);

        addRain(this, { density: 1.1 });
        addFilmFinish(this);

        // 2. 封面影片 video.mp4：解出畫面後淡入（深度 6，蓋過只對得上原圖的霓虹/火光/白煙），聲音用影片原聲
        this.videoImg = null;
        this.imageOnlyFx = [...this.artFx, emberGlow, smoke];
        if (CoverVideo.start()) {
            audioEngine.duckBGM = true;
        } else {
            audioEngine.duckBGM = false;
            audioEngine.startContinuousBGM();
        }
        this.events.once('shutdown', () => CoverVideo.stop());

        // 上下壓暗：標題移到下方，不再擋住阿睿的臉
        this.add.image(W / 2, 0, shadeKey(this, '0,0,0', 0.6, 0)).setOrigin(0.5, 0).setDisplaySize(W, 90).setDepth(10);
        this.add.image(W / 2, H, shadeKey(this, '5,6,10', 0, 0.95)).setOrigin(0.5, 1).setDisplaySize(W, 470).setDepth(10);

        const tagTxt = this.add.text(W / 2, 588, '【 街友本色 一部曲 煙屁股大作戰 】', {
            fontFamily: FONT_UI,
            fontSize: '13px',
            fontStyle: 'bold',
            color: '#fbbf24'
        }).setOrigin(0.5).setShadow(2, 2, '#000', 4).setDepth(12);

        // 遊戲名稱：街友本色 I - 煙屁股大作戰 / True Hobo I: Butt Brawl
        const titleY = 648;
        const titleMain = this.add.text(0, titleY, '街友本色', {
            fontFamily: FONT_TITLE,
            fontSize: '80px',
            fontStyle: '900',
            color: '#f59e0b',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5).setAngle(-3).setShadow(6, 6, '#000000', 0, true, false).setDepth(12);
        const titleGrad = titleMain.context.createLinearGradient(0, 0, 0, titleMain.height);
        titleGrad.addColorStop(0, '#fff3b0');
        titleGrad.addColorStop(0.45, '#fbbf24');
        titleGrad.addColorStop(1, '#ea580c');
        titleMain.setFill(titleGrad);

        // 續作編號「I」用紅色襯線字蓋在主標右側（襯線讓它一眼看得出是羅馬數字）
        const titleNum = this.add.text(0, titleY, 'I', {
            fontFamily: FONT_TITLE,
            fontSize: '88px',
            fontStyle: '900',
            color: '#ef4444',
            stroke: '#000000',
            strokeThickness: 10
        }).setOrigin(0.5).setAngle(-3).setShadow(6, 6, '#000000', 0, true, false).setDepth(13);
        const numGrad = titleNum.context.createLinearGradient(0, 0, 0, titleNum.height);
        numGrad.addColorStop(0, '#fecaca');
        numGrad.addColorStop(0.5, '#ef4444');
        numGrad.addColorStop(1, '#991b1b');
        titleNum.setFill(numGrad);

        // 主標 + 編號整組置中，編號沿著 -3° 的傾斜線往右上排
        const numGap = 8;
        const groupW = titleMain.width + numGap + titleNum.width;
        titleMain.x = W / 2 - groupW / 2 + titleMain.width / 2;
        const numDx = titleMain.width / 2 + numGap + titleNum.width / 2;
        titleNum.setPosition(titleMain.x + numDx, titleY - numDx * Math.tan(Phaser.Math.DegToRad(3)));

        const subTitle = addTagLabel(this, W / 2, 716, '煙屁股大作戰', {
            fontFamily: FONT_TITLE,
            fontSize: '24px',
            fill: 0xb91c1c,
            color: '#fef2f2',
            angle: 1.5,
            padX: 20,
            padY: 3,
            depth: 12
        });

        const titleEn = this.add.text(W / 2, 760, 'True Hobo I: Butt Brawl', {
            fontFamily: FONT_TITLE,
            fontSize: '25px',
            fontStyle: '900',
            color: '#fde68a',
            stroke: '#000000',
            strokeThickness: 5
        }).setOrigin(0.5).setShadow(3, 3, '#000000', 0, true, false).setDepth(12);

        // Story intro blurb
        const blurb = this.add.text(W / 2, 808, '在熱鬧的霓虹街頭轉進暗巷，鐵盤煙灰缸裡躺著各式菸蒂…\n壓住同一個位置猛吸、適時放開控溫，小心別燙起水泡！', {
            fontFamily: FONT_UI,
            fontSize: '14px',
            color: '#e7e5e4',
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5).setShadow(1, 2, '#000', 3).setDepth(12);

        // Interactive CTA Button
        const btnStart = createComicButton(this, W / 2, 870, 290, 60, '🔥 點擊進入遊戲', { fontSize: '24px', depth: 13 });
        this.tweens.add({
            targets: btnStart,
            scale: 1.05,
            duration: 650,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });

        // 標題蓋章式登場，續作編號「I」隨後再蓋一次
        titleMain.setScale(1.7).setAlpha(0);
        titleNum.setScale(2.6).setAlpha(0);
        [tagTxt, subTitle, titleEn, blurb].forEach(o => o.setAlpha(0));
        this.tweens.add({
            targets: titleMain,
            scale: 1,
            alpha: 1,
            delay: 250,
            duration: 420,
            ease: 'Back.easeOut',
            onComplete: () => this.cameras.main.shake(160, 0.006)
        });
        this.tweens.add({
            targets: titleNum,
            scale: 1,
            alpha: 1,
            delay: 700,
            duration: 260,
            ease: 'Back.easeOut',
            onComplete: () => this.cameras.main.shake(120, 0.005)
        });
        this.tweens.add({ targets: [tagTxt, subTitle, titleEn, blurb], alpha: 1, delay: 900, duration: 500 });

        // 點擊畫面任意處進入劇情：影片原聲隨畫面淡出，合成搖滾配樂接手（之後持續不中斷）
        let entering = false;
        const handleStart = () => {
            if (entering) return;
            entering = true;
            audioEngine.duckBGM = false;
            audioEngine.startContinuousBGM();
            audioEngine.playLighterFlick();

            const v = CoverVideo.el;
            if (v) {
                this.tweens.addCounter({ from: v.volume, to: 0, duration: 450, onUpdate: t => { v.volume = t.getValue(); } });
            }

            this.cameras.main.fadeOut(450, 0, 0, 0);
            this.time.delayedCall(460, () => {
                this.scene.start('StoryScene');
            });
        };

        this.input.once('pointerdown', handleStart);
        btnStart.once('pointerdown', handleStart);
    }

    update() {
        syncToArt(this.coverImg, this.artFx);
        this.updateCoverVideo();
    }

    updateCoverVideo() {
        const v = CoverVideo.el;
        if (!v) {
            // 影片中途載入失敗：改回合成搖滾配樂
            if (audioEngine.duckBGM) {
                audioEngine.duckBGM = false;
                audioEngine.startContinuousBGM();
            }
            return;
        }
        if (v.readyState < 2) return;

        if (!this.videoImg) {
            if (!this.textures.exists('coverVideo')) {
                this.textures.create('coverVideo', v, v.videoWidth, v.videoHeight).add('__BASE', 0, 0, 0, v.videoWidth, v.videoHeight);
            }
            this.videoImg = fitCover(this.add.image(GAME_W / 2, GAME_H / 2, 'coverVideo')).setDepth(6).setAlpha(0);
            this.tweens.add({
                targets: this.videoImg,
                alpha: 1,
                duration: 600,
                onComplete: () => this.imageOnlyFx.forEach(o => o.setVisible(false))
            });
            this.videoFrameTime = -1;
        }
        // WebGL 不會自己更新影片貼圖：有新畫面才重新上傳
        if (v.currentTime !== this.videoFrameTime) {
            this.videoFrameTime = v.currentTime;
            this.textures.get('coverVideo').source[0].update();
        }
    }
}
