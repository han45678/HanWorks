/**
 * ============================================================================
 * 3. CIGARETTE BUTT DATA (越好的煙屁股 難度越高)
 * ============================================================================
 */
const CIGARETTE_BUTTS = [
    {
        id: 'da_wei',
        name: '大尾',
        subtitle: '角頭大哥抽兩口就丟的長長一截',
        stars: '★☆☆☆☆',
        difficultyLabel: '簡單',
        badgeColor: '#2ecc71',
        heatRate: 28,          // % per second when holding
        coolRate: 38,          // % per second when released
        // 黃金過癮區寬度（燙度 %）：倍率越高的菸蒂區域越窄 → 簡單 40% / 適中 32% / 困難 24% / 地獄 17% / 傳說 12%
        // 上緣固定貼在燙傷線下方 SWEET_BURN_GAP，sweetMin / sweetMax 由下方自動算出
        sweetWidth: 40,
        scoreMultiplier: 1.0,
        burnPenalty: 120,
        trayPos: { x: 84, y: 367 }, // 鐵盤原圖上實際菸蒂的位置（540x960 遊戲座標）
        stubLen: 46,           // HUD 上濾嘴後面還剩多長的菸紙（px，濾嘴固定 36px）
        desc: '大哥抽兩口就丟，菸身還很長，升溫慢、容錯率高，新手首選。'
    },
    {
        id: 'pi_si',
        name: '屁死',
        subtitle: '公園阿伯下棋時隨手捻熄的',
        stars: '★★☆☆☆',
        difficultyLabel: '適中',
        badgeColor: '#f1c40f',
        heatRate: 40,
        coolRate: 35,
        sweetWidth: 32,
        scoreMultiplier: 1.5,
        burnPenalty: 160,
        trayPos: { x: 490, y: 430 },
        stubLen: 36,
        desc: '菸身還剩一大半、火力溫和，比大尾快一點，適合暖身練手感。'
    },
    {
        id: 'ma_po_rou',
        name: '麻婆肉',
        subtitle: '快炒店老闆剛捻熄的半截濃菸',
        stars: '★★★☆☆',
        difficultyLabel: '困難',
        badgeColor: '#e67e22',
        heatRate: 52,
        coolRate: 32,
        sweetWidth: 24,
        scoreMultiplier: 2.5,
        burnPenalty: 220,
        trayPos: { x: 292, y: 467 },
        stubLen: 26,
        desc: '菸草乾燥紮實、吸起來濃郁過癮，但火頭推進速度明顯加快！'
    },
    {
        id: 'wen_si_dun',
        name: '穩死盾',
        subtitle: '居酒屋上班族留下的極短一截',
        stars: '★★★★☆',
        difficultyLabel: '地獄',
        badgeColor: '#e74c3c',
        heatRate: 68,
        coolRate: 29,
        sweetWidth: 17,
        scoreMultiplier: 3.5,
        burnPenalty: 300,
        trayPos: { x: 134, y: 496 },
        stubLen: 15,
        desc: '火源已經貼近濾嘴邊緣！稍微貪吸半秒就會直接燙爆嘴唇！'
    },
    {
        id: 'shi_qi_xing_qiu',
        name: '十柒猩球',
        subtitle: '只剩 3mm 的街友界傳說菸頭',
        stars: '★★★★★',
        difficultyLabel: '傳說',
        badgeColor: '#c084fc',
        heatRate: 88,
        coolRate: 27,
        sweetWidth: 12,
        scoreMultiplier: 5.0,
        burnPenalty: 400,
        trayPos: { x: 489, y: 328 },
        stubLen: 7,
        desc: '街友界傳說極品！每一口都是五倍暴利積分，但需要毫秒級放開控溫！'
    }
];

// 黃金過癮區上緣只比燙傷（100%）低一點點：過了過癮區就是燙傷邊緣，
// 免得玩家以為過癮區上面還有一大段「沒分數」的空白
const SWEET_BURN_GAP = 1;
CIGARETTE_BUTTS.forEach(butt => {
    butt.sweetMax = 100 - SWEET_BURN_GAP;
    butt.sweetMin = butt.sweetMax - butt.sweetWidth;
});

// 黃金過癮區的加分倍數：每 0.3 秒重新抽一次 x1.2 ~ x2.0（以 0.1 為單位）
const ZONE_BONUS = { min: 1.2, max: 2.0, rerollMs: 300 };

function rollZoneBonus() {
    const steps = Math.round((ZONE_BONUS.max - ZONE_BONUS.min) * 10);
    return Math.round((ZONE_BONUS.min * 10 + Phaser.Math.Between(0, steps))) / 10;
}

// 黃金過癮區再由下往上等分成幾段，越上面（越接近燙傷）加分越多；畫面上不畫出來，讓玩家自己摸索。
// 跟上面每 0.3 秒重抽的加分倍數相乘；要改段數或倍數，直接改這個陣列（由下往上）
const SWEET_TIERS = [1.0, 1.2, 1.5, 2.0];

function sweetTierBonus(butt, heat) {
    const t = (heat - butt.sweetMin) / (butt.sweetMax - butt.sweetMin);
    const idx = Phaser.Math.Clamp(Math.floor(t * SWEET_TIERS.length), 0, SWEET_TIERS.length - 1);
    return SWEET_TIERS[idx];
}

// Shared Game State
const GAME_STATE = {
    selectedButt: CIGARETTE_BUTTS[1],
    lastResult: null
};

/**
 * ============================================================================
 * 4. RENDER SETTINGS & ART CALIBRATION
 * ============================================================================
 * 遊戲邏輯座標固定為 540x960；畫布實際以 RENDER_SCALE 倍像素渲染（攝影機放大），
 * 讓漫畫線稿與文字在手機 / Retina 螢幕上維持銳利。
 */
const GAME_W = 540;
const GAME_H = 960;
const RENDER_SCALE = 2;
const ADD = Phaser.BlendModes.ADD;

// 全站字型：英文字母取 Noto Serif，中文 Noto Serif 沒有字形會自動落到 Noto Serif TC
const FONT_SERIF = '"Noto Serif", "Noto Serif TC", "Songti TC", "PMingLiU", serif';
const FONT_UI = FONT_SERIF;
const FONT_TITLE = FONT_SERIF;
const FONT_NUM = FONT_SERIF;
const INK = '#1c1917';
const PAPER = 0xf2e8cf;

// 所有 Text 都以 RENDER_SCALE 解析度繪製，配合攝影機放大後才不會糊
// 要在建立時就帶進 style：事後 setResolution() 不會更新貼圖的解析度，Canvas 模式（本機開檔）會把字畫成兩倍大
(function patchTextResolution() {
    const factory = Phaser.GameObjects.GameObjectFactory.prototype;
    const createText = factory.text;
    factory.text = function (x, y, text, style) {
        return createText.call(this, x, y, text, { ...style, resolution: RENDER_SCALE });
    };
})();

// 內建原圖上的關鍵位置（已換算成 540x960 遊戲座標）
const ALLEY_NEON = [
    { x: 338, y: 241, w: 21, h: 67, color: 0xff3326 },   // ラーメン
    { x: 318, y: 314, w: 60, h: 25, color: 0xff3326 },   // 居酒屋
    { x: 327, y: 93, w: 22, h: 60, color: 0xa78bfa }     // 紫色直招牌
];
const PROFILE_NEON = [
    { x: 348, y: 241, w: 18, h: 65, color: 0xff3326 },
    { x: 330, y: 314, w: 60, h: 21, color: 0xff3326 },
    { x: 334, y: 96, w: 12, h: 52, color: 0xa78bfa }
];
const PROFILE_FX = {
    lamp: { x: 294, y: 117 },
    neon: PROFILE_NEON,
    ember: { x: 321, y: 492 },   // 菸頭
    mouth: { x: 200, y: 494 }    // 叼菸的嘴角
};
const ART_FX = {
    img0: {
        ember: { x: 264, y: 247 },
        neon: [
            { x: 262, y: 95, w: 60, h: 197, color: 0xff3a2a },    // 老蔡家快炒
            { x: 326, y: 237, w: 26, h: 102, color: 0xff3a2a },   // 台灣牛肉麵（直）
            { x: 315, y: 300, w: 95, h: 31, color: 0xff3a2a },    // 台灣牛肉麵（橫）
            { x: 354, y: 183, w: 16, h: 119, color: 0x38bdf8 },   // 藍色直招牌
            { x: 482, y: 278, w: 25, h: 99, color: 0x22c55e },    // 檳榔老葉
            { x: 455, y: 323, w: 19, h: 77, color: 0x22c55e },
            { x: 525, y: 118, w: 30, h: 137, color: 0xffc04a }    // 機車修理
        ]
    },
    img1: { lamp: { x: 285, y: 116 }, neon: ALLEY_NEON },
    img2: { lamp: { x: 285, y: 116 }, neon: ALLEY_NEON, treasure: { x: 281, y: 590 } },
    img4: { pinch: { x: 288, y: 472 } },
    img5: PROFILE_FX,
    img6: PROFILE_FX
};
