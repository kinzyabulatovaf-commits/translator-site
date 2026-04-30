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
});