// src/tab_troops.js

// Функция возвращает полную разметку первой вкладки по образцу
function getTroopsTabHTML() {
    return `
        <!-- Панель управления (как на фото) -->
        <div class="ra-toolbar" style="margin-bottom: 8px; padding: 6px; background: #e8d0ab; border: 1px solid #7d510f; display: flex; justify-content: space-between; align-items: center; font-size: 11px;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <label><input type="checkbox" id="select_all_rows_chk"> Мир с луками</label>
                <span id="troops_count_label" style="font-weight: bold; color: #5a2f0c;">Записей: 0 из 0</span>
            </div>
            <div style="display: flex; gap: 5px;">
                <button class="btn" style="cursor: pointer; padding: 2px 6px;">Снять со страницы</button>
                <button class="btn" id="ra_load_troops_btn" style="cursor: pointer; padding: 2px 6px; font-weight: bold;">Собрать данные</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px;">Войска племени</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #f0e6cc;">Демо</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #f2dede; color: #a94442;" id="ra_clear_troops_btn">Очистить</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #dff0d8; font-weight: bold;">Сохранить выбранное ▼</button>
            </div>
        </div>

        <!-- Контейнер таблицы с колонками как на фото и фильтрами -->
        <div style="max-height: 400px; overflow-y: auto; border: 1px solid #7d510f;">
            <table class="vis" id="troops_table" width="100%" style="border-collapse: collapse; background: #f4e4bc; font-size: 11px;">
                <thead>
                    <tr style="background-color: #c1a264; color: #fff; text-align: center;">
                        <th style="width: 25px;"><input type="checkbox" disabled></th>
                        <th>Ник игрока <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th>Координаты <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Копьеносцы"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_spear.png" alt="spear"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Мечники"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_sword.png" alt="sword"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Топорники"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_axe.png" alt="axe"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Разведчики"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_spy.png" alt="spy"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Лёгкая кавалерия"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_light.png" alt="light"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Тяжёлая кавалерия"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_heavy.png" alt="heavy"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Тараны"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_ram.png" alt="ram"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Катапульты"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_catapult.png" alt="catapult"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Паладин"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_knight.png" alt="knight"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Дворяне"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_snob.png" alt="snob"> <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th>Тип <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th style="width: 25px;"><input type="checkbox" disabled></th>
                    </tr>
                </thead>
                <tbody id="troops_table_body">
                    <tr>
                        <td colspan="15" style="text-align: center; padding: 15px; color: #555;">
                            Данные войск пока не загружены. Нажмите «Собрать данные».
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    `;
}

// Обработчик глобального чекбокса "Выбрать все"
$(document).on('change', '#select_all_rows_chk', function() {
    let isChecked = $(this).is(':checked');
    $('.row-select-chk').prop('checked', isChecked);
});

// Кнопка очистки таблицы
$(document).on('click', '#ra_clear_troops_btn', function() {
    $('#troops_table_body').html(`
        <tr>
            <td colspan="15" style="text-align: center; padding: 15px; color: #555;">
                Данные очищены.
            </td>
        </tr>
    `);
    $('#troops_count_label').text('Записей: 0 из 0');
});

// Клик по кнопке сбора войск
$(document).on('click', '#ra_load_troops_btn', function() {
    loadTroopsData();
});

// Функция сбора данных о войсках со страницы игры
function loadTroopsData() {
    let $tbody = $('#troops_table_body');
    $tbody.empty();

    let rowsCount = 0;

    // Сканируем строки на странице обзора войск ТW
    $('#units_table tr.row_marker, #combined_table tr.row_marker, tr[id^="village_"]').each(function() {
        let $row = $(this);
        
        // Извлекаем ник игрока (если есть в колонке) и координаты
        let playerName = $row.find('.player-link, .tooltip').text().trim() || 'Обезбашка';
        let villageNameFull = $row.find('.quickedit-label, .nowrap:first').text().trim();
        let coordsMatch = villageNameFull.match(/\(\d+\|\d+\)/);
        let coords = coordsMatch ? coordsMatch[0] : '—';

        if (!coords || coords === '—') return;

        // Собираем юнитов по колонкам (с 4 по 13)
        let spear = $row.find('td:nth-child(4)').text().trim() || '0';
        let sword = $row.find('td:nth-child(5)').text().trim() || '0';
        let axe = $row.find('td:nth-child(6)').text().trim() || '0';
        let spy = $row.find('td:nth-child(7)').text().trim() || '0';
        let light = $row.find('td:nth-child(8)').text().trim() || '0';
        let heavy = $row.find('td:nth-child(9)').text().trim() || '0';
        let ram = $row.find('td:nth-child(10)').text().trim() || '0';
        let catapult = $row.find('td:nth-child(11)').text().trim() || '0';
        let knight = $row.find('td:nth-child(12)').text().trim() || '0';
        let snob = $row.find('td:nth-child(13)').text().trim() || '0';

        // Автоматическое определение офф/дефф (простая логика для примера)
        let totalAxes = parseInt(axe) || 0;
        let totalLight = parseInt(light) || 0;
        let troopType = (totalAxes > 100 || totalLight > 50) ? 'офф' : 'дефф';
        let typeColor = troopType === 'офф' ? '#b22222' : '#00008b';

        let trHTML = `
            <tr>
                <td style="text-align: center;"><input type="checkbox" class="row-select-chk" value="${coords}"></td>
                <td>${playerName}</td>
                <td><a href="#" style="color: #0000ee; text-decoration: none;"><b>${coords}</b></a></td>
                <td style="text-align: center;">${spear}</td>
                <td style="text-align: center;">${sword}</td>
                <td style="text-align: center;">${axe}</td>
                <td style="text-align: center;">${spy}</td>
                <td style="text-align: center;">${light}</td>
                <td style="text-align: center;">${heavy}</td>
                <td style="text-align: center;">${ram}</td>
                <td style="text-align: center;">${catapult}</td>
                <td style="text-align: center;">${knight}</td>
                <td style="text-align: center; font-weight: bold; color: #8b0000;">${snob}</td>
                <td style="text-align: center; font-weight: bold; color: ${typeColor};">${troopType}</td>
                <td style="text-align: center;"><input type="checkbox" class="row-select-chk" value="${coords}"></td>
            </tr>
        `;

        $tbody.append(trHTML);
        rowsCount++;
    });

    $('#troops_count_label').text(`Записей: ${rowsCount} из ${rowsCount}`);

    if (rowsCount === 0) {
        $tbody.html(`
            <tr>
                <td colspan="15" style="text-align: center; padding: 15px; color: #b22222;">
                    Данные войск не найдены на этой странице. Перейдите в «Обзор -> Войска» и повторите сбор.
                </td>
            </tr>
        `);
    }
}
