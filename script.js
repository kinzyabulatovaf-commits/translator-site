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
    // === 🎨 ПАНЕЛЬ СТИЛИЗАЦИИ ===
const outputText = document.getElementById('outputText');
const stylePanel = document.querySelector('.style-panel');

// Обработчик кнопок стилей
stylePanel?.addEventListener('click', (e) => {
    if (e.target.tagName === 'BUTTON') {
        const style = e.target.dataset.style;
        // Переключение активного состояния
        document.querySelectorAll('.style-panel button').forEach(btn => btn.classList.remove('active'));
        e.target.classList.toggle('active');
        
        // Применение стилей
        const classMap = {
            'bold': 'output-bold',
            'italic': 'output-italic', 
            'underline': 'output-underline',
            'colorful': 'output-colorful',
            'neon': 'output-neon',
            'typewriter': 'output-typewriter'
        };
        
        Object.values(classMap).forEach(cls => outputText.classList.remove(cls));
        if (classMap[style] && e.target.classList.contains('active')) {
            outputText.classList.add(classMap[style]);
        }
    }
});

// Шрифт
document.getElementById('fontFamily')?.addEventListener('change', (e) => {
    outputText.style.fontFamily = e.target.value;
});

// Цвет текста
document.getElementById('textColor')?.addEventListener('input', (e) => {
    outputText.style.color = e.target.value;
    // Отключаем эффекты, конфликтующие с цветом
    if (['colorful', 'neon'].some(s => document.querySelector(`[data-style="${s}"]`)?.classList.contains('active'))) {
        document.querySelectorAll('.style-panel button').forEach(btn => btn.classList.remove('active'));
        outputText.classList.remove('output-colorful', 'output-neon');
    }
});

// Кнопка "Копировать со стилем" (опционально)
const copyBtn = document.createElement('button');
copyBtn.textContent = '📋 Копировать';
copyBtn.style.cssText = 'margin-top:0.5rem;padding:0.6rem 1.2rem;background:#28a745;color:#fff;border:none;border-radius:6px;cursor:pointer';
copyBtn.addEventListener('click', () => {
    outputText.select();
    document.execCommand('copy');
    status.textContent = '✅ Скопировано!';
    setTimeout(() => status.textContent = '', 2000);
});
document.querySelector('.buttons')?.after(copyBtn);
});