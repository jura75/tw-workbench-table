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
            position: fixed; top: 100px; left: 100px; width: 700px; height: 500px;
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

