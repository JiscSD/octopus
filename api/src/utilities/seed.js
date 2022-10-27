const axios = require('axios');
const fs = require('fs');
const cuid = require('cuid');
const titleIDStore = new Map();
// Manually create the GOD problem via seed data per env then update the DOI here
titleIDStore.set(
    'What makes everything we can detect in the universe around us the way that it is, and why?', // GOD problem text
    'why' // GOD problem DOI
);
const tsv = fs.readFileSync('./missing-seed-data.txt', 'utf-8');
const loadData = async () => {
    const rows = tsv.split('\n');
    let index = -1;

    for (const row of rows) {
        index++;

        try {
            // Skip header of csv
            if (index === 0) {
                continue;
            }

            const splitRow = row.split('\t');
            let [title, parent1, parent2, content] = splitRow;
            title = title.replace(/\"/g, '');
            parent1 = parent1.replace(/\"/g, '');
            parent2 = parent2.replace(/\"/g, '');
            content = content.replace(/\"/g, '');
            parent1ID = titleIDStore.get(parent1);
            parent2ID = titleIDStore.get(parent2);

            console.log('Current Publication: ', title)

            // Before creating the publication, check if it already exists.
            // This needs to query /publications/{id} then query the send a request to /links with the
            // publication ID
            const doesPublicationExist = await checkIfPublicationExists(title, parent1ID, parent2ID);

            if (doesPublicationExist) {
                titleIDStore.set(doesPublicationExist.title, doesPublicationExist.id);
                console.log('Exists: ', index);
                continue;
            }
            
            const publicationCreation = await createPublication(title, content);

            if (!publicationCreation) {
                logError("Publication failed to create for: " + title)
                return;
            }

            if (!parent1ID && !parent2ID) {
                logError("Missing parents for publication: " + title)
                // Remove draft publication so the file can be re-run with the corrections
                await deleteDraftPublication(publicationCreation.id)
                return;
            }

            titleIDStore.set(publicationCreation.title, publicationCreation.id);

            if (parent1ID) {
                await createLink(publicationCreation.id, parent1ID);
            }
            if (parent2ID) {
                await createLink(publicationCreation.id, parent2ID);
            }

            const references = [];

            for (let key in splitRow) {
                if (key > 4) {
                    if (splitRow[key] == '') {
                        break;
                    }
                    references.push(splitRow[key]);
                }
            }

            let formattedReferences = [];

            // If the publication contains references, format them into the octopus spec
            if (references.length) {
                formattedReferences = formatReference(references, publicationCreation.id);
            }

            // Add references
            if (formattedReferences.length) {
                await addReferencesToPublication(publicationCreation.id, formattedReferences);
            }

            await launchPublication(publicationCreation.id);
            
            // Check if publication was set to draft, if it was error and delete
            const didPublicationLaunch = await checkIfPublicationIsLive(publicationCreation.id)

            // If a publication did not go LIVE check it's data as it could effect
            // further publication from going live if it is their parent and missing. 
            if(!didPublicationLaunch) {
                logError("Publication failed to go live: " + title)
                await deleteDraftPublication(publicationCreation.id)
                return;
            }
            
            console.log('Publication: ' + title + " is live")
            console.log('Index: ', index);

        } catch (err) {
            // If there happens to be an error, it's added to errors.txt with the error code
            // and the row that is occured on.
            logError(err + ': ' + row)
            break;
        }
    }
};
const url = process.env.API_URL
const apiKey = process.env.API_KEY

if (!url || !apiKey) {
    console.log('API_URL and API_KEY env vars need to be set');
    return;
}

const deleteDraftPublication = async (id) => {
    await axios.delete(`${url}/publications/${id}?apiKey=${apiKey}`)
}

const checkIfPublicationIsLive = async (id) => {

    const response = await axios.get(`${url}/publications/${id}`)
    
    if(response.data.currentStatus === 'LIVE') {
        return true;
    }

    return false;
}

const logError = (message) => {
    fs.appendFile('errors.txt', message + "\n", function (err) {
        if (err) throw err;
        console.log('Error logged');
    });
}

const checkIfPublicationExists = async (title, parent1ID, parent2ID) => {
    // Encode the URl parameter as it has the potential to use special characters, such as '&'
    const encodedTitle = encodeURIComponent(title);
    try {
        const publicationsResponse = await axios.get(`${url}/publications?search=${encodedTitle}`);

        const publications = publicationsResponse.data.data;

        const parents = [];

        if (typeof parent1ID !== 'undefined') {
            parents.push(parent1ID);
        }

        if (typeof parent2ID !== 'undefined') {
            parents.push(parent2ID);
        }

        for (let key in publications) {
            if (publications[key].title === title) {
                const publicationLinks = await axios.get(`${url}/links?publicationID=${publications[key].id}`);
                const publicationLinksResponse = publicationLinks.data;
                // Skip checking more than two since we will only ever have max 2 parents for seed data
                if (publicationLinksResponse.length > 2) {
                    continue;
                }

                // Only process if link data is returned
                if (publicationLinksResponse.length) {
                    const linkIDs = publicationLinksResponse.map((link) => {
                        return link.publicationTo;
                    });

                    if (linkIDs.sort().join(',') === parents.sort().join(',')) {
                        return publications[key];
                    }
                }
            }
        }
    } catch (error) {
        // assume not found
    }

    return false;
};

const addReferencesToPublication = async (publicationId, references) => {
    try {
        const referencesResponse = await axios.put(
            `${url}/publications/${publicationId}/reference?apiKey=${apiKey}`,
            references
        );
        return referencesResponse.data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

const createPublication = async (title, content) => {
    console.log(`Creating: ${title}`);
    try {
        const payload = {
            type: 'PROBLEM',
            title,
            ethicalStatement: false,
            conflictOfInterestStatus: 0,
            language: 'en',
            licence: 'CC_BY',
            content: content || title,
            description: content
        };
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
        return launched.data;
    } catch (err) {
        console.log(err);
        return false;
    }
};

// All reference format code has come from whats already in octopus
// but slightly adapted for this instance
const formatReference = (references, publicationId) => {
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
                publicationId,
                type: 'TEXT',
                text: paragraphsArray[i],
                location: null
            },
            paragraphsArray[i]
        );

        referencesArray.push(newReference);
    }

    return referencesArray;
};

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
