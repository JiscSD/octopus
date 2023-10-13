import * as client from '../lib/client';
import * as helpers from '../lib/helpers';
import * as referenceService from 'reference/service';
import * as publicationService from 'publication/service';

const updateDoi = async (): Promise<void> => {
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
                    topics: true,
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
            }
        }
    });

    let index = 1;

    for (const version of latestLiveVersions) {
        const references = await referenceService.getAllByPublicationVersion(version.id);
        const { linkedTo } = await publicationService.getDirectLinksForPublication(version.versionOf);

        await helpers
            .updateDOI(version.publication.doi, version, linkedTo, references)
            .catch((err) => console.log(err));

        console.log(`No: ${index}. ${version.title} doi updated (${version.publication.doi})`);
        index++;
    }
};

updateDoi().catch((err) => console.log(err));
