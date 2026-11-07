/**
 * ============================================================================
 * 1. CONTINUOUS ROCK & STREET AMBIENT SOUND ENGINE + TAIWANESE HOKKIEN VOICE
 * ============================================================================
 * Ensures music starts on the Cover Screen and NEVER stops or resets when
 * transitioning into the story and gameplay. Also handles authentic Taiwanese
 * Hokkien (台語) burn voice exclamations + sizzle/inhale sound effects.
 */
class StreetAudioEngine {
    constructor() {
        this.ctx = null;
        this.isPlayingBGM = false;
        // 封面影片自帶點菸聲 + 搖滾樂，封面期間先讓合成搖滾停下，離開封面再接手
        this.duckBGM = false;
        this.bgmStep = 0;
        this.bgmTimer = null;
        this.inhaleNode = null;
        this.inhaleGain = null;
        this.rainGain = null;

        // Taiwanese Hokkien Burn Lines (台式閩南語燙傷語音台詞)
        // audio：真人配音檔（放在 audio/ 資料夾，念的內容要跟 text 一樣；text 是畫面上的字幕）；
        // 有任何一個音檔載得到，就只從有音檔的台詞裡挑；全部沒有才用瀏覽器男聲念 tts（華語諧音），pitch 壓低讓聲音粗一點
        this.taiwaneseBurnLines = [
            { text: "幹！燙著恁爸", tts: "幹！燙著恁爸", pitch: 0, rate: 1, audio: './audio/audio01.mp3' },
            { text: "啊！幹", tts: "啊！幹", pitch: 0, rate: 1, audio: './audio/audio02.mp3' },
            { text: "阿娘喂！", tts: "阿娘喂！", pitch: 0, rate: 1., audio: './audio/audio03.mp3' },
            { text: "唉！機掰", tts: "唉！機掰", pitch: 0, rate: 1, audio: './audio/audio04.mp3' },
            { text: "哭爸！燙啦", tts: "哭爸！燙啦", pitch: 0, rate: 1, audio: './audio/audio05.mp3' },
            { text: "哭爸", tts: "哭爸", pitch: 0, rate: 1, audio: './audio/audio06.mp3' },
            { text: "幹", tts: "幹", pitch: 0, rate: 1, audio: './audio/audio07.mp3' },
            { text: "恁老師咧", tts: "恁老師咧", pitch: 0, rate: 1, audio: './audio/audio08.mp3' },
            { text: "燙", tts: "燙", pitch: 0, rate: 1, audio: './audio/audio09.mp3' }
        ];
        // 洗牌袋：還沒抽到的台詞（見 drawBurnLine）
        this.burnBag = [];
        this.lastBurnLine = null;
    }

    // 台詞用「洗牌袋」抽：整副洗亂後依序抽，抽完才重洗，每一輪每句剛好出現一次，
    // 重洗時也避開上一句，不會連續兩次同一句。
    //（每次各自亂數雖然長期平均，但短時間內常常同一句連出好幾次，玩起來會像只有固定那幾句）
    drawBurnLine(pool) {
        while (this.burnBag.length) {
            const line = this.burnBag.pop();
            if (pool.includes(line)) return (this.lastBurnLine = line);
        }
        const bag = pool.slice();
        for (let i = bag.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [bag[i], bag[j]] = [bag[j], bag[i]];
        }
        // 下一句從陣列尾端抽，若剛好跟上一句一樣就跟開頭對調
        if (bag.length > 1 && bag[bag.length - 1] === this.lastBurnLine) {
            [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
        }
        this.burnBag = bag;
        return (this.lastBurnLine = this.burnBag.pop());
    }

    init() {
        if (!this.ctx) {
            const AudioCtx = window.AudioContext || window.webkitAudioContext;
            this.ctx = new AudioCtx();
            // 配音檔要有 AudioContext 才能解碼
            VoiceClips.decodeAll();
            // 先叫一次讓 Chrome 開始載入語音清單（第一次常回空陣列，第一次燙嘴就挑不到男聲）
            if ('speechSynthesis' in window) window.speechSynthesis.getVoices();
        }
        if (this.ctx && this.ctx.state === 'suspended') {
            this.ctx.resume();
        }
    }

    // 燙嘴台詞的瀏覽器語音：男聲由低沉到一般排序，Apple 的 Rocko → Grandpa → Reed → Eddy（Mac、iPhone），
    // 微軟的 YunJhe、Zhiwei（Windows）；都沒有才退回其他台灣中文語音（多半是女聲，例如 Chrome 的 Google 國語、Mac 的美佳）
    pickBurnVoice() {
        const voices = window.speechSynthesis.getVoices();
        const twVoices = voices.filter(v => /^zh[-_]TW$/i.test(v.lang));
        for (const name of ['Rocko', 'Grandpa', 'Reed', 'Eddy', 'YunJhe', 'Zhiwei']) {
            const male = twVoices.find(v => v.name.includes(name));
            if (male) return male;
        }
        return voices.find(v => v.lang.includes('TW') || v.name.includes('Taiwan') || v.name.includes('Meijia') || v.name.includes('Hsiao')) || null;
    }

    startContinuousBGM() {
        this.init();
        if (this.isPlayingBGM) return;
        this.isPlayingBGM = true;

        // Start continuous subtle night street rain / neon hum ambience
        this.startRainAmbience();

        // Grunge / Taiwanese Street Rock Guitar & Bass Riff Sequencer (matches the cover video's gritty rock riff)
        // Riff pattern in E minor pentatonic (E2, G2, A2, Bb2, A2, G2, E2)
        const riffNotes = [
            { freq: 82.41, dur: 0.22, accent: true },   // E2
            { freq: 82.41, dur: 0.18, accent: false },  // E2
            { freq: 98.00, dur: 0.24, accent: true },   // G2
            { freq: 110.00, dur: 0.24, accent: true },  // A2
            { freq: 116.54, dur: 0.20, accent: true },  // Bb2 (blues gritty flat 5)
            { freq: 110.00, dur: 0.22, accent: false }, // A2
            { freq: 98.00, dur: 0.24, accent: true },   // G2
            { freq: 82.41, dur: 0.32, accent: true },   // E2
            { freq: 82.41, dur: 0.18, accent: false },  // E2
            { freq: 110.00, dur: 0.24, accent: true },  // A2
            { freq: 123.47, dur: 0.25, accent: true },  // B2
            { freq: 116.54, dur: 0.20, accent: true },  // Bb2
            { freq: 110.00, dur: 0.22, accent: false }, // A2
            { freq: 98.00, dur: 0.22, accent: true },   // G2
            { freq: 73.42, dur: 0.25, accent: true },   // D2
            { freq: 82.41, dur: 0.35, accent: true }    // E2
        ];

        const stepIntervalMs = 240; // 125 BPM eighth-note rock groove
        this.bgmTimer = setInterval(() => {
            if (!this.ctx || this.duckBGM) return;
            const masterVol = 0.18;

            const step = riffNotes[this.bgmStep % riffNotes.length];
            this.playGrungeGuitarNote(step.freq, step.dur, step.accent, masterVol);
            if (this.bgmStep % 2 === 0) {
                this.playDrumKickOrSnare((this.bgmStep % 4 === 2) ? 'snare' : 'kick', masterVol * 1.1);
            }
            this.bgmStep++;
        }, stepIntervalMs);
    }

    startRainAmbience() {
        if (!this.ctx) return;
        try {
            const bufferSize = this.ctx.sampleRate * 2;
            const noiseBuffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
            const output = noiseBuffer.getChannelData(0);
            for (let i = 0; i < bufferSize; i++) {
                output[i] = Math.random() * 2 - 1;
            }
            const whiteNoise = this.ctx.createBufferSource();
            whiteNoise.buffer = noiseBuffer;
            whiteNoise.loop = true;

            const filter = this.ctx.createBiquadFilter();
            filter.type = 'bandpass';
            filter.frequency.value = 950;
            filter.Q.value = 0.7;

            this.rainGain = this.ctx.createGain();
            this.rainGain.gain.value = 0.025;

            whiteNoise.connect(filter);
            filter.connect(this.rainGain);
            this.rainGain.connect(this.ctx.destination);
            whiteNoise.start(0);
        } catch (e) { }
    }

    playGrungeGuitarNote(freq, duration, accent, maxGain = 0.18) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;

        // Root + Fifth power chord oscillators
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        osc1.type = 'sawtooth';
        osc2.type = 'square';
        osc1.frequency.setValueAtTime(freq, now);
        osc2.frequency.setValueAtTime(freq * 1.498, now); // Power fifth

        // Overdrive waveshaper
        const shaper = this.ctx.createWaveShaper();
        const curve = new Float32Array(256);
        for (let i = 0; i < 256; i++) {
            const x = (i * 2) / 256 - 1;
            curve[i] = Math.tanh(x * (accent ? 6.5 : 4.0));
        }
        shaper.curve = curve;

        // Cabinet lowpass filter
        const cabFilter = this.ctx.createBiquadFilter();
        cabFilter.type = 'lowpass';
        cabFilter.frequency.setValueAtTime(accent ? 1850 : 1300, now);

        const gain = this.ctx.createGain();
        const peak = accent ? maxGain : maxGain * 0.7;
        gain.gain.setValueAtTime(0.001, now);
        gain.gain.linearRampToValueAtTime(peak, now + 0.015);
        gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

        osc1.connect(shaper);
        osc2.connect(shaper);
        shaper.connect(cabFilter);
        cabFilter.connect(gain);
        gain.connect(this.ctx.destination);

        osc1.start(now);
        osc2.start(now);
        osc1.stop(now + duration + 0.02);
        osc2.stop(now + duration + 0.02);
    }

    playDrumKickOrSnare(type, vol = 0.18) {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        if (type === 'kick') {
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.frequency.setValueAtTime(120, now);
            osc.frequency.exponentialRampToValueAtTime(36, now + 0.12);
            gain.gain.setValueAtTime(vol, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.15);
            osc.connect(gain);
            gain.connect(this.ctx.destination);
            osc.start(now);
            osc.stop(now + 0.16);
        } else {
            // Snare burst
            const bufSize = this.ctx.sampleRate * 0.1;
            const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
            const data = buf.getChannelData(0);
            for (let i = 0; i < bufSize; i++) data[i] = (Math.random() * 2 - 1) * Math.exp(-i / (bufSize * 0.4));
            const src = this.ctx.createBufferSource();
            src.buffer = buf;
            const filter = this.ctx.createBiquadFilter();
            filter.type = 'highpass';
            filter.frequency.value = 400;
            const gain = this.ctx.createGain();
            gain.gain.setValueAtTime(vol * 0.65, now);
            gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
            src.connect(filter);
            filter.connect(gain);
            gain.connect(this.ctx.destination);
            src.start(now);
        }
    }

    // Lighter flint strike sound ("chk-chk-fwoosh")
    playLighterFlick() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const bufSize = this.ctx.sampleRate * 0.35;
        const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
        const data = buf.getChannelData(0);
        for (let i = 0; i < bufSize; i++) {
            const env = i < bufSize * 0.15 ? 1.0 : Math.exp(-(i - bufSize * 0.15) / (bufSize * 0.3));
            data[i] = (Math.random() * 2 - 1) * env;
        }
        const src = this.ctx.createBufferSource();
        src.buffer = buf;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(3200, now);
        filter.frequency.exponentialRampToValueAtTime(800, now + 0.32);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.35);

        src.connect(filter);
        filter.connect(gain);
        gain.connect(this.ctx.destination);
        src.start(now);
    }

    // Continuous tobacco crackling sound while holding/inhaling
    setInhaleSound(isInhaling, heatRatio = 0.5) {
        this.init();
        if (!this.ctx) return;
        if (isInhaling) {
            if (!this.inhaleNode) {
                const bufSize = this.ctx.sampleRate * 1.5;
                const buf = this.ctx.createBuffer(1, bufSize, this.ctx.sampleRate);
                const data = buf.getChannelData(0);
                for (let i = 0; i < bufSize; i++) {
                    // Crackling tobacco pop texture
                    const crackle = Math.random() > 0.96 ? (Math.random() * 2 - 1) * 2.5 : (Math.random() * 2 - 1) * 0.35;
                    data[i] = crackle;
                }
                this.inhaleNode = this.ctx.createBufferSource();
                this.inhaleNode.buffer = buf;
                this.inhaleNode.loop = true;

                this.inhaleFilter = this.ctx.createBiquadFilter();
                this.inhaleFilter.type = 'bandpass';
                this.inhaleFilter.frequency.value = 1200;

                this.inhaleGain = this.ctx.createGain();
                this.inhaleGain.gain.value = 0.08;

                this.inhaleNode.connect(this.inhaleFilter);
                this.inhaleFilter.connect(this.inhaleGain);
                this.inhaleGain.connect(this.ctx.destination);
                this.inhaleNode.start(0);
            }
            const targetFreq = 900 + heatRatio * 1800;
            this.inhaleFilter.frequency.setTargetAtTime(targetFreq, this.ctx.currentTime, 0.05);
            this.inhaleGain.gain.setTargetAtTime(0.08 + heatRatio * 0.14, this.ctx.currentTime, 0.05);
        } else if (this.inhaleGain) {
            this.inhaleGain.gain.setTargetAtTime(0.0001, this.ctx.currentTime, 0.06);
        }
    }

    // Trigger Taiwanese Hokkien Burn Voice + Sizzle Sound!
    playTaiwaneseBurnVoice() {
        this.init();
        // 有真人配音就只挑有音檔的台詞，免得一下真人一下機器聲
        const recorded = this.taiwaneseBurnLines.filter(l => l.audio && VoiceClips.has(l.audio));
        const pool = recorded.length ? recorded : this.taiwaneseBurnLines;
        const line = this.drawBurnLine(pool);
        const playedClip = !!line.audio && VoiceClips.play(line.audio);

        if (this.ctx) {
            const now = this.ctx.currentTime;
            // 1. Hot skin sizzle sound ("Tssss!")
            const sizzleBuf = this.ctx.createBuffer(1, this.ctx.sampleRate * 0.4, this.ctx.sampleRate);
            const ch = sizzleBuf.getChannelData(0);
            for (let i = 0; i < ch.length; i++) ch[i] = (Math.random() * 2 - 1) * Math.exp(-i / (ch.length * 0.35));
            const sizzleSrc = this.ctx.createBufferSource();
            sizzleSrc.buffer = sizzleBuf;
            const sizzleFilter = this.ctx.createBiquadFilter();
            sizzleFilter.type = 'highpass';
            sizzleFilter.frequency.value = 2800;
            const sizzleGain = this.ctx.createGain();
            sizzleGain.gain.setValueAtTime(0.45, now);
            sizzleGain.gain.exponentialRampToValueAtTime(0.01, now + 0.38);
            sizzleSrc.connect(sizzleFilter);
            sizzleFilter.connect(sizzleGain);
            sizzleGain.connect(this.ctx.destination);
            sizzleSrc.start(now);

            // 2. Synthesized vocal pain grunt/cry fallback ("Ah-niang-wei! Sio-lah!")（有真人配音就不用）
            if (!playedClip) {
                const vOsc = this.ctx.createOscillator();
                const vGain = this.ctx.createGain();
                vOsc.type = 'sawtooth';
                // Taiwanese exclamation pitch contour
                vOsc.frequency.setValueAtTime(290, now + 0.05);
                vOsc.frequency.linearRampToValueAtTime(420, now + 0.18); // "啊娘~"
                vOsc.frequency.linearRampToValueAtTime(240, now + 0.34); // "喂~"
                vOsc.frequency.setValueAtTime(380, now + 0.38);          // "燒(Sio)!"
                vOsc.frequency.exponentialRampToValueAtTime(170, now + 0.68); // "啦!"

                const formant = this.ctx.createBiquadFilter();
                formant.type = 'bandpass';
                formant.frequency.setValueAtTime(850, now);
                formant.Q.value = 3.5;

                vGain.gain.setValueAtTime(0.001, now);
                vGain.gain.linearRampToValueAtTime(0.28, now + 0.06);
                vGain.gain.exponentialRampToValueAtTime(0.001, now + 0.7);

                vOsc.connect(formant);
                formant.connect(vGain);
                vGain.connect(this.ctx.destination);
                vOsc.start(now + 0.05);
                vOsc.stop(now + 0.72);
            }
        }

        // 3. Web Speech API with Taiwanese Mandarin/Hokkien phonetic inflection（沒有真人配音時才念）
        if (!playedClip && 'speechSynthesis' in window) {
            try {
                window.speechSynthesis.cancel();
                const utter = new SpeechSynthesisUtterance(line.tts);
                utter.lang = 'zh-TW';
                utter.pitch = line.pitch;
                utter.rate = line.rate;
                utter.volume = 1.0;
                const voice = this.pickBurnVoice();
                if (voice) utter.voice = voice;
                window.speechSynthesis.speak(utter);
            } catch (e) { }
        }

        return line.text;
    }

    playCoughWarning() {
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.exponentialRampToValueAtTime(95, now + 0.18);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.21);
    }
}

const audioEngine = new StreetAudioEngine();

// 雙擊開檔（file://）時瀏覽器不准 WebGL 讀本機的圖檔和影片，改用 Canvas 繪圖 + <img> 載入（上線後照常用 WebGL）
const IS_LOCAL_FILE = location.protocol === 'file:';

/**
 * 封面影片 video/video.mp4（點菸 + 搖滾樂）：自己建 <video> 再交給 Phaser 當貼圖，
 * 播放、切場景都由這裡控制。
 */
const CoverVideo = {
    el: null,

    load() {
        if (this.el) return;
        const v = document.createElement('video');
        v.loop = true;
        v.playsInline = true;
        v.setAttribute('playsinline', '');
        v.preload = 'auto';
        // 找不到或格式不支援：當作沒有影片，封面改用原圖
        v.addEventListener('error', () => { if (this.el === v) this.el = null; });
        v.src = withVersion('./video/video.mp4');
        this.el = v;
        // 先靜音播著，讓手機先把影片載下來（iOS 不播放就不會下載）；有聲播放留給玩家點「開始」的當下
        v.muted = true;
        v.play().catch(() => { });
    },

    // 從頭有聲播放；必須在玩家點擊的當下呼叫才能有聲音（被瀏覽器擋下時改成靜音播放）
    // （不要用「音量 0 試播」偵測能否有聲自動播放：Chrome 把音量 0 當成靜音，會誤判成允許）
    start() {
        const v = this.el;
        if (!v) return false;
        v.currentTime = 0;
        v.volume = 1;
        v.muted = false;
        v.play().catch(() => {
            v.muted = true;
            v.play().catch(() => { });
        });
        return true;
    },

    stop() {
        if (this.el) this.el.pause();
    }
};

/**
 * 燙嘴台詞的真人配音（audio/ 資料夾裡的 audioXX.mp3，見 taiwaneseBurnLines 的 audio）：放了就播，沒放就退回瀏覽器語音。
 * 上線時下載後交給 Web Audio 播（燙嘴發生在遊戲中途，不是點擊當下，手機上 <audio> 會被擋）；
 * 雙擊開檔（file://）讀不到檔案內容，改用 <audio> 播。
 */
const VoiceClips = {
    clips: {},

    load(srcs) {
        srcs.forEach(src => {
            if (this.clips[src]) return;
            const clip = this.clips[src] = { ready: false };
            if (IS_LOCAL_FILE) {
                const a = new Audio();
                a.preload = 'auto';
                a.addEventListener('canplaythrough', () => { clip.ready = true; }, { once: true });
                a.src = withVersion(src);
                clip.el = a;
            } else {
                // 沒放檔案會 404：當作沒有配音（網址帶版本號，改版後一定抓新檔；clips 仍用原本的路徑當 key）
                fetch(withVersion(src))
                    .then(r => r.ok ? r.arrayBuffer() : Promise.reject(r.status))
                    .then(data => { clip.data = data; this.decode(clip); })
                    .catch(() => { });
            }
        });
    },

    // AudioContext 要等玩家點「開始」才建立，下載先完成的等建好再解碼
    decode(clip) {
        const ctx = audioEngine.ctx;
        if (!ctx || !clip.data) return;
        const data = clip.data;
        clip.data = null;
        ctx.decodeAudioData(data, buf => { clip.buffer = buf; clip.ready = true; }, () => { });
    },

    decodeAll() {
        Object.values(this.clips).forEach(clip => this.decode(clip));
    },

    has(src) {
        return !!(this.clips[src] && this.clips[src].ready);
    },

    play(src) {
        const clip = this.clips[src];
        if (!clip || !clip.ready) return false;
        if (clip.el) {
            clip.el.currentTime = 0;
            clip.el.play().catch(() => { });
        } else {
            const node = audioEngine.ctx.createBufferSource();
            node.buffer = clip.buffer;
            node.connect(audioEngine.ctx.destination);
            node.start();
        }
        return true;
    }
};
