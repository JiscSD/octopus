import * as client from '../src/lib/client';
import * as helpers from '../src/lib/helpers';
import * as publicationVersionService from '../src/components/publicationVersion/service';

const createVersionedDOIs = async (): Promise<number> => {
    // get the latest LIVE version of each publication
    const latestLiveVersions = await client.prisma.publicationVersion.findMany({
        where: {
            isLatestLiveVersion: true,
            createdBy: {
                not: 'octopus' // ignore seed data publications
            },
            doi: null // only get versions without DOI
        },
        include: {
            publication: {
                select: {
                    id: true,
                    type: true,
                    doi: true,

                    publicationFlags: true,
                    url_slug: true
                }
            },
            publicationStatus: {
                select: {
                    status: true,
                    createdAt: true,
                    id: true
                },
                orderBy: {
                    createdAt: 'desc'
                }
            },
            funders: {
                select: {
                    id: true,
                    city: true,
                    country: true,
                    name: true,
                    link: true,
                    ror: true,
                    grantId: true
                }
            },
            coAuthors: {
                select: {
                    id: true,
                    email: true,
                    linkedUser: true,
                    publicationVersionId: true,
                    confirmedCoAuthor: true,
                    approvalRequested: true,
                    createdAt: true,
                    reminderDate: true,
                    isIndependent: true,
                    affiliations: true,
                    user: {
                        select: {
                            firstName: true,
                            lastName: true,
                            orcid: true
                        }
                    }
                },
                orderBy: {
                    position: 'asc'
                }
            },
            user: {
                select: {
                    id: true,
                    orcid: true,
                    firstName: true,
                    lastName: true,
                    email: true,
                    createdAt: true,
                    updatedAt: true
                }
            },
            topics: {
                select: {
                    id: true,
                    title: true,
                    createdAt: true
                }
            },
            additionalInformation: {
                select: {
                    id: true,
                    title: true,
                    url: true,
                    description: true
                }
            }
        }
    });

    console.log(`Found ${latestLiveVersions.length} without a DOI.`);

    let createdVersionDOIsCount = 0;

    for (const version of latestLiveVersions) {
        // create a new DOI for each version
        console.log(`Creating version ${version.versionNumber} DOI for publication ${version.versionOf}`);
        const versionDOIResponse = await helpers.createPublicationVersionDOI(version);
        const versionDOI = versionDOIResponse.data.attributes.doi;

        console.log(`Successfully created version ${version.versionNumber} DOI: ${versionDOI}`);

        // update version DOI
        console.log(`Updating version DOI: ${versionDOI} in DB`);
        const updatedVersion = await publicationVersionService.update(version.id, {
            doi: versionDOI
        });

        // update publication "HasVersion" with the created DOI
        console.log(`Updating canonical DOI: ${version.publication.doi} "HasVersion" with version DOI: ${versionDOI}`);
        await helpers.updatePublicationDOI(version.publication.doi, updatedVersion);

        console.log(`Successfully updated canonical DOI: ${version.publication.doi}`);

        createdVersionDOIsCount += 1;
        console.log(); // new line
    }

    return createdVersionDOIsCount;
};

createVersionedDOIs()
    .then((versionedDOIsCount) =>
        console.log(`Successfully created ${versionedDOIsCount} versioned DOIs and updated their canonical DOIs`)
    )
    .catch((err) => console.log(err));
