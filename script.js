document.addEventListener('DOMContentLoaded', () => {
    const langFrom = document.getElementById('langFrom');
    const langTo = document.getElementById('langTo');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    const textStyle = document.getElementById('textStyle');

    // Словари стилизации (EN ↔ RU)
    const styleMaps = {
        en: {
            formal: { hi: 'greetings', hello: 'greetings', thanks: 'thank you', ok: 'acknowledged', wanna: 'wish to', gonna: 'intend to', kids: 'children', guys: 'colleagues', bad: 'unsatisfactory', good: 'satisfactory', help: 'assistance', fix: 'resolve', buy: 'purchase' },
            casual: { hello: 'hey', greetings: 'hi', thank: 'thanks', acknowledged: 'got it', wish: 'wanna', intend: 'gonna', children: 'kids', colleagues: 'guys', unsatisfactory: 'not great', satisfactory: 'pretty good', assistance: 'help', resolve: 'fix', purchase: 'buy' },
            simple: { utilize: 'use', approximately: 'about', commence: 'start', terminate: 'end', obtain: 'get', difficult: 'hard', excellent: 'great', sufficient: 'enough', attempt: 'try' },
            poetic: { very good: 'magnificent', bad: 'shadowed', happy: 'bright-hearted', sad: 'heavy-souled', beautiful: 'radiant', fast: 'swift as wind', slow: 'gentle as stream', big: 'vast', small: 'delicate', think: 'ponder', look: 'gaze', walk: 'wander' }
        },
        ru: {
            formal: { привет: 'здравствуйте', спасибо: 'благодарю вас', ок: 'принято', пока: 'до свидания', ребята: 'коллеги', плохо: 'неудовлетворительно', хорошо: 'надлежащим образом', помощь: 'содействие', купить: 'приобрести', круто: 'превосходно' },
            casual: { здравствуйте: 'привет', благодарю: 'спасибо', принято: 'ок', до свидания: 'пока', коллеги: 'ребята', неудовлетворительно: 'так себе', надлежащим образом: 'норм', содействие: 'помощь', приобрести: 'купить', превосходно: 'круто' },
            simple: { использовать: 'применять', приблизительно: 'примерно', начать: 'начинать', завершить: 'закончить', получить: 'взять', сложный: 'трудный', достаточный: 'хватает', попытка: 'проба' },
            poetic: { очень хорошо: 'великолепно', плохо: 'мрачно', счастлив: 'светел душой', грустно: 'тяжело на сердце', красиво: 'сияюще', быстро: 'словно ветер', медленно: 'тихой водой', большой: 'бескрайний', маленький: 'хрупкий', думаю: 'мечтаю', смотрю: 'любуюсь', иду: 'бреду' }
        }
    };

    function applyTextStyle(text, style, targetLang) {
        if (!text || style === 'original') return text;
        let result = text.trim();
        const langMap = styleMaps[targetLang] || styleMaps.en;
        const map = langMap[style];

        if (map) {
            Object.entries(map).forEach(([from, to]) => {
                const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                const regex = new RegExp(`(^|[\\s,.;:!?(){}\\[\\]])${escaped}($|[\\s,.;:!?(){}\\[\\]])`, 'gi');
                result = result.replace(regex, (match, p1, p2) => `${p1}${to}${p2}`);
            });
        }

        const suffixes = { casual: targetLang === 'en' ? ' 😊' : ' 👌', poetic: targetLang === 'en' ? ' ✨\n' : ' 🌿\n' };
        if (style === 'formal') {
            const prefix = targetLang === 'en' ? 'Please note: ' : 'Просим обратить внимание: ';
            if (!result.match(/^(dear|greetings|уважаемый|благодарю|примите|просим)/i)) {
                result = prefix + result.charAt(0).toUpperCase() + result.slice(1);
            }
        } else if (style === 'casual') {
            result = result.replace(/([.!?])\s*$/, '') + suffixes.casual;
        } else if (style === 'simple') {
            result = result.replace(/([.!?])\s+/g, '$1\n');
        } else if (style === 'poetic') {
            result = result.replace(/([.!?])\s+/g, '$1' + suffixes.poetic);
        }

        return result.charAt(0).toUpperCase() + result.slice(1);
    }

    langFrom.value = 'en';
    langTo.value = 'ru';

    translateBtn.addEventListener('click', async () => {
        const text = inputText.value.trim();
        if (!text) { status.textContent = 'Введите текст'; return; }

        translateBtn.disabled = true;
        translateBtn.textContent = 'Загрузка...';
        status.textContent = '';
        outputText.value = '';

        const from = langFrom.value;
        const to = langTo.value;
        
        // Добавлен параметр &de для увеличения лимита (5000 слов/день)
        const url = `https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=${from}|${to}&mt=1&de=github_user@demo.com`;

        try {
            console.log('🌐 Отправка запроса:', url);
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error(`Сеть: ${res.status} ${res.statusText}`);
            
            const data = await res.json();
            console.log('📦 Ответ API:', data);

            // Устойчивая проверка (число 200 или строка "200")
            if (data.responseStatus == 200 && data.responseData?.translatedText) {
                const translated = data.responseData.translatedText;
                console.log('✅ Перевод получен:', translated);
                
                // Применяем стиль
                outputText.value = applyTextStyle(translated, textStyle.value, to);
                status.textContent = 'Готово';
            } else {
                // Если API вернул ошибку или лимит превышен
                const err = data.responseDetails || 'API вернул пустой ответ или превышен лимит';
                throw new Error(err);
            }
        } catch (err) {
            console.error('❌ Ошибка:', err);
            status.textContent = 'Ошибка API. Попробуйте через 1 минуту или проверьте интернет.';
            outputText.value = '';
        } finally {
            translateBtn.disabled = false;
            translateBtn.textContent = 'Перевести';
        }
    });

    clearBtn.addEventListener('click', () => {
        inputText.value = '';
        outputText.value = '';
        status.textContent = '';
    });
});