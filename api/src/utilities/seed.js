const axios = require('axios');
const fs = require('fs');
const cuid = require('cuid')
const titleIDStore = new Map();
// Manually create the GOD problem via seed data per env then update the DOI here
titleIDStore.set(
    'What makes everything we can detect in the universe around us the way that it is, and why?', // GOD problem text
    'why' // GOD problem DOI
);
const tsv = fs.readFileSync('./data.txt', 'utf-8');
const loadData = async () => {
    const rows = tsv.split('\n');
    let index = -1;

    for (const row of rows) {
        index++;
        // Skip header of csv
        if (index === 0) {
            continue;
        }

        const splitRow = row.split('\t');
        const references = [];
        
        let [title, parent1, parent2, content] = splitRow;
        for (let key in splitRow) {
            if (key > 4) {
                if (splitRow[key] == '') {
                    break;
                }
                references.push(splitRow[key]);
            }
        }

        let formattedReferences = [];

        if(references.length) {
            formattedReferences = formatReference(references);
        }

        console.log(formattedReferences)
        title = title.replace(/\"/g, '');
        parent1 = parent1.replace(/\"/g, '');
        parent2 = parent2.replace(/\"/g, '');
        content = content.replace(/\"/g, '');
        parent1ID = titleIDStore.get(parent1);
        parent2ID = titleIDStore.get(parent2);
        
        if (!parent1ID && !parent2ID) {
            continue;
        }

        // const publicationCreation = await createPublication(title, content);
        // // console.log(publicationCreation);
        // if (!publicationCreation) {
        //     continue;
        // }
        // console.log({
        //     title,
        //     parent1ID,
        //     parent2ID,
        //     publication: publicationCreation.id
        // });
        // titleIDStore.set(publicationCreation.title, publicationCreation.id);
        // if (parent1ID) {
        //     await createLink(publicationCreation.id, parent1ID);
        // }
        // if (parent2ID) {
        //     await createLink(publicationCreation.id, parent2ID);
        // }

        // Before we launch the publication we will add the references to it
        // TODO:
        // Create publication - done
        // Sperate reference from URL
        // format reference text
        // send request to create references endpoint with an array of formated
        // references along with the publication id
        // replace publication id with real one from the response data 

        // you can reseed the database if something goes wrong with the ingest of this data 
        // error handle if blank row at end of file or elsewhere 
        // await launchPublication(publicationCreation.id);
    }
};
const url = process.env.API_URL;
const apiKey = process.env.API_KEY;

if (!url || !apiKey) {
    console.log('API_URL and API_KEY env vars need to be set');
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
            description: content
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


const formatReference = (references) => {
    const paragraphsArray = references;
    if (!paragraphsArray.length) {
        return;
    }

    let referencesArray = [];

    for (let i = 0; i < paragraphsArray.length; i++) {
        if (!paragraphsArray[i]) {
            continue; // don't add empty references
        }
        const newReference = getTransformedReference(
            {
                id: cuid(),
                publicationId: 'asdasdasdasdasd', // this needs replacing with the real one
                type: 'TEXT',
                text: paragraphsArray[i],
                location: null
            },
            paragraphsArray[i]
        );

        referencesArray.push(newReference);
    }

    return referencesArray;
}

const getTransformedReference = (reference, textContent) => {
    const urlMatches = getURLsFromText(textContent);

    // reverse the order for easier access
    const reversedUrlMatches = urlMatches.reverse(); // we only need the last DOI/URL

    // get the last valid DOI url if exists
    const doiUrl = reversedUrlMatches.find((match) => validateDOI(match));

    if (doiUrl) {
        return {
            ...reference,
            type: 'DOI',
            text: reference.text.replace(doiUrl, ''),
            location: doiUrl
        };
    }

    // check for DOI strings
    const doiStrings = getFullDOIsStrings(textContent);
    if (doiStrings.length) {
        // get the last DOI string
        const lastDoiString = doiStrings.pop();
        if (lastDoiString) {
            // extract the DOI only
            const doi = getDOIsFromText(lastDoiString)[0];
            if (doi) {
                return {
                    ...reference,
                    type: 'DOI',
                    text: reference.text.replace(lastDoiString, ''), // remove DOI string
                    location: `https://doi.org/${doi}` // convert to DOI url
                };
            }
        }
    }

    // extract the last URL
    const lastUrl = reversedUrlMatches[0];
    if (lastUrl) {
        return {
            ...reference,
            type: 'URL',
            text: reference.text.replace(lastUrl, ''),
            location: lastUrl
        };
    }

    // no urls have been found
    return {
        ...reference,
        type: 'TEXT',
        text: reference.text,
        location: null
    };
};

// original URL regex: /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:\/~+#-]*[\w@?^=%&\/~+#-])/
const getURLsFromText = (text) =>
    text.match(/(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/g) || [];

const validateURL = (value) =>
    /(http|ftp|https):\/\/([\w_-]+(?:(?:\.[\w_-]+)+))([\w.,@?^=%&:()<>;\/~+#-]*[\w@?^=%&\/~+#-])/.test(value);

// extracts DOIs including ‘DOI: 10.’ / ‘DOI:10.’ / ‘DOI-10.’ / ‘DOI - 10.’ / ‘DOI 10.’ etc...
const getFullDOIsStrings = (text) =>
    text.match(
        /(\s+)?(\(|\(\s+)?(?:DOI((\s+)?([:-])?(\s+)?))?(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b(\)|\s+\))?(\.)?/gi
    ) || [];

// extracts the DOIs only
const getDOIsFromText = (text) => text.match(/(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/g) || [];

const validateDOI = (value) => /(10\.[0-9a-zA-Z]+\/(?:(?!["&\'])\S)+)\b/.test(value);


loadData();
