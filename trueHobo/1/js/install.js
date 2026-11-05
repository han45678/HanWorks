/**
 * 打開時判斷還沒安裝成 App，就直接詢問要不要安裝
 * （PWA；App 名稱、圖示見 manifest.webmanifest，詢問視窗的文字在 index.html 的 #install-dialog）
 *
 *   - Chrome / Edge / Samsung 等（有 beforeinstallprompt 的瀏覽器）：一打開就問，玩家按「安裝」時叫出瀏覽器的安裝視窗。
 *     但 Chrome 要等玩家點過頁面、看了約 30 秒才准網頁叫出安裝視窗（beforeinstallprompt），網頁沒辦法跳過；
 *     還沒到就改教玩家用網址列的安裝圖示 / 選單安裝（這兩個不用等），等 Chrome 准了，視窗會自動換回「安裝」按鈕。
 *     回訪的玩家早就滿 30 秒，按「安裝」會直接跳出安裝視窗。
 *   - iPhone / iPad：iOS 沒有安裝視窗，直接教玩家「分享 → 加入主畫面」
 *   - 不問：從 App 開啟、已經裝過（記在瀏覽器裡；之後 Chrome 又發出 beforeinstallprompt 代表已經移除，會再問）、
 *     LINE / FB / IG / Threads 等 App 內建瀏覽器、Firefox 等不能安裝的瀏覽器
 *   - 正在抽菸（PlayScene）時先不跳，等這局結束；按「以後再說」只關掉這一次，下次打開還會問
 *   - 裝好之後：網頁沒辦法直接打開 App。電腦版 Chrome 通常會自己把遊戲移到 App 視窗；
 *     沒移過去（Android 一定不會）就跳「安裝好了」告訴玩家去哪裡開，Android 另外有「開啟 App」按鈕
 *     （用 intent 網址請 Android 打開剛裝好的 App）
 */
(function () {
    const ASK_DELAY = 800;
    // 同網域的其他遊戲共用 localStorage，名稱前面加資料夾路徑
    const STORE_KEY = `${new URL('./', location.href).pathname}:installed`;

    const dialog = document.getElementById('install-dialog');
    if (!dialog) return;

    const ua = navigator.userAgent;
    const isIOS = /iPhone|iPad|iPod/.test(ua) || (/Macintosh/.test(ua) && navigator.maxTouchPoints > 1);
    const isAndroid = /Android/i.test(ua);
    const isInAppBrowser = /FBAN|FBAV|FB_IAB|Instagram|Line\/|Barcelona|MicroMessenger/i.test(ua);
    const canPrompt = 'BeforeInstallPromptEvent' in window;
    const MANUAL = isAndroid ? 'manual-android' : 'manual-desktop';
    const INSTALLED = isAndroid ? 'installed-android' : 'installed-desktop';

    let installEvent = null;
    let asked = false;   // 這次打開已經問過（按了「以後再說」就不再跳）
    let timer = null;

    function wasInstalled() {
        try { return localStorage.getItem(STORE_KEY) === '1'; } catch (e) { return false; }
    }

    function markInstalled(yes) {
        try {
            if (yes) localStorage.setItem(STORE_KEY, '1');
            else localStorage.removeItem(STORE_KEY);
        } catch (e) { }
    }

    function isPlaying() {
        return typeof phaserGame !== 'undefined' && !!phaserGame && phaserGame.scene.isActive('PlayScene');
    }

    // 現在是不是在 App 視窗裡（從主畫面 / 桌面打開，或電腦版裝好後被移進 App 視窗）
    function inAppWindow() {
        return window.matchMedia('(display-mode: standalone), (display-mode: fullscreen)').matches
            || navigator.standalone === true;
    }

    // 只顯示 data-for 包含這個 mode 的文字和按鈕
    function setMode(mode) {
        dialog.dataset.mode = mode;
        dialog.querySelectorAll('[data-for]').forEach(el => {
            el.hidden = !el.dataset.for.split(' ').includes(mode);
        });
    }

    function ask(mode) {
        if (asked || timer) return;
        const tryShow = () => {
            // 正在抽菸或切到別的分頁就晚點再問，免得擋住手指
            if (isPlaying() || document.hidden) {
                timer = setTimeout(tryShow, 2000);
                return;
            }
            timer = null;
            asked = true;
            show(mode);
        };
        timer = setTimeout(tryShow, ASK_DELAY);
    }

    function show(mode) {
        const icon = dialog.querySelector('.install-icon');
        if (icon && !icon.getAttribute('src')) icon.src = withVersion('./icons/icon-192.png');
        setMode(mode);
        dialog.hidden = false;
    }

    function close() {
        dialog.hidden = true;
    }

    // 從 App 開啟：記下來，之後在同一個瀏覽器的分頁打開也不問
    if (inAppWindow()) {
        markInstalled(true);
        return;
    }
    if (isInAppBrowser) return;

    window.addEventListener('beforeinstallprompt', e => {
        e.preventDefault();   // 不用瀏覽器自己的安裝小提示，改用詢問視窗
        installEvent = e;
        markInstalled(false); // Chrome 准安裝 = 現在沒裝（之前裝過也已經移除）
        // 正在看安裝教學時 Chrome 准了：換回「安裝」按鈕，按一下就能裝
        if (!dialog.hidden && dialog.dataset.mode === MANUAL) setMode('prompt');
        else ask('prompt');
    });

    // 裝好了：等一下看 Chrome 有沒有把遊戲移進 App 視窗，沒有就告訴玩家去哪裡開
    window.addEventListener('appinstalled', () => {
        installEvent = null;
        markInstalled(true);
        close();
        setTimeout(() => {
            if (!inAppWindow()) show(INSTALLED);
        }, 1200);
    });

    dialog.addEventListener('click', e => {
        const btn = e.target.closest('button');
        if (btn && btn.dataset.action === 'open-app') {
            // 請 Android 打開這個網址：裝好的 App 會接手；沒打開的話玩家照著視窗上的說明到主畫面點圖示
            const start = new URL('./', location.href);
            location.href = `intent://${start.host}${start.pathname}#Intent;scheme=https;end`;
        } else if (btn && btn.dataset.action === 'install') {
            if (installEvent) {
                installEvent.prompt();
                installEvent = null;   // 一個 beforeinstallprompt 只能叫一次安裝視窗
                close();
            } else {
                setMode(MANUAL);       // Chrome 還不准叫安裝視窗：改教玩家自己按安裝
            }
        } else if (btn || e.target === dialog) {   // 以後再說、知道了、點視窗外面
            close();
        }
    });

    // 點詢問視窗不要傳到遊戲（Phaser 在 window 上聽放開手指，不擋會順便觸發「點一下開始」等）
    ['mousedown', 'mouseup', 'touchstart', 'touchend', 'pointerdown', 'pointerup', 'click'].forEach(type => {
        dialog.addEventListener(type, e => e.stopPropagation());
    });

    if (isIOS) {
        if (/Safari\//.test(ua)) ask('ios');
    } else if (canPrompt && !wasInstalled()) {
        ask('prompt');
    }
})();
