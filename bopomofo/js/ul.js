document.addEventListener('DOMContentLoaded', () => {
    const symbols = document.querySelectorAll('#base .symbol');
    const audioCache = {};

    function playAudio(audioName) {
        if (!audioCache[audioName]) {
            audioCache[audioName] = new Howl({
                src: [`audio/${audioName}.mp3`],
                html5: true,
                preload: true,
                volume: 1,
                rate: 0.5
            });
        }
        Howler.stop();
        audioCache[audioName].play();
    }

    symbols.forEach((symbol) => {
        symbol.addEventListener('click', () => {
            const audioName = symbol.dataset.audio;
            playAudio(audioName);
        });
    });

    const rules = {
        ㄅ: {
            jiemu: ['ㄧ', 'ㄨ'],
            yunmu: [
                'ㄚ',
                'ㄛ',
                'ㄜ',
                'ㄝ',
                'ㄞ',
                'ㄠ',
                'ㄡ',
                'ㄢ',
                'ㄣ',
                'ㄤ',
                'ㄥ'
            ]
        },
        ㄆ: {
            jiemu: ['ㄧ', 'ㄨ'],
            yunmu: [
                'ㄚ',
                'ㄛ',
                'ㄜ',
                'ㄞ',
                'ㄟ',
                'ㄠ',
                'ㄡ',
                'ㄢ',
                'ㄣ',
                'ㄤ',
                'ㄥ'
            ]
        },
        ㄇ: {
            jiemu: ['ㄧ', 'ㄨ', 'ㄩ'],
            yunmu: [
                'ㄚ',
                'ㄛ',
                'ㄜ',
                'ㄝ',
                'ㄞ',
                'ㄟ',
                'ㄠ',
                'ㄡ',
                'ㄢ',
                'ㄣ',
                'ㄤ',
                'ㄥ'
            ]
        },
        ㄈ: {
            jiemu: ['ㄨ'],
            yunmu: ['ㄚ', 'ㄛ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄉ: {
            jiemu: ['ㄧ', 'ㄨ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄊ: {
            jiemu: ['ㄧ', 'ㄨ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄋ: {
            jiemu: ['ㄧ', 'ㄨ', 'ㄩ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄌ: {
            jiemu: ['ㄧ', 'ㄨ', 'ㄩ'],
            yunmu: [
                'ㄚ',
                'ㄛ',
                'ㄜ',
                'ㄞ',
                'ㄟ',
                'ㄠ',
                'ㄡ',
                'ㄢ',
                'ㄣ',
                'ㄤ',
                'ㄥ'
            ]
        },
        ㄍ: {
            jiemu: ['ㄨ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄎ: {
            jiemu: ['ㄨ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄏ: {
            jiemu: ['ㄨ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄐ: {
            jiemu: ['ㄧ', 'ㄩ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄑ: {
            jiemu: ['ㄧ', 'ㄩ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄒ: {
            jiemu: ['ㄧ', 'ㄩ'],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄓ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄔ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄕ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄖ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄗ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄘ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        ㄙ: {
            jiemu: [],
            yunmu: ['ㄚ', 'ㄜ', 'ㄞ', 'ㄟ', 'ㄠ', 'ㄡ', 'ㄢ', 'ㄣ', 'ㄤ', 'ㄥ']
        },
        // Add rules for Jiemu/Yunmu combinations if needed
        ㄧ: {
            yunmu: [
                'ㄚ',
                'ㄛ',
                'ㄜ',
                'ㄝ',
                'ㄞ',
                'ㄟ',
                'ㄠ',
                'ㄡ',
                'ㄢ',
                'ㄣ',
                'ㄤ',
                'ㄥ'
            ]
        },
        ㄨ: {
            yunmu: [
                'ㄚ',
                'ㄛ',
                'ㄜ',
                'ㄝ',
                'ㄞ',
                'ㄟ',
                'ㄠ',
                'ㄡ',
                'ㄢ',
                'ㄣ',
                'ㄤ',
                'ㄥ'
            ]
        },
        ㄩ: { yunmu: ['ㄝ', 'ㄢ', 'ㄣ'] }
    };

    const spell = document.querySelectorAll('#spell .symbol');
    const displaySymbols = document.querySelectorAll('.spell_content .symbol_');
    const tones = document.querySelectorAll('.spell_content .tone');

    let currentInput = { shengmu: '', jiemu: '', yunmu: '' };

    // Create and attach a reset button
    const resetButton = document.createElement('button');
    resetButton.textContent = '重設';
    resetButton.style.cssText =
        'margin-top: 20px; padding: 10px 20px; font-size: 16px; cursor: pointer;';
    document.querySelector('#spell .container').appendChild(resetButton);

    resetButton.addEventListener('click', resetInput);

    function resetInput() {
        currentInput = { shengmu: '', jiemu: '', yunmu: '' };
        displaySymbols.forEach((el) => (el.textContent = ''));
        updateSpellSymbols(true);
    }

    // A helper function to manage the display and audio
    function processSymbolClick(sym) {
        const type = sym.dataset.type;
        const char = sym.dataset.audio;

        playAudio(char);

        if (type === 'shengmu') {
            currentInput = { shengmu: char, jiemu: '', yunmu: '' };
            displaySymbols[0].textContent = char;
            displaySymbols[1].textContent = '';
            displaySymbols[2].textContent = '';
        } else if (type === 'jiemu' && currentInput.jiemu === '') {
            currentInput.jiemu = char;
            displaySymbols[1].textContent = char;
        } else if (type === 'yunmu' && currentInput.yunmu === '') {
            currentInput.yunmu = char;
            // The display order is: shengmu, jiemu, yunmu
            if (currentInput.jiemu === '') {
                // If no jiemu, place yunmu in the second slot
                displaySymbols[1].textContent = char;
            } else {
                // Otherwise, place yunmu in the third slot
                displaySymbols[2].textContent = char;
            }
        }
        updateSpellSymbols();
    }

    // Main function to update the disabled state
    function updateSpellSymbols(reset = false) {
        const shengmuSelected = currentInput.shengmu !== '';
        const jiemuSelected = currentInput.jiemu !== '';

        spell.forEach((s) => {
            const sType = s.dataset.type;
            const sChar = s.dataset.audio;

            if (reset) {
                s.classList.remove('disabled');
            } else {
                if (sType === 'shengmu' && shengmuSelected) {
                    s.classList.add('disabled');
                } else if (sType === 'jiemu') {
                    if (shengmuSelected) {
                        const allowedJiemu = rules[currentInput.shengmu].jiemu;
                        s.classList.toggle(
                            'disabled',
                            !allowedJiemu.includes(sChar)
                        );
                    } else if (jiemuSelected) {
                        s.classList.add('disabled');
                    }
                } else if (sType === 'yunmu') {
                    if (shengmuSelected && rules[currentInput.shengmu]) {
                        const allowedYunmu = rules[currentInput.shengmu].yunmu;
                        s.classList.toggle(
                            'disabled',
                            !allowedYunmu.includes(sChar)
                        );
                    } else if (jiemuSelected && rules[currentInput.jiemu]) {
                        const allowedYunmu = rules[currentInput.jiemu].yunmu;
                        s.classList.toggle(
                            'disabled',
                            !allowedYunmu.includes(sChar)
                        );
                    } else if (currentInput.yunmu !== '') {
                        s.classList.add('disabled');
                    }
                }
            }
        });

        // Tones are special. Only enable them after a full combination (shengmu + jiemu + yunmu or just yunmu)
        const hasFullCombination =
            (shengmuSelected && currentInput.yunmu !== '') ||
            (!shengmuSelected && currentInput.yunmu !== '');

        tones.forEach((tone) => {
            tone.classList.toggle('disabled', !hasFullCombination);
        });
    }

    spell.forEach((sym) => {
        sym.addEventListener('click', () => processSymbolClick(sym));
    });

    updateSpellSymbols();
});
