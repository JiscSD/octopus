const axios = require('axios');
const fs = require('fs');
const titleIDStore = new Map();
const allIDStore = new Set();

const toolongIDStore = new Set();
const missingParentIDStore = new Map();

// Manually create the GOD problem via seed data per env (this one is for int)
titleIDStore.set('What makes everything we can detect in the universe around us the way that it is, and why?', 'why');
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
        allIDStore.add(title);
        parent1 = parent1.replace(/\"/g, '');
        parent2 = parent2.replace(/\"/g, '');
        content = content.replace(/\"/g, '');
        parent1ID = titleIDStore.get(parent1);
        parent2ID = titleIDStore.get(parent2);
        if (!parent1ID && !parent2ID) {
            console.log(
                `missing parents${
                    toolongIDStore.has(parent1) ? ' (parent too long)' : ''
                }\t"${title}"\t"${parent1}"\t"${parent2}"\t"${content}" `
            );
            if (missingParentIDStore.get(parent1)) {
                missingParentIDStore.get(parent1).add(title);
            } else {
                missingParentIDStore.set(parent1, new Set().add(title));
            }
            continue;
        }
        if (title.length > 160) {
            console.log(`too long\t"${title}"\t"${parent1}"\t"${parent2}"\t"${content}"`);
            toolongIDStore.add(title);
            continue;
        }

        // only record ones we know would have been created
        // TODO check output of this with DB
        titleIDStore.set(title, 'found');
    }

    missingParentIDStore.forEach((titles, parent) => {
        titles.forEach((title) => {
            if (allIDStore.has(parent)) {
                if (toolongIDStore.has(parent)) {
                    console.log(`parent too long\t"${parent}"\t"${title}"`);
                } else if (isCircular(parent, title)) {
                    console.log(`circular reference \t"${parent}"\t"${title}"`);
                } else if (titleIDStore.has(parent)) {
                    // the parent was created but too late
                    console.log(`out of order parent\t"${parent}"\t"${title}"`);
                } // else parent's ancestor missing due to one of the above and therefore should be created
            } else {
                console.log(`parent not in file\t"${parent}"\t"${title}"`);
            }
        });
    });
};

const isCircular = (parent, title) => {
    let found = false;
    const titleAsParents = missingParentIDStore.get(title);
    if (titleAsParents) {
        for (const titleAsParent of titleAsParents) {
            if (!found && titleAsParent != parent) {
                if (isCircular(parent, titleAsParent)) {
                    found = true;
                    break;
                }
            }
            if (titleAsParent === parent) {
                found = true;
                break;
            }
        }
    }

    return found;
};

loadData();
