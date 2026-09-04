// src/tab_troops.js

function getTroopsTabHTML() {
    return `
        <!-- Панель управления -->
        <div class="ra-toolbar" style="margin-bottom: 8px; padding: 6px; background: #e8d0ab; border: 1px solid #7d510f; display: flex; justify-content: space-between; align-items: center; font-size: 11px; position: relative;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <label><input type="checkbox" id="select_all_rows_chk" checked> Мир с луками</label>
                <span id="troops_count_label" style="font-weight: bold; color: #5a2f0c;">Записей: 0 из 0</span>
            </div>
            <div style="display: flex; gap: 5px; align-items: center;">
                <button class="btn" id="ra_fetch_page_troops_btn" style="cursor: pointer; padding: 2px 6px; font-weight: bold; background: #fff2cc;">Снять со страницы</button>
                <button class="btn" id="ra_load_troops_btn" style="cursor: pointer; padding: 2px 6px; font-weight: bold;">Собрать данные</button>
                <button class="btn" id="ra_tribe_troops_btn" style="cursor: pointer; padding: 2px 6px;">Войска племени</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #f0e6cc;">Демо</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #f2dede; color: #a94442;" id="ra_clear_troops_btn">Очистить</button>
                
                <div style="position: relative; display: inline-block;">
                    <button class="btn" id="ra_save_dropdown_btn" style="cursor: pointer; padding: 2px 8px; background: #dff0d8; font-weight: bold;">Сохранить выбранное ▼</button>
                    <div id="ra_save_menu" style="display: none; position: absolute; right: 0; top: 105%; background: #fff5d9; border: 1px solid #7d510f; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 1000; width: 160px; font-size: 11px;">
                        <div class="save-category-option" data-cat="off" style="padding: 6px 10px; cursor: pointer; border-bottom: 1px solid #e0cea6;">📁 В категорию: Офф</div>
                        <div class="save-category-option" data-cat="deff" style="padding: 6px 10px; cursor: pointer; border-bottom: 1px solid #e0cea6;">📁 В категорию: Дефф</div>
                        <div class="save-category-option" data-cat="scouts" style="padding: 6px 10px; cursor: pointer;">📁 В категорию: Разведка</div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Контейнер таблицы -->
        <div style="flex: 1; overflow: auto; border: 1px solid #7d510f;">
            <table class="vis" id="troops_table" width="100%" style="border-collapse: collapse; background: #f4e4bc; font-size: 11px; table-layout: fixed;">
                <thead>
                    <tr style="background-color: #c1a264; color: #fff; text-align: center; height: 26px;">
                        <th style="width: 25px;"><input type="checkbox" id="th_chk_all" checked></th>
                        <th style="width: 110px; text-align: left; padding-left: 4px;" class="ra-th-filter" data-col="player">Ник игрока <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th style="width: 85px;" class="ra-th-filter" data-col="coords">Координаты <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Копья" data-col="spear"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_spear.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Мечи" data-col="sword"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_sword.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Топоры" data-col="axe"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_axe.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Развед" data-col="spy"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_spy.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="ЛК" data-col="light"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_light.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="ТК" data-col="heavy"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_heavy.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Тараны" data-col="ram"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_ram.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Катапульты" data-col="catapult"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_catapult.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Паладин" data-col="knight"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_knight.png"></th>
                        <th style="width: 38px;" class="ra-th-filter" title="Дворяне" data-col="snob"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_snob.png"></th>
                        <th style="width: 65px;" class="ra-th-filter" data-col="type">Тип <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th style="width: 25px;"><input type="checkbox" disabled></th>
                    </tr>
                </thead>
                <tbody id="troops_table_body">
                    <tr>
                        <td colspan="15" style="text-align: center; padding: 15px; color: #555;">
                            Данные войск пока не загружены. Нажмите «Снять со страницы».
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>

        <!-- Меню фильтра -->
        <div id="ra_column_filter_menu" style="display: none; position: absolute; background: #fff5d9; border: 1px solid #7d510f; box-shadow: 0 4px 8px rgba(0,0,0,0.2); z-index: 2000; padding: 6px; font-size: 11px; width: 140px;">
            <div style="font-weight: bold; border-bottom: 1px solid #e0cea6; padding-bottom: 3px; margin-bottom: 4px;">Фильтр/Сортировка</div>
            <div class="ra-filter-action" data-action="asc" style="padding: 4px; cursor: pointer;">Сортировка: А ➔ Я</div>
            <div class="ra-filter-action" data-action="desc" style="padding: 4px; cursor: pointer; border-bottom: 1px solid #e0cea6;">Сортировка: Я ➔ А</div>
            <div class="ra-filter-action" data-action="clear" style="padding: 4px; cursor: pointer; color: #b22222;">Сбросить фильтр</div>
        </div>
    `;
}

// Управление выпадающим меню сохранения
$(document).on('click', '#ra_save_dropdown_btn', function(e) {
    e.stopPropagation();
    $('#ra_save_menu').toggle();
    $('#ra_column_filter_menu').hide();
});

let activeFilterColumn = null;
$(document).on('click', '.ra-th-filter', function(e) {
    e.stopPropagation();
    activeFilterColumn = $(this).data('col');
    let offset = $(this).offset();
    let parentOffset = $('#ra_workbench_window').offset();
    
    $('#ra_save_menu').hide();
    $('#ra_column_filter_menu').css({
        top: (offset.top - parentOffset.top + $(this).outerHeight()) + 'px',
        left: (offset.left - parentOffset.left) + 'px'
    }).toggle();
});

$(document).on('click', function() {
    $('#ra_save_menu').hide();
    $('#ra_column_filter_menu').hide();
});

$(document).on('change', '#select_all_rows_chk, #th_chk_all', function() {
    let isChecked = $(this).is(':checked');
    $('.row-select-chk').prop('checked', isChecked);
    $('#select_all_rows_chk, #th_chk_all').prop('checked', isChecked);
});

$(document:not('#ra_clear_troops_btn')).on('click', '#ra_clear_troops_btn', function() {
    $('#troops_table_body').html(`
        <tr>
            <td colspan="15" style="text-align: center; padding: 15px; color: #555;">
                Данные очищены.
            </td>
        </tr>
    `);
    $('#troops_count_label').text('Записей: 0 из 0');
});

// Прямой сбор данных без всплывающего диалогового окна
$(document).on('click', '#ra_fetch_page_troops_btn, #ra_load_troops_btn', function() {
    let url = window.game_data.link_base_pure + "overview_villages&mode=units";
    let playerName = window.game_data.player.name;

    UI.SuccessMessage('Загрузка войск в таблицу...');

    $.ajax(url, {
        success: function(body) {
            let doc = new DOMParser().parseFromString(body, "text/html");
            let container = doc.querySelector('table#units_table');
            if (!container) {
                UI.ErrorMessage('Не удалось найти таблицу войск на странице обзора!');
                return;
            }

            let rows = container.querySelectorAll('tbody');
            let $tbody = $('#troops_table_body');
            $tbody.empty();
            let rowsCount = 0;

            rows.forEach(function(row) {
                let spanNode = row.querySelector('a span[data-text]');
                if (!spanNode) return;
                
                let match = spanNode.textContent.match(/\(([0-9]{3}\|[0-9]{3})\)/);
                let coords = match ? match[1] : '—';
                if (coords === '—') return;

                let trs = row.querySelectorAll('tr');
                let available_tds = trs[0].querySelectorAll('td.unit-item');
                let outward_tds = trs[2] ? trs[2].querySelectorAll('td.unit-item') : [];
                let transit_tds = trs[3] ? trs[3].querySelectorAll('td.unit-item') : [];

                let uVals = [];
                available_tds.forEach(function(td, i) {
                    let av = parseInt(td.textContent) || 0;
                    let out = outward_tds[i] ? (parseInt(outward_tds[i].textContent) || 0) : 0;
                    let trn = transit_tds[i] ? (parseInt(transit_tds[i].textContent) || 0) : 0;
                    uVals.push(av + out + trn);
                });

                let units = [];
                for (let i = 0; i < 10; i++) {
                    units.push(uVals[i] !== undefined ? uVals[i] : 0);
                }

                let totalAxes = units[2] || 0;
                let totalLight = units[4] || 0;
                let defaultType = (totalAxes > 100 || totalLight > 50) ? 'офф' : 'дефф';

                let trHTML = `
                    <tr style="height: 24px;">
                        <td style="text-align: center;"><input type="checkbox" class="row-select-chk" value="${coords}" checked></td>
                        <td style="overflow: hidden; text-overflow: ellipsis; white-space: nowrap; padding-left: 4px;">${playerName}</td>
                        <td style="text-align: center;"><a href="#" style="color: #0000ee; text-decoration: none;"><b>${coords}</b></a></td>
                        <td style="text-align: center;">${units[0]}</td>
                        <td style="text-align: center;">${units[1]}</td>
                        <td style="text-align: center;">${units[2]}</td>
                        <td style="text-align: center;">${units[3]}</td>
                        <td style="text-align: center;">${units[4]}</td>
                        <td style="text-align: center;">${units[5]}</td>
                        <td style="text-align: center;">${units[6]}</td>
                        <td style="text-align: center;">${units[7]}</td>
                        <td style="text-align: center;">${units[8]}</td>
                        <td style="text-align: center; font-weight: bold; color: #8b0000;">${units[9]}</td>
                        <td style="text-align: center;">
                            <select class="ra-troop-type-select" style="font-size: 10px; padding: 1px; background: #fff5d9; border: 1px solid #7d510f;">
                                <option value="офф" ${defaultType === 'офф' ? 'selected' : ''}>офф</option>
                                <option value="дефф" ${defaultType === 'дефф' ? 'selected' : ''}>дефф</option>
                                <option value="развед" ${defaultType === 'развед' ? 'selected' : ''}>развед</option>
                            </select>
                        </td>
                        <td style="text-align: center;"><input type="checkbox" class="row-select-chk" value="${coords}" checked></td>
                    </tr>
                `;

                $tbody.append(trHTML);
                rowsCount++;
            });

            $('#troops_count_label').text(`Записей: ${rowsCount} из ${rowsCount}`);
            UI.SuccessMessage(`Загружено записей: ${rowsCount}`);
        },
        error: function() {
            UI.ErrorMessage('Ошибка при загрузке страницы войск!');
        }
    });
});

// Сохранение категорий
$(document).on('click', '.save-category-option', function() {
    let category = $(this).data('cat');
    let selectedCoords = [];
    
    $('.row-select-chk:checked').each(function() {
        let val = $(this).val();
        if (val && !selectedCoords.includes(val)) {
            selectedCoords.push(val);
        }
    });

    if (selectedCoords.length === 0) {
        UI.ErrorMessage('Не выбрана ни одна деревня!');
        return;
    }

    localStorage.setItem(`tw_workbench_${category}`, JSON.stringify(selectedCoords));
    UI.SuccessMessage(`Сохранено ${selectedCoords.length} деревень в категорию: ${category}`);
    $('#ra_save_menu').hide();
});
