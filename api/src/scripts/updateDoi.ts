import * as client from '../lib/client';
import * as helpers from '../lib/helpers';

/**
 * This script will update canonical DOIs with their latest versions
 */

const updatePublicationDOIs = async (): Promise<void> => {
    const latestLiveVersions = await client.prisma.publicationVersion.findMany({
        where: {
            isLatestLiveVersion: true
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
                    ror: true
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
            }
        }
    });

    let index = 1;

    for (const version of latestLiveVersions) {
        await helpers.updatePublicationDOI(version.publication.doi, version).catch((err) => console.log(err));

        console.log(`No: ${index}. ${version.title} doi updated (${version.publication.doi})`);
        index++;
    }
};

updatePublicationDOIs().catch((err) => console.log(err));
