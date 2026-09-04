const fs = require('fs');
const path = require('path');

const coreFile = path.join(__dirname, 'src', 'core.js');
const troopFile = path.join(__dirname, 'src', 'tab_troops.js');
const outputFile = path.join(__dirname, 'dist', 'tw-workbench.user.js');

try {
    const coreContent = fs.readFileSync(coreFile, 'utf8');
    const troopContent = fs.readFileSync(troopFile, 'utf8');

    const bundledCode = `// ==UserScript==
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
${coreContent}

/* --- Troops Tab Module --- */
${troopContent}
`;

    if (!fs.existsSync(path.join(__dirname, 'dist'))) {
        fs.mkdirSync(path.join(__dirname, 'dist'));
    }

    fs.writeFileSync(outputFile, bundledCode, 'utf8');
    console.log('Сборка успешно завершена!');

} catch (err) {
    console.error('Ошибка при сборке:', err);
}
