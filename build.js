const fs = require('fs');
const path = require('path');

const coreFile = path.join(__dirname, 'src', 'core.js');
const troopFile = path.join(__dirname, 'src', 'tab_troops.js');
const outputFile = path.join(__dirname, 'dist', 'tw-workbench.user.js');

try {
    const coreContent = fs.readFileSync(coreFile, 'utf8');
    const troopContent = fs.readFileSync(troopFile, 'utf8');

    const bundledCode = `// ==UserScript==
