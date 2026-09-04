(function() {
    setTimeout(() => {
        const container = $('#tab_troops');
        if (container.length) {
            container.html(`
                <h3>Панель управления войсками</h3>
                <p>Здесь будет парсер и таблица ваших войск со всех деревень.</p>
                <button id="parse_troops_btn" class="btn">Собрать данные</button>
            `);

            $('#parse_troops_btn').on('click', () => {
                UI.InfoMessage('Сбор данных войск запущен...');
            });
        }
    }, 500);
})();
