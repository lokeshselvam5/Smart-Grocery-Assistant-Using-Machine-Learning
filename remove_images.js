const fs = require('fs');
const file = 'c:/Users/loki/OneDrive/Documents/muthu-department-store-main/data.js';
let content = fs.readFileSync(file, 'utf8');
// Replace image property
content = content.replace(/,\s*image:\s*['\"].*?['\"]/g, '');
fs.writeFileSync(file, content, 'utf8');
console.log('Successfully removed image fields from data.js');
