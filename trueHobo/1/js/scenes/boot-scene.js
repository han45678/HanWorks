// ----------------------------------------------------------------------------
// SCENE A: BOOT & PRELOAD SCENE
// 原圖：images/0.webp~7.webp；封面影片：video/video.mp4；缺圖時改用程式繪製的備援美術
// ----------------------------------------------------------------------------
class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload() {
        setupView(this);
        this.loadingTxt = this.add.text(GAME_W / 2, GAME_H / 2, '正在載入巷弄街景與音效...', {
            fontFamily: FONT_UI,
            fontSize: '20px',
            color: '#f59e0b',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        CoverVideo.load();
        VoiceClips.load(audioEngine.taiwaneseBurnLines.filter(l => l.audio).map(l => l.audio));
        for (let i = 0; i <= 7; i++) this.load.image(`img${i}`, withVersion(`./images/${i}.webp`));
        this.load.on('progress', p => this.loadingTxt.setText(`正在載入巷弄街景與音效... ${Math.round(p * 100)}%`));
    }

    create() {
        loadWebFonts().then(() => {
            ComicArtGenerator.generateAllTextures(this);
            FxTextures.generate(this);
            this.showTapToStart();
        });
    }

    // 瀏覽器規定玩家點過畫面之前不能播放有聲音的影片和音樂，所以一律先點一下，封面一出來就有聲音
    showTapToStart() {
        const W = GAME_W;
        this.loadingTxt.destroy();
        addArtImage(this, 'img0').setAlpha(0.3);
        addFilmFinish(this);

        this.add.text(W / 2, 372, '街友本色 I', {
            fontFamily: FONT_TITLE,
            fontSize: '46px',
            fontStyle: '900',
            color: '#f59e0b',
            stroke: '#000000',
            strokeThickness: 8
        }).setOrigin(0.5).setDepth(12);
        this.add.text(W / 2, 422, '煙屁股大作戰 · True Hobo I: Butt Brawl', {
            fontFamily: FONT_UI,
            fontSize: '15px',
            fontStyle: 'bold',
            color: '#fde68a'
        }).setOrigin(0.5).setShadow(2, 2, '#000', 3).setDepth(12);

        const btn = createComicButton(this, W / 2, 510, 250, 62, '🔊 點一下開始', { fontSize: '25px', depth: 13 });
        this.tweens.add({ targets: btn, scale: 1.05, duration: 650, yoyo: true, repeat: -1, ease: 'Sine.easeInOut' });
        this.add.text(W / 2, 572, 'TAP TO START · 建議開啟聲音遊玩', {
            fontFamily: FONT_UI,
            fontSize: '13px',
            color: '#a8a29e'
        }).setOrigin(0.5).setDepth(12);


        // pointerup 對手機才算「使用者操作」，要在這個當下建立音效、播放影片
        this.input.once('pointerup', () => {
            audioEngine.init();
            CoverVideo.start();
            this.scene.start('CoverScene');
        });
    }
}
