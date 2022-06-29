/*
 * Process:
 * 1. Create draft DOI, use suffix as ID for Octopus publication
 * 2. Create Octopus publication without linked publications
 * 3. When all publications are created, generate links using the generated ID/suffix
 * 4. Set DOI as live and update 'relatedIdentifiers' using generated ID/suffix
 *
 * Note: Datacite API is limited to 3000 requests per 5 minute window, so we are purposefully limiting
 * the ingest process: https://support.datacite.org/docs/is-there-a-rate-limit-for-making-requests-against-the-datacite-apis
 */

const fs = require('fs');
const axios = require('axios');
const Bottleneck = require('bottleneck/es5');
const { PrismaClient } = require('@prisma/client');
const { resolve } = require('path');
const prisma = new PrismaClient();
const data = fs.readFileSync('./data.txt', 'utf-8');

const writePublicationToDB = async (data) => {
    const publication = await prisma.publication.upsert({
        where: { id: data.id },
        update: data,
        create: data
    });
    return publication;
};

const addPublication = async (id, title, parent1, parent2, text, doi) => {
    const seedObject = {
        id,
        doi,
        title,
        content: text,
        licence: 'CC_BY',
        type: 'PROBLEM',
        currentStatus: 'LIVE',
        conflictOfInterestStatus: false,
        description: text,
        user: {
            connect: {
                id: 'octopus'
            }
        },
        publicationStatus: {
            create: [
                {
                    status: 'LIVE',
                    createdAt: '2022-06-27T12:00:00.523Z'
                },
                {
                    status: 'DRAFT',
                    createdAt: '2022-06-27T11:00:00.523Z'
                }
            ]
        }
    };

    await writePublicationToDB(seedObject);
};

const limiter = new Bottleneck({
    maxConcurrent: 1,
    minTime: 100,
    trackDoneStatus: true
});

const generateDOI = async ({ title, parent1, parent2, text }) => {
    const payload = {
        data: {
            types: 'doi',
            attributes: {
                prefix: '10.82259',
                titles: [
                    {
                        title,
                        lang: 'en'
                    }
                ],
                publisher: 'Octopus',
                publicationYear: 2022,
                language: 'en',
                types: {
                    resourceTypeGeneral: 'Other',
                    resourceType: 'PROBLEM'
                },
                relatedIdentifiers: []
            }
        }
    };

    // if (parent1) {
    //     payload.data.attributes.relatedIdentifiers.push({
    //         relatedIdentifier: parent1,
    //         relatedIdentifierType: 'DOI',
    //         relationType: 'Continues'
    //     });
    // }
    // if (parent2) {
    //     payload.data.attributes.relatedIdentifiers.push({
    //         relatedIdentifier: parent2,
    //         relatedIdentifierType: 'DOI',
    //         relationType: 'Continues'
    //     });
    // }

    try {
        const doiRes = await axios.post('https://api.test.datacite.org/dois', payload, {
            auth: {
                username: 'ZFTJ.RVKZST',
                password: process.env.DOI_PASS
            }
        });
        if (!doiRes?.data) {
            throw doiRes;
        }

        // Success state
        console.log({
            doi: doiRes.data.data.id, // We will use this as the internal ID for a Publication
            suffix: doiRes.data.data.attributes.suffix
        });

        const x = await addPublication(
            doiRes.data.data.attributes.suffix,
            title,
            parent1,
            parent2,
            text,
            doiRes.data.data.id
        );

        return true;
    } catch (err) {
        console.log({
            ingestFailure: title,
            err
        });
        return false;
    }
};

const createPublcations = async () => {
    let promises = [];
    await limiter.schedule(() => {
        data.split('\n').forEach(async (row, index) => {
            if (index != 0) {
                const [title, parent1, parent2, text] = row.split('\t');
                promises.push(generateDOI({ title, parent1, parent2, text }));
            }
        });
        return Promise.all(promises);
    });

    console.log('Promises resolved');

    // now we can create the links...
    try {
        await createLinks();
    } catch (err) {
        console.log(err);
    }
};

const createLinks = async () => {
    data.split('\n').forEach(async (row, index) => {
        if (index != 0) {
            const [title, parent1, parent2, text] = row.split('\t');
            const publicationFrom = await prisma.publication.findFirst({ where: { title } });

            if (parent1) {
                const publicationParent1 = await prisma.publication.findFirst({ where: { title: parent1 } });
                const link1 = await prisma.links.create({
                    data: { publicationTo: publicationParent1.id, publicationFrom: publicationFrom.id }
                });
                console.log(link1);
            }

            if (parent2) {
                const publicationParent2 = await prisma.publication.findFirst({ where: { title: parent2 } });
                const link2 = await prisma.links.create({
                    data: { publicationTo: publicationParent2.id, publicationFrom: publicationFrom.id }
                });
                console.log(link2);
            }

            console.log(publicationFrom);
        }
    });
};

const run = async () => {
    await createPublcations();
    return;
};

run();

// For each seed data row:
// Get publication from id via title - returns pub id
// Get publication to id via title - returns pub id
// Create Link entity with the to and from ids
