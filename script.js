document.addEventListener('DOMContentLoaded', () => {
    const notebook = document.getElementById('notebook');
    const counter = document.getElementById('counter');
    const MAX_ID_LENGTH = 14;

    updateCounter();

    // Функция обновления счетчика
    function updateCounter() {
        const count = notebook.value.split('\n').filter(line => line.trim()).length;
        counter.textContent = `ID в списке: ${count}`;
    }

    // Обработка ввода
    notebook.addEventListener('input', (e) => {
        let lines = notebook.value.split('\n')
            .map(line => line.trim())
            .filter(line => {
                return /^\d+$/.test(line) && line.length <= MAX_ID_LENGTH;
            });
        
        lines = [...new Set(lines)];
        
        // Если последняя строка пустая, добавляем перенос
        if (notebook.value.endsWith('\n')) {
            lines.push('');
        }
        
        notebook.value = lines.join('\n');
        
        // Отправляем обновленный список ID на сервер
        fetch('/api/ids', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                ids: lines.filter(line => line.trim())
            })
        });

        updateCounter();
    });

    // Загружаем сохраненные ID при запуске
    fetch('/api/ids')
        .then(response => response.json())
        .then(data => {
            if (data.ids && Array.isArray(data.ids)) {
                notebook.value = data.ids.join('\n');
                updateCounter();
            }
        })
        .catch(console.error);
});
