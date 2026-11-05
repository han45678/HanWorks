/**
 * ============================================================================
 * 3. CIGARETTE BUTT DATA (越好的煙屁股 難度越高)
 * ============================================================================
 */
const CIGARETTE_BUTTS = [
    {
        id: 'damp_long',
        name: '受潮長菸蒂',
        subtitle: '路邊水窪旁撿到的半支長壽菸',
        stars: '★☆☆☆☆',
        difficultyLabel: '簡單',
        badgeColor: '#2ecc71',
        heatRate: 28,          // % per second when holding
        coolRate: 38,          // % per second when released
        // 黃金過癮區（燙度 %）：倍率越高的菸蒂區域越窄 → 簡單 40% / 適中 28% / 困難 18% / 地獄 12%
        sweetMin: 45,          // Sweet spot start %
        sweetMax: 85,          // Sweet spot end %（寬 40%）
        scoreMultiplier: 1.0,
        burnPenalty: 120,
        trayPos: { x: 84, y: 367 }, // 鐵盤原圖上實際菸蒂的位置（540x960 遊戲座標）
        stubLen: 46,           // HUD 上濾嘴後面還剩多長的菸紙（px，濾嘴固定 36px）
        desc: '菸身較長且微濕，升溫慢、容錯率高，適合剛入巷弄的新手。'
    },
    {
        id: 'half_rich',
        name: '半截濃醇菸屁股',
        subtitle: '快炒店老闆剛捻熄的七星濃菸',
        stars: '★★★☆☆',
        difficultyLabel: '適中',
        badgeColor: '#f1c40f',
        heatRate: 44,
        coolRate: 34,
        sweetMin: 55,
        sweetMax: 83,          // 寬 28%
        scoreMultiplier: 1.8,
        burnPenalty: 180,
        trayPos: { x: 292, y: 467 },
        stubLen: 30,
        desc: '菸草乾燥紮實、吸起來濃郁過癮，但火頭推進速度明顯加快！'
    },
    {
        id: 'short_import',
        name: '極短進口濃菸頭',
        subtitle: '居酒屋日本客留下的極短赤マル',
        stars: '★★★★☆',
        difficultyLabel: '困難',
        badgeColor: '#e67e22',
        heatRate: 64,
        coolRate: 30,
        sweetMin: 64,
        sweetMax: 82,          // 寬 18%
        scoreMultiplier: 3.0,
        burnPenalty: 260,
        trayPos: { x: 134, y: 496 },
        stubLen: 15,
        desc: '火源已經貼近濾嘴邊緣！稍微貪吸半秒就會直接燙爆嘴唇！'
    },
    {
        id: 'legend_gold',
        name: '傳說貼皮黃金屁股',
        subtitle: '只剩 3mm 的頂級雪茄型濃菸頭',
        stars: '★★★★★',
        difficultyLabel: '地獄',
        badgeColor: '#e74c3c',
        heatRate: 88,
        coolRate: 27,
        sweetMin: 72,
        sweetMax: 84,          // 寬 12%
        scoreMultiplier: 5.0,
        burnPenalty: 400,
        trayPos: { x: 489, y: 328 },
        stubLen: 7,
        desc: '街友界傳說極品！每一口都是五倍暴利積分，但需要毫秒級放開控溫！'
    }
];

// 黃金過癮區的加分倍數：每 0.3 秒重新抽一次 x1.2 ~ x2.0（以 0.1 為單位）
const ZONE_BONUS = { min: 1.2, max: 2.0, rerollMs: 300 };

function rollZoneBonus() {
    const steps = Math.round((ZONE_BONUS.max - ZONE_BONUS.min) * 10);
    return Math.round((ZONE_BONUS.min * 10 + Phaser.Math.Between(0, steps))) / 10;
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
