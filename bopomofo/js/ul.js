document.addEventListener('DOMContentLoaded', () => {
    const symbols = document.querySelectorAll('.symbol');
    const audioCache = {};

    symbols.forEach((symbol) => {
        symbol.addEventListener('click', () => {
            const audioName = symbol.dataset.audio;

            if (!audioCache[audioName]) {
                audioCache[audioName] = new Howl({
                    src: [`audio/${audioName}.mp3`],
                    html5: true, // 建議用於手機或較大的檔案
                    preload: true,
                    volume: 1,
                    rate: 0.5 // 播放速度設定為 0.5 倍速
                });
            }

            // 停止所有正在播放的音檔，避免重疊
            Howler.stop();

            // 播放選中的音檔
            audioCache[audioName].play();
        });
    });
});
