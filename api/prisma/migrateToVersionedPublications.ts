import * as client from 'lib/client';
import { Prisma } from '@prisma/client';

// Convert publications from non-versioned to versioned database structure
const migrateToVersionedPublications = async (): Promise<void> => {
    // For each existing publication, create a first version with its basic data (excluding most relations).
    const existingPublications = await client.prisma.publication.findMany();
    const versionsToCreate: Prisma.PublicationVersionCreateManyInput[] = existingPublications.map(publication => ({
        versionOf: publication.id,
        versionNumber: 1,
        isLatestLiveVersion: publication.currentStatus === 'LIVE',
        // This will always have been mandatory up to this point, so this OR operator is just to keep typescript happy
        // since the field has been made optional in the pre-migration. createdBy will have a value.
        // The same is done for other previously mandatory fields to be removed. 
        createdBy: publication.createdBy || '',
        createdAt: publication.createdAt as Date,
        updatedAt: publication.updatedAt as Date,
        currentStatus: publication.currentStatus || undefined,
        publishedDate: publication.publishedDate,
        title: publication.title,
        licence: publication.licence || undefined,
        conflictOfInterestStatus: publication.conflictOfInterestStatus,
        conflictOfInterestText: publication.conflictOfInterestText,
        ethicalStatement: publication.ethicalStatement,
        ethicalStatementFreeText: publication.ethicalStatementFreeText,
        dataPermissionsStatement: publication.dataPermissionsStatement,
        dataPermissionsStatementProvidedBy: publication.dataPermissionsStatementProvidedBy,
        dataAccessStatement: publication.dataAccessStatement,
        selfDeclaration: publication.selfDeclaration,
        description: publication.description,
        keywords: publication.keywords,
        content: publication.content,
        language: publication.language || undefined,
        fundersStatement: publication.fundersStatement
    }));

    // Create publication versions
    const createVersions = await client.prisma.publicationVersion.createMany({
        data: versionsToCreate
    });

    if (createVersions.count !== existingPublications.length) {
        throw new Error("Count mismatch between existing publications and new versions");
    }

    // Update other relations. This is a simple case of adding a reference to the version, and
    // removing the reference to the publication itself

    // Update References
    const existingReferences = await client.prisma.references.findMany();
    await Promise.all(existingReferences.map(async reference => {
        const linkedVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: reference.publicationId || undefined // this is just to keep TS happy.
                // It will be defined, we just need to mark it as optional in the schema before removing it
                // to avoid DB complaints at that stage.
            },
            select: {
                id: true,
                versionOf: true
            }
        });
        await client.prisma.references.update({
            where: {
                id: reference.id
            },
            data: {
                publicationVersion: {
                    connect: {
                        id: linkedVersion?.id
                    }
                },
                publication: {
                    disconnect: true
                }
            }
        });
    }));

    // Update Funders
    const existingFunders = await client.prisma.funders.findMany();
    await Promise.all(existingFunders.map(async funder => {
        const linkedVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: funder.publicationId || undefined
            },
            select: {
                id: true,
                versionOf: true
            }
        });
        await client.prisma.funders.update({
            where: {
                id: funder.id
            },
            data: {
                publicationVersion: {
                    connect: {
                        id: linkedVersion?.id
                    }
                },
                publication: {
                    disconnect: true
                }
            }
        });
    }));

    // Update Statuses
    const existingStatuses = await client.prisma.publicationStatus.findMany();
    await Promise.all(existingStatuses.map(async status => {
        const linkedVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: status.publicationId || undefined
            },
            select: {
                id: true,
                versionOf: true
            }
        });
        await client.prisma.publicationStatus.update({
            where: {
                id: status.id
            },
            data: {
                publicationVersion: {
                    connect: {
                        id: linkedVersion?.id
                    }
                },
                publication: {
                    disconnect: true
                }
            }
        });
    }));

    // Update CoAuthors
    const existingCoAuthors = await client.prisma.coAuthors.findMany();
    await Promise.all(existingCoAuthors.map(async coAuthor => {
        const linkedVersion = await client.prisma.publicationVersion.findFirst({
            where: {
                versionOf: coAuthor.publicationId || undefined
            },
            select: {
                id: true,
                versionOf: true
            }
        });
        await client.prisma.coAuthors.update({
            where: {
                id: coAuthor.id
            },
            data: {
                publicationVersion: {
                    connect: {
                        id: linkedVersion?.id
                    }
                },
                publication: {
                    disconnect: true
                }
            }
        });
    }));
};

migrateToVersionedPublications()
    .then(() =>
        console.log(`Done`)
    )
    .catch((error) => console.log(error));