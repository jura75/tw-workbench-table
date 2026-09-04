// src/tab_troops.js

// Функция возвращает HTML-разметку первой вкладки («Таблица войск»)
function getTroopsTabHTML() {
    return `
        <div id="tab_troops" class="ra-tab-content" style="display: block;">
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
        </div>
    `;
}

// Обработчик чекбокса "Выбрать все" для этой вкладки
$(document).on('change', '#select_all_rows_chk', function() {
    let isChecked = $(this).is(':checked');
    $('.row-select-chk').prop('checked', isChecked);
});
