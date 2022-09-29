const axios = require('axios');
const fs = require('fs');
const titleIDStore = new Map();
// Manually create the GOD problem via seed data per env (this one is for int)
titleIDStore.set(
    'What makes everything we can detect in the universe around us the way that it is, and why?',
    'why'
);
const tsv = fs.readFileSync('./data.txt', 'utf-8');
const loadData = async () => {
    const rows = tsv.split('\n');
    let index = -1;
    for (const row of rows) {
        index++;
        // Skip header of csv
        if (index === 0 || row.length == 0) {
            continue;
        }
        let [title, parent1, parent2, content] = row.split('\t');
        title = title.replace(/\"/g, '');
        parent1 = parent1.replace(/\"/g, '');
        parent2 = parent2.replace(/\"/g, '');
        content = content.replace(/\"/g, '');
        parent1ID = titleIDStore.get(parent1);
        parent2ID = titleIDStore.get(parent2);
        if (!parent1ID && !parent2ID) {
            console.log(`missing parents\t"${title}"\t"${parent1}"\t"${parent2}"\t"${content}" `);
            continue;
        }
        if(title.length >160) {
            console.log(`too long\t"${title}"\t"${parent1}"\t"${parent2}"\t"${content}"`);
            }

        titleIDStore.set(title,"found");     
    }
};


loadData();