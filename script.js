document.addEventListener('DOMContentLoaded', function() {
    const langFrom = document.getElementById('langFrom');
    const langTo = document.getElementById('langTo');
    const inputText = document.getElementById('inputText');
    const outputText = document.getElementById('outputText');
    const translateBtn = document.getElementById('translateBtn');
    const clearBtn = document.getElementById('clearBtn');
    const status = document.getElementById('status');
    const textStyle = document.getElementById('textStyle');

    if (!langFrom || !inputText) {
        console.error('Элементы не найдены');
        return;
    }

    const styleMaps = {
        en: {
            formal: {
                'hi': 'greetings',
                'hello': 'greetings',
                'thanks': 'thank you',
                'ok': 'acknowledged',
                'wanna': 'wish to',
                'gonna': 'intend to',
                'kids': 'children',
                'guys': 'colleagues',
                'bad': 'unsatisfactory',
                'good': 'satisfactory',
                'help': 'assistance',
                'fix': 'resolve',
                'buy': 'purchase'
            },
            casual: {
                'hello': 'hey',
                'greetings': 'hi',
                'thank': 'thanks',
                'acknowledged': 'got it',
                'wish': 'wanna',
                'intend': 'gonna',
                'children': 'kids',
                'colleagues': 'guys',
                'unsatisfactory': 'not great',
                'satisfactory': 'pretty good',
                'assistance': 'help',
                'resolve': 'fix',
                'purchase': 'buy'
            },
            simple: {
                'utilize': 'use',
                'approximately': 'about',
                'commence': 'start',
                'terminate': 'end',
                'obtain': 'get',
                'difficult': 'hard',
                'excellent': 'great',
                'sufficient': 'enough',
                'attempt': 'try'
            },
            poetic: {
                'very good': 'magnificent',
                'bad': 'shadowed',
                'happy': 'bright-hearted',
                'sad': 'heavy-souled',
                'beautiful': 'radiant',
                'fast': 'swift as wind',
                'slow': 'gentle as stream',
                'big': 'vast',
                'small': 'delicate',
                'think': 'ponder',
                'look': 'gaze',
                'walk': 'wander'
            }
        },
        ru: {
            formal: {
                'привет': 'здравствуйте',
                'спасибо': 'благодарю вас',
                'ок': 'принято',
                'пока': 'до свидания',
                'ребята': 'коллеги',
                'плохо': 'неудовлетворительно',
                'хорошо': 'надлежащим образом',
                'помощь': 'содействие',
                'купить': 'приобрести',
                'круто': 'превосходно'
            },
            casual: {
                'здравствуйте': 'привет',
                'благодарю': 'спасибо',
                'принято': 'ок',
                'до свидания': 'пока',
                'коллеги': 'ребята',
                'неудовлетворительно': 'так себе',
                'надлежащим образом': 'норм',
                'содействие': 'помощь',
                'приобрести': 'купить',
                'превосходно': 'круто'
            },
            simple: {
                'использовать': 'применять',
                'приблизительно': 'примерно',
                'начать': 'начинать',
                'завершить': 'закончить',
                'получить': 'взять',
                'сложный': 'трудный',
                'достаточный': 'хватает',
                'попытка': 'проба'
            },
            poetic: {
                'очень хорошо': 'великолепно',
                'плохо': 'мрачно',
                'счастлив': 'светел душой',
                'грустно': 'тяжело на сердце',
                'красиво': 'сияюще',
                'быстро': 'словно ветер',
                'медленно': 'тихой водой',
                'большой': 'бескрайний',
                'маленький': 'хрупкий',
                'думаю': 'мечтаю',
                'смотрю': 'любуюсь',
                'иду': 'бреду'
            }
        }
    };

    function applyTextStyle(text, style, targetLang) {
        if (!text || style === 'original') return text;
        let result = text.trim();
        const langMap = styleMaps[targetLang] || styleMaps.en;
        const map = langMap[style];

        if (map) {
            for (const key in map) {
                if (map.hasOwnProperty(key)) {
                    const from = key;
                    const to = map[key];
                    const escaped = from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const regex = new RegExp('(^|[\\s,.;:!?(){}\\[\\]])' + escaped + '($|[\\s,.;:!?(){}\\[\\]])', 'gi');
                    result = result.replace(regex, '$1' + to + '$2');
                }
            }
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

    console.log('Скрипт загружен');

    translateBtn.addEventListener('click', async function() {
        const text = inputText.value.trim();
        if (!text) { status.textContent = 'Введите текст'; return; }

        translateBtn.disabled = true;
        translateBtn.textContent = 'Загрузка...';
        status.textContent = '';
        outputText.value = '';

        const from = langFrom.value;
        const to = langTo.value;
        const url = 'https://api.mymemory.translated.net/get?q=' + encodeURIComponent(text) + '&langpair=' + from + '|' + to + '&mt=1';

        try {
            const res = await fetch(url, { cache: 'no-store' });
            if (!res.ok) throw new Error('HTTP ' + res.status);

            const data = await res.json();

            if (data.responseStatus == 200 && data.responseData && data.responseData.translatedText) {
                const translated = data.responseData.translatedText;
                await new Promise(function(r) { setTimeout(r, 300); });
                outputText.value = applyTextStyle(translated, textStyle.value, to);
                status.textContent = 'Готово';
            } else {
                throw new Error(data.responseDetails || 'Пустой ответ');
            }
        } catch (err) {
            console.error('Ошибка:', err);
            status.textContent = 'Ошибка сети или API';
        } finally {
            translateBtn.disabled = false;
            translateBtn.textContent = 'Перевести';
        }
    });

    clearBtn.addEventListener('click', function() {
        inputText.value = '';
        outputText.value = '';
        status.textContent = '';
    });
});