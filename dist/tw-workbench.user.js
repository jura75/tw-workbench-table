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

// Функция возвращает внутреннюю разметку первой вкладки («Таблица войск»)
function getTroopsTabHTML() {
    return `
        <!-- Панель инструментов первой вкладки -->
        <div class="ra-toolbar" style="margin-bottom: 10px; padding: 5px; background: #e8d0ab; border: 1px solid #7d510f;">
            <span style="font-weight: bold; margin-right: 10px;">Управление войсками</span>
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

// Обработчик чекбокса "Выбрать все" для этой вкладки
$(document).on('change', '#select_all_rows_chk', function() {
    let isChecked = $(this).is(':checked');
    $('.row-select-chk').prop('checked', isChecked);
});

