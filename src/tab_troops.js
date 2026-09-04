// src/tab_troops.js

// Функция возвращает разметку первой вкладки («Таблица войск»)
function getTroopsTabHTML() {
    return `
        <!-- Панель инструментов первой вкладки -->
        <div class="ra-toolbar" style="margin-bottom: 10px; padding: 5px; background: #e8d0ab; border: 1px solid #7d510f; display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: bold;">Управление войсками</span>
            <button id="ra_load_troops_btn" class="btn" style="cursor: pointer; padding: 3px 10px; font-size: 11px;">Собрать данные</button>
        </div>

        <!-- Контейнер таблицы с прокруткой -->
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #7d510f;">
            <table class="vis" id="troops_table" width="100%" style="border-collapse: collapse; background: #f4e4bc;">
                <thead>
                    <tr style="background-color: #c1a264; color: #fff;">
                        <th style="width: 30px; text-align: center;"><input type="checkbox" id="select_all_rows_chk"></th>
                        <th>Деревня</th>
                        <th>Координаты</th>
                        <th>Копья</th>
                        <th>Мечи</th>
                        <th>Топоры</th>
                        <th>Развед</th>
                        <th>ЛК</th>
                        <th>ТК</th>
                        <th>Катапульты</th>
                        <th>Дворяне</th>
                    </tr>
                </thead>
                <tbody id="troops_table_body">
                    <tr>
                        <td colspan="11" style="text-align: center; padding: 15px; color: #555;">
                            Данные войск пока не загружены.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Клик по кнопке сбора войск (теперь правильно — вне функции шаблона)
$(document).on('click', '#ra_load_troops_btn', function() {
    loadTroopsData();
});

// Обработчик чекбокса "Выбрать все" для этой вкладки
$(document).on('change', '#select_all_rows_chk', function() {
    let isChecked = $(this).is(':checked');
    $('.row-select-chk').prop('checked', isChecked);
});

// Функция сбора данных о войсках со страницы игры
function loadTroopsData() {
    let $tbody = $('#troops_table_body');
    $tbody.empty(); // Очищаем таблицу перед загрузкой

    let rowsCount = 0;

    // Ищем строки с деревнями на стандартных страницах обзора войск в ТW
    $('#units_table tr.row_marker, #combined_table tr.row_marker, tr[id^="village_"]').each(function() {
        let $row = $(this);
        
        let villageNameFull = $row.find('.quickedit-label, .nowrap:first').text().trim();
        let coordsMatch = villageNameFull.match(/\(\d+\|\d+\)/);
        let coords = coordsMatch ? coordsMatch[0] : '—';
        let villageName = villageNameFull.replace(coords, '').trim();

        if (!coords || coords === '—') return; 

        let spearmen = $row.find('td:nth-child(4)').text().trim() || '0';
        let swordsmen = $row.find('td:nth-child(5)').text().trim() || '0';
        let axemen = $row.find('td:nth-child(6)').text().trim() || '0';
        let scouts = $row.find('td:nth-child(7)').text().trim() || '0';
        let lightCav = $row.find('td:nth-child(8)').text().trim() || '0';
        let heavyCav = $row.find('td:nth-child(9)').text().trim() || '0';
        let catapults = $row.find('td:nth-child(10)').text().trim() || '0';
        let snobs = $row.find('td:nth-child(11)').text().trim() || '0';

        let trHTML = `
            <tr>
                <td style="text-align: center;"><input type="checkbox" class="row-select-chk" value="${coords}"></td>
                <td>${villageName}</td>
                <td><b>${coords}</b></td>
                <td style="text-align: center;">${spearmen}</td>
                <td style="text-align: center;">${swordsmen}</td>
                <td style="text-align: center;">${axemen}</td>
                <td style="text-align: center;">${scouts}</td>
                <td style="text-align: center;">${lightCav}</td>
                <td style="text-align: center;">${heavyCav}</td>
                <td style="text-align: center;">${catapults}</td>
                <td style="text-align: center; font-weight: bold; color: #8b0000;">${snobs}</td>
            </tr>
        `;

        $tbody.append(trHTML);
        rowsCount++;
    });

    if (rowsCount === 0) {
        $tbody.html(`
            <tr>
                <td colspan="11" style="text-align: center; padding: 15px; color: #b22222;">
                    Не удалось найти данные войск на этой странице. Перейдите на вкладку обзора войск («Обзор -> Войска») и нажмите кнопку обновить.
                </td>
            </tr>
        `);
    }
}
