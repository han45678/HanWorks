/**
 * ============================================================================
 * 2. HIGH-DETAIL PROCEDURAL COMIC ARTWORK GENERATOR (FALLBACK FOR 0.jpg ~ 6.jpg)
 * ============================================================================
 * Recreates the exact dark ink-and-watercolor Taiwanese street comic aesthetic
 * of 0.jpg, 1.jpg, 2.jpg, 3.jpg, 4.jpg, 5.jpg, and 6.jpg on HTML5 Canvas
 * so the game is 100% playable and visually authentic immediately, while also
 * supporting hot-swapping with the user's actual image files.
 */
class ComicArtGenerator {
    static generateAllTextures(scene) {
        const W = 540, H = 960;
        const configs = [
            { key: 'img0', drawFn: (ctx) => ComicArtGenerator.drawScene0_NeonStreet(ctx, W, H) },
            { key: 'img1', drawFn: (ctx) => ComicArtGenerator.drawScene1_AlleyFar(ctx, W, H, false) },
            { key: 'img2', drawFn: (ctx) => ComicArtGenerator.drawScene1_AlleyFar(ctx, W, H, true) },
            { key: 'img3', drawFn: (ctx) => ComicArtGenerator.drawScene3_AshtrayClose(ctx, W, H, false) },
            { key: 'img4', drawFn: (ctx) => ComicArtGenerator.drawScene3_AshtrayClose(ctx, W, H, true) },
            { key: 'img5', drawFn: (ctx) => ComicArtGenerator.drawScene5_SmokingProfile(ctx, W, H, false) },
            { key: 'img6', drawFn: (ctx) => ComicArtGenerator.drawScene5_SmokingProfile(ctx, W, H, true) }
        ];

        configs.forEach(cfg => {
            if (!scene.textures.exists(cfg.key)) {
                const canvasTex = scene.textures.createCanvas(cfg.key, W, H);
                const ctx = canvasTex.getContext();
                cfg.drawFn(ctx);
                canvasTex.refresh();
            }
        });
    }

    // Helper: Gritty comic ink crosshatching & vignette
    static applyComicFinish(ctx, W, H) {
        // Ink hatching lines
        ctx.save();
        ctx.strokeStyle = 'rgba(0,0,0,0.22)';
        ctx.lineWidth = 1;
        for (let i = 0; i < 120; i++) {
            const x = (i * 37) % W;
            const y = (i * 83) % H;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x + 8, y + 24);
            ctx.stroke();
        }
        // Dark comic vignette border
        const vig = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, H * 0.65);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(4,6,10,0.68)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
        ctx.restore();
    }

    static drawNeonSign(ctx, x, y, w, h, bgColor, borderColor, text, textColor = '#fff', vertical = true) {
        ctx.save();
        ctx.shadowColor = bgColor;
        ctx.shadowBlur = 16;
        ctx.fillStyle = bgColor;
        ctx.strokeStyle = borderColor;
        ctx.lineWidth = 3;
        ctx.fillRect(x, y, w, h);
        ctx.strokeRect(x, y, w, h);
        ctx.shadowBlur = 0;

        ctx.fillStyle = textColor;
        ctx.font = `900 ${vertical ? Math.floor(w * 0.62) : Math.floor(h * 0.58)}px ${FONT_SERIF}`;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        if (vertical) {
            const chars = text.split('');
            const step = h / (chars.length + 0.6);
            chars.forEach((ch, idx) => {
                ctx.fillText(ch, x + w / 2, y + step * (idx + 0.8));
            });
        } else {
            ctx.fillText(text, x + w / 2, y + h / 2);
        }
        ctx.restore();
    }

    // SCENE 0: Ah-Rui leaning on brick wall in Taiwanese neon street ("老蔡家快炒", "台灣牛肉麵", Taiwan Post mailbox)
    static drawScene0_NeonStreet(ctx, W, H) {
        // Night sky & distant city
        const sky = ctx.createLinearGradient(0, 0, 0, H);
        sky.addColorStop(0, '#0d1924');
        sky.addColorStop(0.55, '#1c3140');
        sky.addColorStop(1, '#121820');
        ctx.fillStyle = sky;
        ctx.fillRect(0, 0, W, H);

        // Distant apartment buildings & tangled power lines
        ctx.fillStyle = '#15222e';
        ctx.fillRect(210, 40, 120, 450);
        ctx.fillRect(360, 80, 140, 420);

        // Wet street pavement with neon reflections
        const road = ctx.createLinearGradient(0, 520, 0, H);
        road.addColorStop(0, '#25333f');
        road.addColorStop(1, '#141b22');
        ctx.fillStyle = road;
        ctx.fillRect(0, 520, W, H - 520);

        // Neon Signs matching 0.jpg
        ComicArtGenerator.drawNeonSign(ctx, 232, 6, 56, 195, '#d92626', '#ffaaaa', '老蔡家快炒', '#fff', true);
        ComicArtGenerator.drawNeonSign(ctx, 314, 195, 34, 96, '#c82828', '#ffcccc', '台灣牛肉麵', '#fff', true);
        ComicArtGenerator.drawNeonSign(ctx, 265, 290, 96, 36, '#c82828', '#ffcccc', '台灣牛肉麵', '#fff', false);
        ComicArtGenerator.drawNeonSign(ctx, 468, 235, 32, 100, '#1e824c', '#a3e4d7', '檳榔老葉', '#fff', true);
        ComicArtGenerator.drawNeonSign(ctx, 505, 58, 34, 138, '#f39c12', '#fff', '機車修理', '#c0392b', true);

        // Left red brick wall with graffiti
        ctx.fillStyle = '#5c3328';
        ctx.fillRect(0, 0, 135, 780);
        ctx.strokeStyle = '#1a0f0c';
        ctx.lineWidth = 2;
        for (let y = 0; y < 780; y += 22) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(135, y); ctx.stroke();
            for (let x = (y % 44 === 0 ? 20 : 40); x < 135; x += 45) {
                ctx.beginPath(); ctx.moveTo(x, y); ctx.lineTo(x, y + 22); ctx.stroke();
            }
        }

        // Green Taiwan Post Mailbox (中華郵政綠色郵筒)
        ctx.fillStyle = '#1e6b3b';
        ctx.strokeStyle = '#091f11';
        ctx.lineWidth = 3;
        ctx.fillRect(285, 372, 76, 135);
        ctx.strokeRect(285, 372, 76, 135);
        ctx.fillStyle = '#b8332a';
        ctx.fillRect(298, 460, 50, 34);
        ctx.fillStyle = '#ffffff';
        ctx.font = `bold 9px ${FONT_SERIF}`;
        ctx.fillText('TAIWAN POST', 293, 452);

        // Scooters on right street
        ctx.fillStyle = '#2c3e50';
        ctx.beginPath(); ctx.arc(430, 535, 22, 0, Math.PI * 2); ctx.fill();
        ctx.fillStyle = '#e74c3c';
        ctx.fillRect(418, 495, 24, 14);
        ctx.fillStyle = '#fff';
        ctx.fillRect(416, 514, 28, 12);

        // Cardboard & black trash bags at bottom left
        ctx.fillStyle = '#8c6d46';
        ctx.beginPath(); ctx.moveTo(75, 750); ctx.lineTo(155, 720); ctx.lineTo(205, 890); ctx.lineTo(115, 910); ctx.closePath(); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1b2026';
        ctx.beginPath(); ctx.arc(55, 890, 68, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // Ah-Rui Full Body Character (Beanie, army green parka, ripped jeans, worn boots, backpack)
        ctx.save();
        // Legs / Ripped Blue Jeans
        ctx.fillStyle = '#2d4c68';
        ctx.strokeStyle = '#0a0e14';
        ctx.lineWidth = 3.5;
        ctx.fillRect(190, 550, 65, 280);
        ctx.strokeRect(190, 550, 65, 280);
        ctx.fillRect(255, 550, 62, 260);
        ctx.strokeRect(255, 550, 62, 260);
        // Knee rips
        ctx.fillStyle = '#c29979';
        ctx.fillRect(202, 665, 42, 24);
        ctx.fillRect(268, 645, 38, 22);
        // Worn Brown Boots
        ctx.fillStyle = '#5c4332';
        ctx.beginPath(); ctx.roundRect(225, 855, 88, 42, 12); ctx.fill(); ctx.stroke();
        ctx.beginPath(); ctx.roundRect(285, 825, 82, 36, 10); ctx.fill(); ctx.stroke();

        // Army Green Parka Jacket
        ctx.fillStyle = '#3f5138';
        ctx.beginPath();
        ctx.moveTo(95, 265);
        ctx.lineTo(265, 255);
        ctx.lineTo(312, 560);
        ctx.lineTo(112, 585);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Patch on sleeve
        ctx.fillStyle = '#2e3b29';
        ctx.fillRect(85, 355, 36, 42);
        ctx.strokeRect(85, 355, 36, 42);

        // Head, long messy hair, beard & knitted beanie
        ctx.fillStyle = '#d4a181';
        ctx.beginPath(); ctx.arc(215, 222, 42, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        // Hair strands
        ctx.fillStyle = '#141619';
        ctx.fillRect(160, 200, 26, 95);
        ctx.fillRect(242, 205, 20, 85);
        // Knitted Beanie
        ctx.fillStyle = '#3b423e';
        ctx.beginPath(); ctx.arc(212, 196, 52, Math.PI, 0); ctx.fill(); ctx.stroke();
        ctx.fillRect(158, 185, 108, 26); ctx.strokeRect(158, 185, 108, 26);

        // Cigarette in mouth with rising smoke trail
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(242, 243, 26, 6);
        ctx.strokeRect(242, 243, 26, 6);
        ctx.strokeStyle = 'rgba(220,235,245,0.45)';
        ctx.lineWidth = 6;
        ctx.beginPath();
        ctx.moveTo(272, 242);
        ctx.bezierCurveTo(310, 210, 290, 160, 345, 120);
        ctx.stroke();
        ctx.restore();

        ComicArtGenerator.applyComicFinish(ctx, W, H);
    }

    // SCENE 1 & 2: Dark Alley with Rusty Trash Can + Square Iron Tray Ashtray
    static drawScene1_AlleyFar(ctx, W, H, closerZoom = false) {
        ctx.save();
        if (closerZoom) {
            ctx.translate(W / 2, H * 0.62);
            ctx.scale(1.18, 1.18);
            ctx.translate(-W / 2, -H * 0.62);
        }

        // Alley night background
        const bg = ctx.createLinearGradient(0, 0, 0, H);
        bg.addColorStop(0, '#0f1c26');
        bg.addColorStop(0.5, '#1e3342');
        bg.addColorStop(1, '#181c24');
        ctx.fillStyle = bg;
        ctx.fillRect(0, 0, W, H);

        // Left & right grimy alley walls in perspective
        ctx.fillStyle = '#253540';
        ctx.beginPath(); ctx.moveTo(0, 0); ctx.lineTo(220, 220); ctx.lineTo(220, 520); ctx.lineTo(0, 720); ctx.closePath(); ctx.fill();
        ctx.fillStyle = '#2b3d48';
        ctx.beginPath(); ctx.moveTo(W, 0); ctx.lineTo(320, 220); ctx.lineTo(320, 520); ctx.lineTo(W, 720); ctx.closePath(); ctx.fill();

        // Distant neon signs ("ラーメン", "居酒屋")
        ComicArtGenerator.drawNeonSign(ctx, 326, 215, 24, 65, '#d63031', '#ff7675', 'ラーメン', '#fff', true);
        ComicArtGenerator.drawNeonSign(ctx, 290, 315, 70, 24, '#c0392b', '#fab1a0', '居酒屋', '#fff', false);

        // Wet alley ground & neon puddle reflection
        ctx.fillStyle = '#1b222a';
        ctx.fillRect(0, 500, W, H - 500);
        if (!closerZoom) {
            const puddle = ctx.createRadialGradient(310, 910, 8, 310, 910, 65);
            puddle.addColorStop(0, 'rgba(255, 80, 230, 0.75)');
            puddle.addColorStop(1, 'rgba(255, 80, 230, 0)');
            ctx.fillStyle = puddle;
            ctx.fillRect(220, 850, 180, 100);
        }

        // Trash bags on left, parked scooter on right
        ctx.fillStyle = '#1680c2';
        ctx.beginPath(); ctx.arc(115, 535, 38, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#14181c';
        ctx.beginPath(); ctx.arc(145, 585, 45, 0, Math.PI * 2); ctx.fill(); ctx.stroke();

        // CENTER HERO OBJECT: Rusty Cylindrical Metal Trash Barrel + Square Iron Tray on top
        const cx = W / 2, cy = 635;
        // Barrel body
        const barrelGrad = ctx.createLinearGradient(cx - 80, cy, cx + 80, cy);
        barrelGrad.addColorStop(0, '#30383d');
        barrelGrad.addColorStop(0.45, '#595247');
        barrelGrad.addColorStop(0.75, '#6b4c35');
        barrelGrad.addColorStop(1, '#262c30');
        ctx.fillStyle = barrelGrad;
        ctx.strokeStyle = '#090b0d';
        ctx.lineWidth = 3.5;
        ctx.beginPath();
        ctx.roundRect(cx - 72, cy - 55, 144, 175, 14);
        ctx.fill();
        ctx.stroke();

        // Vertical ribs on trash barrel
        for (let rx = cx - 50; rx <= cx + 50; rx += 25) {
            ctx.beginPath(); ctx.moveTo(rx, cy - 35); ctx.lineTo(rx, cy + 110); ctx.stroke();
        }

        // Square Iron Tray Ashtray on top of barrel (perspective diamond/trapezoid)
        ctx.fillStyle = '#636c72';
        ctx.beginPath();
        ctx.moveTo(cx, cy - 102);
        ctx.lineTo(cx + 112, cy - 68);
        ctx.lineTo(cx, cy - 26);
        ctx.lineTo(cx - 112, cy - 68);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Pile of ash & cigarette butts on the iron tray
        ctx.fillStyle = '#2d3134';
        ctx.beginPath(); ctx.ellipse(cx, cy - 66, 52, 20, 0, 0, Math.PI * 2); ctx.fill();
        for (let b = 0; b < 18; b++) {
            const bx = cx - 38 + (b * 19) % 76;
            const by = cy - 76 + (b * 11) % 24;
            ctx.fillStyle = b % 2 === 0 ? '#e67e22' : '#ecf0f1';
            ctx.fillRect(bx, by, 12, 4);
        }

        // Scattered cigarette butts on ground
        for (let g = 0; g < 28; g++) {
            const gx = (g * 73) % (W - 40) + 20;
            const gy = 710 + (g * 43) % 230;
            ctx.fillStyle = '#d35400';
            ctx.fillRect(gx, gy, 10, 4);
            ctx.fillStyle = '#bdc3c7';
            ctx.fillRect(gx + 10, gy, 8, 4);
        }

        ctx.restore();
        ComicArtGenerator.applyComicFinish(ctx, W, H);
    }

    // SCENE 3 & 4: Top-down Close-up of the Square Iron Tray Ashtray (+ Hand picking butt in Scene 4)
    static drawScene3_AshtrayClose(ctx, W, H, withHand = false) {
        // Blurry dark alley floor background
        ctx.fillStyle = '#18222b';
        ctx.fillRect(0, 0, W, H);

        // Barrel lower rim visible under tray
        const barrelGrad = ctx.createLinearGradient(70, 620, 470, 620);
        barrelGrad.addColorStop(0, '#1d2429');
        barrelGrad.addColorStop(0.5, '#4c463d');
        barrelGrad.addColorStop(1, '#191f24');
        ctx.fillStyle = barrelGrad;
        ctx.strokeStyle = '#080a0c';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.arc(W / 2, 650, 225, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Large Tilted Square Rusty Iron Tray
        ctx.save();
        ctx.fillStyle = '#6c767d';
        ctx.strokeStyle = '#0c0e12';
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.moveTo(260, 185);
        ctx.lineTo(535, 345);
        ctx.lineTo(285, 835);
        ctx.lineTo(5, 575);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Rust stains on iron tray
        ctx.fillStyle = 'rgba(138, 66, 36, 0.48)';
        ctx.beginPath(); ctx.arc(280, 740, 65, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(445, 520, 50, 0, Math.PI * 2); ctx.fill();
        ctx.beginPath(); ctx.arc(140, 320, 45, 0, Math.PI * 2); ctx.fill();

        // Central mound of dark gray cigarette ash
        ctx.fillStyle = '#2d3236';
        ctx.beginPath();
        ctx.arc(275, 455, 138, 0, Math.PI * 2);
        ctx.fill();

        // Rusty iron handle in center of tray
        ctx.strokeStyle = '#1a1d20';
        ctx.lineWidth = 18;
        ctx.beginPath();
        ctx.moveTo(225, 365);
        ctx.lineTo(330, 425);
        ctx.stroke();
        ctx.strokeStyle = '#6e5c4f';
        ctx.lineWidth = 10;
        ctx.stroke();

        // Draw 26 detailed comic cigarette butts piled around the tray
        const butts = [
            { x: 145, y: 445, ang: -0.35, len: 58, filter: 24 },
            { x: 185, y: 515, ang: -0.52, len: 52, filter: 22 },
            { x: 285, y: 565, ang: 0.32, len: 48, filter: 24 },
            { x: 350, y: 505, ang: 1.15, len: 62, filter: 25 },
            { x: 382, y: 452, ang: 1.62, len: 56, filter: 24 },
            { x: 432, y: 435, ang: 0.25, len: 64, filter: 24 },
            { x: 255, y: 310, ang: -1.1, len: 55, filter: 22 },
            { x: 325, y: 325, ang: -0.75, len: 60, filter: 24 },
            { x: 165, y: 380, ang: 0.4, len: 50, filter: 22 },
            { x: 285, y: 475, ang: -1.25, len: 64, filter: 28 } // Center featured butt
        ];

        butts.forEach(b => {
            ctx.save();
            ctx.translate(b.x, b.y);
            ctx.rotate(b.ang);
            ctx.strokeStyle = '#0c0e10';
            ctx.lineWidth = 2.5;
            // Orange filter
            ctx.fillStyle = '#d9823b';
            ctx.fillRect(0, -8, b.filter, 16);
            ctx.strokeRect(0, -8, b.filter, 16);
            // White paper
            ctx.fillStyle = '#dfe4e8';
            ctx.fillRect(b.filter, -8, b.len - b.filter, 16);
            ctx.strokeRect(b.filter, -8, b.len - b.filter, 16);
            // Charred tip
            ctx.fillStyle = '#222629';
            ctx.fillRect(b.len - 6, -8, 6, 16);
            ctx.restore();
        });

        // If Scene 4 (withHand = true), draw Ah-Rui's weathered dirty hand pinching the central butt
        if (withHand) {
            ctx.save();
            ctx.fillStyle = '#b58d74';
            ctx.strokeStyle = '#0a0c0e';
            ctx.lineWidth = 4;
            // Hand palm & wrist coming from top-right
            ctx.beginPath();
            ctx.moveTo(540, 175);
            ctx.lineTo(355, 170);
            ctx.lineTo(260, 295);
            ctx.lineTo(285, 445);
            ctx.lineTo(325, 440);
            ctx.lineTo(360, 325);
            ctx.lineTo(335, 445);
            ctx.lineTo(385, 435);
            ctx.lineTo(485, 345);
            ctx.lineTo(540, 340);
            ctx.closePath();
            ctx.fill();
            ctx.stroke();

            // Grime & knuckle shading lines
            ctx.strokeStyle = 'rgba(20, 15, 12, 0.55)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(355, 210); ctx.lineTo(310, 310);
            ctx.moveTo(410, 235); ctx.lineTo(350, 355);
            ctx.stroke();
            ctx.restore();
        }

        ctx.restore();
        ComicArtGenerator.applyComicFinish(ctx, W, H);
    }

    // SCENE 5 & 6: Close-up Side Profile of Ah-Rui Smoking in the Alley
    // (isGlowing = false -> 5.jpg dim ember; isGlowing = true -> 6.jpg bright red-orange ember)
    static drawScene5_SmokingProfile(ctx, W, H, isGlowing = false) {
        // Blurred alley background
        ComicArtGenerator.drawScene1_AlleyFar(ctx, W, H, false);
        ctx.fillStyle = 'rgba(10, 15, 22, 0.32)';
        ctx.fillRect(0, 0, W, H);

        ctx.save();
        ctx.strokeStyle = '#080a0d';
        ctx.lineWidth = 4;

        // Green Parka Collar & Shoulder (Bottom Left)
        ctx.fillStyle = '#3e5237';
        ctx.beginPath();
        ctx.moveTo(0, 620);
        ctx.lineTo(185, 725);
        ctx.lineTo(260, 960);
        ctx.lineTo(0, 960);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Ah-Rui's Face Profile (Left side looking right)
        ctx.fillStyle = isGlowing ? '#dfb092' : '#cfa082';
        ctx.beginPath();
        ctx.moveTo(0, 180);
        ctx.lineTo(185, 200); // Forehead
        ctx.lineTo(192, 295); // Brow bridge
        ctx.lineTo(248, 395); // Nose tip
        ctx.lineTo(205, 428); // Under nose
        ctx.lineTo(212, 472); // Upper lip
        ctx.lineTo(206, 515); // Lower lip
        ctx.lineTo(192, 585); // Chin
        ctx.lineTo(85, 610);  // Jawline
        ctx.lineTo(0, 650);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Deep-set weary eye & heavy dark eyebags
        ctx.fillStyle = '#fff';
        ctx.beginPath(); ctx.ellipse(132, 312, 22, 10, 0.08, 0, Math.PI * 2); ctx.fill(); ctx.stroke();
        ctx.fillStyle = '#1f1612';
        ctx.beginPath(); ctx.arc(140, 312, 8, 0, Math.PI * 2); ctx.fill();
        // Thick eyebrow
        ctx.fillStyle = '#111317';
        ctx.beginPath(); ctx.roundRect(85, 265, 92, 16, 6); ctx.fill();

        // Stubble / Moustache & Chin Beard hatching
        ctx.strokeStyle = 'rgba(20, 22, 25, 0.65)';
        ctx.lineWidth = 1.8;
        for (let s = 0; s < 55; s++) {
            const sx = 125 + (s * 13) % 82;
            const sy = 445 + (s * 19) % 135;
            ctx.beginPath(); ctx.moveTo(sx, sy); ctx.lineTo(sx - 3, sy + 9); ctx.stroke();
        }

        // Long messy black hair strands hanging down side of face
        ctx.fillStyle = '#0e1114';
        ctx.beginPath();
        ctx.moveTo(0, 195);
        ctx.lineTo(105, 205);
        ctx.lineTo(68, 495);
        ctx.lineTo(95, 720);
        ctx.lineTo(0, 740);
        ctx.closePath();
        ctx.fill();

        // Knitted Olive Beanie Hat (Top Left)
        ctx.fillStyle = '#434d46';
        ctx.strokeStyle = '#080a0d';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(0, 12);
        ctx.quadraticCurveTo(185, 55, 235, 215);
        ctx.lineTo(0, 265);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Cigarette Butt held between lips (y ~ 490)
        // Orange filter in mouth
        ctx.fillStyle = '#cf7b34';
        ctx.fillRect(198, 480, 48, 17);
        ctx.strokeRect(198, 480, 48, 17);
        // White cigarette paper
        ctx.fillStyle = '#e8ecef';
        ctx.fillRect(246, 480, 62, 17);
        ctx.strokeRect(246, 480, 62, 17);

        // Ember Tip (Dim ash in 5.jpg vs Intense Glowing Red-Orange Ember in 6.jpg)
        if (isGlowing) {
            ctx.save();
            ctx.shadowColor = '#ff3300';
            ctx.shadowBlur = 28;
            ctx.fillStyle = '#ff4500';
            ctx.beginPath();
            ctx.arc(315, 488, 11, 0, Math.PI * 2);
            ctx.fill();
            ctx.fillStyle = '#ffee88';
            ctx.beginPath();
            ctx.arc(316, 488, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.restore();
        } else {
            ctx.fillStyle = '#2b2f33';
            ctx.beginPath();
            ctx.arc(313, 488, 9, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();
        }

        // Ah-Rui's Weathered Right Hand holding the cigarette
        ctx.fillStyle = isGlowing ? '#d5a386' : '#c4957a';
        ctx.strokeStyle = '#080a0d';
        ctx.lineWidth = 4;
        ctx.beginPath();
        ctx.moveTo(205, 535);
        ctx.lineTo(265, 498);
        ctx.lineTo(345, 520);
        ctx.lineTo(425, 645);
        ctx.lineTo(395, 845);
        ctx.lineTo(275, 845);
        ctx.lineTo(212, 695);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        // Green Parka Sleeve Cuff at bottom right
        ctx.fillStyle = '#3e5237';
        ctx.beginPath();
        ctx.moveTo(245, 835);
        ctx.lineTo(435, 815);
        ctx.lineTo(485, 960);
        ctx.lineTo(255, 960);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();

        ctx.restore();
        ComicArtGenerator.applyComicFinish(ctx, W, H);
    }
}
