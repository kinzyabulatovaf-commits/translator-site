document.addEventListener('DOMContentLoaded', () => {
    const langFrom = document.getElementById('langFrom');
    const langTo = document.getElementById('langTo');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');

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

    // Заполняем селекты
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
    langTo.value = 'ru'; // По умолчанию переводим на русский

    translateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) {
            status.textContent = '⚠️ Введите текст для перевода';
            return;
        }

        translateBtn.disabled = true;
        status.textContent = '⏳ Перевод...';

        const from = langFrom.value;
        const to = langTo.value;
        // Используем бесплатный MyMemory API
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}`;

        try {
            const res = await fetch(url);
            if (!res.ok) throw new Error('Ошибка сети');
            const data = await res.json();

            if (data.responseStatus === 200) {
                outputText.value = data.responseData.translatedText;
                status.textContent = '✅ Перевод выполнен';
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
  // === 🎭 ФИЛЬТР СТИЛЕЙ ТЕКСТА ===
function applyTextStyle(text, style) {
    if (!text || style === 'original') return text;

    let result = text.trim();

    // 🔹 Официальный
    if (style === 'formal') {
        const map = {
            'hi': 'greetings', 'hello': 'greetings', 'hey': 'greetings',
            'thanks': 'thank you', 'thanks a lot': 'thank you very much',
            'ok': 'acknowledged', 'okay': 'acknowledged',
            'wanna': 'wish to', 'gonna': 'intend to',
            'kids': 'children', 'guys': 'colleagues',
            'bad': 'unsatisfactory', 'good': 'satisfactory',
            'help': 'assistance', 'fix': 'resolve', 'buy': 'purchase'
        };
        Object.entries(map).forEach(([from, to]) => {
            const regex = new RegExp(`\\b${from}\\b`, 'gi');
            result = result.replace(regex, to);
        });
        if (!result.match(/^(dear|greetings|respectfully|please)/i)) {
            result = 'Please find the following: ' + result.charAt(0).toUpperCase() + result.slice(1);
        }
    }
    // 🔹 Разговорный
    else if (style === 'casual') {
        const map = {
            'hello': 'hey', 'greetings': 'hi', 'thank you': 'thanks',
            'acknowledged': 'got it', 'wish to': 'wanna', 'intend to': 'gonna',
            'children': 'kids', 'colleagues': 'guys',
            'unsatisfactory': 'not great', 'satisfactory': 'pretty good',
            'assistance': 'help', 'resolve': 'fix', 'purchase': 'buy'
        };
        Object.entries(map).forEach(([from, to]) => {
            const regex = new RegExp(`\\b${from}\\b`, 'gi');
            result = result.replace(regex, to);
        });
        result = result.replace(/([.!?])\s*$/, '') + ' 😊';
    }
    // 🔹 Простой
    else if (style === 'simple') {
        const map = {
            'utilize': 'use', 'approximately': 'about', 'commence': 'start',
            'terminate': 'end', 'obtain': 'get', 'difficult': 'hard',
            'excellent': 'great', 'sufficient': 'enough', 'attempt': 'try'
        };
        Object.entries(map).forEach(([from, to]) => {
            const regex = new RegExp(`\\b${from}\\b`, 'gi');
            result = result.replace(regex, to);
        });
        result = result.replace(/([.!?])\s+/g, '$1\n');
    }
    // 🔹 Поэтичный
    else if (style === 'poetic') {
        const map = {
            'very good': 'magnificent', 'bad': 'shadowed', 'happy': 'bright-hearted',
            'sad': 'heavy-souled', 'beautiful': 'radiant', 'fast': 'swift as wind',
            'slow': 'gentle as stream', 'big': 'vast', 'small': 'delicate',
            'think': 'ponder', 'look': 'gaze', 'walk': 'wander'
        };
        Object.entries(map).forEach(([from, to]) => {
            const regex = new RegExp(`\\b${from}\\b`, 'gi');
            result = result.replace(regex, to);
        });
        result = result.replace(/([.!?])\s+/g, '$1 ✨\n');
    }

    // Сохраняем регистр первой буквы
    return result.charAt(0).toUpperCase() + result.slice(1);
}

// Интегрируем фильтр в кнопку перевода
const originalTranslateBtnHandler = translateBtn.onclick;
translateBtn.onclick = async () => {
    const style = document.getElementById('textStyle').value;
    const rawText = inputText.value.trim();
    if (!rawText) return;

    translateBtn.disabled = true;
    status.textContent = '⏳ Перевод и стилизация...';

    try {
        const from = langFrom.value === 'auto' ? 'auto|en' : langFrom.value;
        const to = langTo.value;
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(rawText)}&langpair=${from}|${to}`;
        const res = await fetch(url);
        const data = await res.json();

        if (data.responseStatus === 200) {
            const translated = data.responseData.translatedText;
            outputText.value = applyTextStyle(translated, style);
            status.textContent = '✅ Готово!';
        } else {
            status.textContent = '❌ Ошибка API';
        }
    } catch (err) {
        status.textContent = `❌ Ошибка: ${err.message}`;
    } finally {
        translateBtn.disabled = false;
    }
};
});