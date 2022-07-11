const axios = require('axios');
const fs = require('fs');
const titleIDStore = new Map();
// Manually create the GOD problem via seed data per env (this one is for int)
titleIDStore.set(
    'What makes everything we can detect in the universe around us the way that it is, and why?',
    'vwch-7f37'
);
const tsv = fs.readFileSync('./data.txt', 'utf-8');
const loadData = async () => {
    const rows = tsv.split('\n');
    let index = -1;
    for (const row of rows) {
        console.log(titleIDStore);
        index++;
        // Skip header of csv
        if (index === 0) {
            continue;
        }
        let [title, parent1, parent2, content] = row.split('\t');
        title = title.replace(/\"/g, '');
        console.log(index,title,parent1,parent2);
      parent1 = parent1.replace(/\"/g, '');
        parent2 = parent2.replace(/\"/g, '');
        content = content.replace(/\"/g, '');
        parent1ID = titleIDStore.get(parent1);
        parent2ID = titleIDStore.get(parent2);
        if (!parent1ID && !parent2ID) {
            continue;
        }
        const publicationCreation = await createPublication(title, content);
        // console.log(publicationCreation);
        if (!publicationCreation) {
            continue;
        }
        console.log({
            title,
            parent1ID,
            parent2ID,
            publication: publicationCreation.id
        });
        titleIDStore.set(publicationCreation.title, publicationCreation.id);
        if (parent1ID) {
            await createLink(publicationCreation.id, parent1ID);
        }
        if (parent2ID) {
            await createLink(publicationCreation.id, parent2ID);
        }
        await launchPublication(publicationCreation.id);
    }
};
const url = process.env.API_URL;
const apiKey = process.env.API_KEY;

if(!url || !apiKey) {
    console.log("API_URL and API_KEY env vars need to be set")
}

const createPublication = async (title, content) => {
    try {
        const payload = {
            type: 'PROBLEM',
            title,
            ethicalStatement: false,
            conflictOfInterestStatus: false,
   	        language: 'en',
            licence: 'CC_BY',
            content: content || title,
            description: title || ''
        };
        console.log(payload);
        const create = await axios.post(`${url}/publications?apiKey=${apiKey}`, payload);
        return create.data;
    } catch (err) {
	    console.log(title, err);
        return false;
    }
};
const createLink = async (pubFrom, pubTo) => {
    try {
        const createLink = await axios.post(`${url}/links?apiKey=${apiKey}`, {
            from: pubFrom,
            to: pubTo
        });
        return createLink.data;
    } catch (err) {
        console.log(err);
        return false;
    }
};
const launchPublication = async (id) => {
    try {
        const launched = await axios.put(`${url}/publications/${id}/status/LIVE?apiKey=${apiKey}`);
        console.log(launched.data);
        return launched.data;
    } catch (err) {
        console.log(err);
        return false;
    }
};
loadData();
