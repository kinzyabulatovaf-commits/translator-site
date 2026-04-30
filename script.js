document.addEventListener('DOMContentLoaded', () => {
    const langFrom = document.getElementById('langFrom');
    const langTo = document.getElementById('langTo');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    const textStyle = document.getElementById('textStyle');

    const languages = [
        { code: 'auto', name: 'Автоопределение' },
        { code: 'en', name: 'English' },
        { code: 'ru', name: 'Русский' },
        { code: 'de', name: 'Deutsch' },
        { code: 'fr', name: 'Français' },
        { code: 'es', name: 'Español' },
        { code: 'it', name: 'Italiano' },
        { code: 'uk', name: 'Українська' },
        { code: 'zh', name: '中文' },
        { code: 'ja', name: '日本語' }
    ];

    languages.forEach(lang => {
        const optFrom = document.createElement('option');
        optFrom.value = lang.code;
        optFrom.textContent = lang.name;
        langFrom.appendChild(optFrom);

        if (lang.code !== 'auto') {
            const optTo = document.createElement('option');
            optTo.value = lang.code;
            optTo.textContent = lang.name;
            langTo.appendChild(optTo);
        }
    });
    langTo.value = 'ru';

    // === 🎭 ФУНКЦИЯ СТИЛИЗАЦИИ ===
    function applyTextStyle(text, style) {
        if (!text || style === 'original') return text;
        let result = text.trim();

        const maps = {
            formal: {
                'hi': 'greetings', 'hello': 'greetings', 'hey': 'greetings',
                'thanks': 'thank you', 'ok': 'acknowledged', 'okay': 'acknowledged',
                'wanna': 'wish to', 'gonna': 'intend to', 'kids': 'children',
                'guys': 'colleagues', 'bad': 'unsatisfactory', 'good': 'satisfactory',
                'help': 'assistance', 'fix': 'resolve', 'buy': 'purchase'
            },
            casual: {
                'hello': 'hey', 'greetings': 'hi', 'thank you': 'thanks',
                'acknowledged': 'got it', 'wish to': 'wanna', 'intend to': 'gonna',
                'children': 'kids', 'colleagues': 'guys', 'unsatisfactory': 'not great',
                'satisfactory': 'pretty good', 'assistance': 'help', 'resolve': 'fix',
                'purchase': 'buy'
            },
            simple: {
                'utilize': 'use', 'approximately': 'about', 'commence': 'start',
                'terminate': 'end', 'obtain': 'get', 'difficult': 'hard',
                'excellent': 'great', 'sufficient': 'enough', 'attempt': 'try'
            },
            poetic: {
                'very good': 'magnificent', 'bad': 'shadowed', 'happy': 'bright-hearted',
                'sad': 'heavy-souled', 'beautiful': 'radiant', 'fast': 'swift as wind',
                'slow': 'gentle as stream', 'big': 'vast', 'small': 'delicate',
                'think': 'ponder', 'look': 'gaze', 'walk': 'wander'
            }
        };

        if (maps[style]) {
            Object.entries(maps[style]).forEach(([from, to]) => {
                const regex = new RegExp(`\\b${from}\\b`, 'gi');
                result = result.replace(regex, to);
            });
        }

        if (style === 'formal' && !result.match(/^(dear|greetings|respectfully|please)/i)) {
            result = 'Please find the following: ' + result.charAt(0).toUpperCase() + result.slice(1);
        } else if (style === 'casual') {
            result = result.replace(/([.!?])\s*$/, '') + ' 😊';
        } else if (style === 'simple') {
            result = result.replace(/([.!?])\s+/g, '$1\n');
        } else if (style === 'poetic') {
            result = result.replace(/([.!?])\s+/g, '$1 ✨\n');
        }

        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    // === 🔄 КНОПКА ПЕРЕВОДА ===
    translateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) { status.textContent = '⚠️ Введите текст'; return; }

        translateBtn.disabled = true;
        status.textContent = '⏳ Перевод и стилизация...';

        const from = langFrom.value;
        const to = langTo.value;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Ошибка сети');
            const data = await res.json();

            if (data.responseStatus === 200) {
                const translated = data.responseData.translatedText;
                outputText.value = applyTextStyle(translated, textStyle.value);
                status.textContent = '✅ Готово!';
            } else {
                throw new Error(data.responseDetails || 'Ошибка API');
            }
        } catch (err) {
            console.error(err);
            status.textContent = `❌ Ошибка: ${err.message}`;
            outputText.value = '';
        } finally {
            translateBtn.disabled = false;
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        status.textContent = '';
    });
});