// ==UserScript==
// @name         TW Workbench
// @namespace    http://tampermonkey.net/
// @version      1.0.0
// @description  Модульный воркбенч для TW
// @author       Обезбашка
// @match        https://*.plemiona.pl/*
// @match        https://*.voyna-plemen.ru/*
// @match        https://*.tribalwars.net/*
// @grant        none
// ==/UserScript==

/* --- Core Module --- */
// src/core.js
(function() {
    'use strict';

    if ($('#ra_workbench_window').length > 0) {
        $('#ra_workbench_window').toggle();
        return;
    }

    const styles = `
       #ra_workbench_window {
            position: fixed; top: 100px; left: 100px; width: 900px; height: 550px;
            background: #f4e4bc; border: 2px solid #722205; z-index: 99999;
            box-shadow: 0 5px 15px rgba(0,0,0,0.5); font-family: Verdana, Arial, sans-serif;
            display: flex; flex-direction: column;
        }
        #ra_workbench_header {
            background: #722205; color: #fff; padding: 8px; font-weight: bold;
            cursor: move; display: flex; justify-content: space-between; align-items: center;
        }
        #ra_workbench_header .close-btn { cursor: pointer; font-weight: bold; padding: 0 5px; }
        #ra_workbench_tabs {
            display: flex; background: #e0cea6; border-bottom: 1px solid #722205;
        }
        .ra-tab-btn {
            padding: 8px 12px; cursor: pointer; border-right: 1px solid #c1b18c; font-size: 11px; font-weight: bold; color: #5a2f0c;
        }
        .ra-tab-btn.active { background: #f4e4bc; border-bottom: 2px solid #f4e4bc; }
        .ra-tab-content {
            flex: 1; padding: 10px; display: none; overflow-y: auto; background: #fff5d9;
        }
        .ra-tab-content.active { display: block; }
    `;

    const template = `
        <div id="ra_workbench_window">
            <div id="ra_workbench_header">
                <span>TW Workbench [GitHub Modular]</span>
                <span class="close-btn" id="ra_close_btn">X</span>
            </div>
            <div id="ra_workbench_tabs">
                <div class="ra-tab-btn active" data-target="tab_troops">Войска</div>
                <div class="ra-tab-btn" data-target="tab_planner">Планировщик</div>
            </div>
            <div id="ra_workbench_body">
                <div id="tab_troops" class="ra-tab-content active"></div>
                <div id="tab_planner" class="ra-tab-content"></div>
            </div>
        </div>
    `;

    $('head').append(`<style>${styles}</style>`);
    $('body').append(template);

    // Заполняем первую вкладку разметкой из tab_troops.js
    $('#tab_troops').html(getTroopsTabHTML());

    $('#ra_close_btn').on('click', () => $('#ra_workbench_window').remove());

    $('.ra-tab-btn').on('click', function() {
        $('.ra-tab-btn').removeClass('active');
        $('.ra-tab-content').removeClass('active');
        $(this).addClass('active');
        $(`#${$(this).data('target')}`).addClass('active');
    });

    const header = document.getElementById('ra_workbench_header');
    const win = document.getElementById('ra_workbench_window');
    let isDragging = false, startX, startY;

    header.addEventListener('mousedown', (e) => {
        isDragging = true;
        startX = e.clientX - win.offsetLeft;
        startY = e.clientY - win.offsetTop;
        e.preventDefault();
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        win.style.left = `${e.clientX - startX}px`;
        win.style.top = `${e.clientY - startY}px`;
    });

    document.addEventListener('mouseup', () => { isDragging = false; });
})();


/* --- Troops Tab Module --- */
// src/tab_troops.js

// Функция возвращает разметку первой вкладки
function getTroopsTabHTML() {
    return `
        <!-- Панель управления с кнопкой сохранения и выпадающим списком -->
        <div class="ra-toolbar" style="margin-bottom: 8px; padding: 6px; background: #e8d0ab; border: 1px solid #7d510f; display: flex; justify-content: space-between; align-items: center; font-size: 11px; position: relative;">
            <div style="display: flex; align-items: center; gap: 10px;">
                <label><input type="checkbox" id="select_all_rows_chk"> Мир с луками</label>
                <span id="troops_count_label" style="font-weight: bold; color: #5a2f0c;">Записей: 0 из 0</span>
            </div>
            <div style="display: flex; gap: 5px; align-items: center;">
                <button class="btn" style="cursor: pointer; padding: 2px 6px;">Снять со страницы</button>
                <button class="btn" id="ra_load_troops_btn" style="cursor: pointer; padding: 2px 6px; font-weight: bold;">Собрать данные</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px;">Войска племени</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #f0e6cc;">Демо</button>
                <button class="btn" style="cursor: pointer; padding: 2px 6px; background: #f2dede; color: #a94442;" id="ra_clear_troops_btn">Очистить</button>
                
                <!-- Кнопка с выпадающим списком сохранения -->
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
        <div style="max-height: 430px; overflow-y: auto; border: 1px solid #7d510f;">
            <table class="vis" id="troops_table" width="100%" style="border-collapse: collapse; background: #f4e4bc; font-size: 11px;">
                <thead>
                    <tr style="background-color: #c1a264; color: #fff; text-align: center;">
                        <th style="width: 25px;"><input type="checkbox" disabled></th>
                        <th>Ник игрока <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th>Координаты <span style="font-size: 9px; cursor: pointer;">▼</span></th>
                        <th title="Копьеносцы"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_spear.png" alt="spear"></th>
                        <th title="Мечники"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_sword.png" alt="sword"></th>
                        <th title="Топорники"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_axe.png" alt="axe"></th>
                        <th title="Разведчики"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_spy.png" alt="spy"></th>
                        <th title="Лёгкая кавалерия"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_light.png" alt="light"></th>
                        <th title="Тяжёлая кавалерия"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_heavy.png" alt="heavy"></th>
                        <th title="Тараны"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_ram.png" alt="ram"></th>
                        <th title="Катапульты"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_catapult.png" alt="catapult"></th>
                        <th title="Паладин"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_knight.png" alt="knight"></th>
                        <th title="Дворяне"><img src="https://dsru.innogamescdn.com/asset/1bf3253b/graphic/unit/unit_snob.png" alt="snob"></th>
                        <th>Тип</th>
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

// Управление выпадающим меню кнопки «Сохранить выбранное»
$(document).on('click', '#ra_save_dropdown_btn', function(e) {
    e.stopPropagation();
    $('#ra_save_menu').toggle();
});

// Закрытие меню при клике в любое другое место
$(document).on('click', function() {
    $('#ra_save_menu').hide();
});

// Клик по пункту меню сохранения категорий
$(document).on('click', '.save-category-option', function() {
    let category = $(this).data('cat');
    let selectedCoords = [];
    
    $('.row-select-chk:checked').each(function() {
        selectedCoords.push($(this).val());
    });

    if (selectedCoords.length === 0) {
        UI.ErrorMessage('Не выбрана ни одна деревня!');
        return;
    }

    // Сохраняем в localStorage
    localStorage.setItem(`tw_workbench_${category}`, JSON.stringify(selectedCoords));
    UI.SuccessMessage(`Сохранено ${selectedCoords.length} деревень в категорию: ${category}`);
    $('#ra_save_menu').hide();
});

// Глобальный чекбокс "Выбрать все"
$(document).on('change', '#select_all_rows_chk', function() {
    let isChecked = $(this).is(':checked');
    $('.row-select-chk').prop('checked', isChecked);
});

// Очистка таблицы
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

    $('#units_table tr.row_marker, #combined_table tr.row_marker, tr[id^="village_"]').each(function() {
        let $row = $(this);
        
        let playerName = $row.find('.player-link, .tooltip').text().trim() || 'Обезбашка';
        let villageNameFull = $row.find('.quickedit-label, .nowrap:first').text().trim();
        let coordsMatch = villageNameFull.match(/\(\d+\|\d+\)/);
        let coords = coordsMatch ? coordsMatch[0] : '—';

        if (!coords || coords === '—') return;

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

