import * as client from 'lib/client';
import { Prisma } from '@prisma/client';

// Convert publications from non-versioned to versioned database structure
const migrateToVersionedPublications = async (): Promise<void> => {

    // Clearing up before the main script:
    // For associated entities, if they were connected to a version, disconnect them, and reconnect them to the overall publication.
    const versionReferences = await client.prisma.references.findMany({
        where: {
            NOT: {
                publicationVersion: null
            }
        }
    });
    console.log(`Cleaning up ${versionReferences.length} references...`);

    for (const reference of versionReferences) {
        if (reference.publicationVersionId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    id: reference.publicationVersionId
                },
                select: {
                    versionOf: true
                }
            });
            await client.prisma.references.update({
                where: {
                    id: reference.id
                },
                data: {
                    publicationVersion: {
                        disconnect: true
                    },
                    publication: {
                        connect: {
                            id: linkedVersion?.versionOf
                        }
                    }
                }
            });
        }
    }

    const versionFunders = await client.prisma.funders.findMany({
        where: {
            NOT: {
                publicationVersion: null
            }
        }
    });
    console.log(`Cleaning up ${versionFunders.length} funders...`);

    for (const funder of versionFunders) {
        if (funder.publicationVersionId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    id: funder.publicationVersionId
                },
                select: {
                    versionOf: true
                }
            });
            await client.prisma.funders.update({
                where: {
                    id: funder.id
                },
                data: {
                    publicationVersion: {
                        disconnect: true
                    },
                    publication: {
                        connect: {
                            id: linkedVersion?.versionOf
                        }
                    }
                }
            });
        }
    }

    const versionStatuses = await client.prisma.publicationStatus.findMany({
        where: {
            NOT: {
                publicationVersion: null
            }
        }
    });
    console.log(`Cleaning up ${versionStatuses.length} statuses...`);

    for (const status of versionStatuses) {
        if (status.publicationVersionId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    id: status.publicationVersionId
                },
                select: {
                    versionOf: true
                }
            });
            await client.prisma.publicationStatus.update({
                where: {
                    id: status.id
                },
                data: {
                    publicationVersion: {
                        disconnect: true
                    },
                    publication: {
                        connect: {
                            id: linkedVersion?.versionOf
                        }
                    }
                }
            });
        }
    }

    const versionCoAuthors = await client.prisma.coAuthors.findMany({
        where: {
            NOT: {
                publicationVersion: null
            }
        }
    });
    console.log(`Cleaning up ${versionCoAuthors.length} coAuthors...`);

    for (const coAuthor of versionCoAuthors) {
        if (coAuthor.publicationVersionId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    id: coAuthor.publicationVersionId
                },
                select: {
                    versionOf: true
                }
            });
            await client.prisma.coAuthors.update({
                where: {
                    id: coAuthor.id
                },
                data: {
                    publicationVersion: {
                        disconnect: true
                    },
                    publication: {
                        connect: {
                            id: linkedVersion?.versionOf
                        }
                    }
                }
            });
        }
    }

    // If any versions were created before, remove them.
    console.log('Deleting pre-existing publication versions...');
    await client.prisma.publicationVersion.deleteMany();
    console.log('Cleaned, ready to start');

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
    console.log(`Creating ${versionsToCreate.length} publication versions...`);
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
    console.log(`Updating ${existingReferences.length} references...`);

    for (const reference of existingReferences) {
        if (reference.publicationId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    versionOf: reference.publicationId // this is just to keep TS happy.
                    // It will be defined, we just need to mark it as optional in the schema before removing it
                    // to avoid DB complaints at that stage.
                },
                select: {
                    id: true,
                    versionOf: true
                }
            });

            if (linkedVersion) {
                await client.prisma.references.update({
                    where: {
                        id: reference.id
                    },
                    data: {
                        publicationVersion: {
                            connect: {
                                id: linkedVersion.id
                            }
                        },
                        publication: {
                            disconnect: true
                        }
                    }
                });
            }
        }
    }

    // Update Funders
    const existingFunders = await client.prisma.funders.findMany();
    console.log(`Updating ${existingFunders.length} funders...`);

    for (const funder of existingFunders) {
        if (funder.publicationId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    versionOf: funder.publicationId
                },
                select: {
                    id: true,
                    versionOf: true
                }
            });

            if (linkedVersion) {
                await client.prisma.funders.update({
                    where: {
                        id: funder.id
                    },
                    data: {
                        publicationVersion: {
                            connect: {
                                id: linkedVersion.id
                            }
                        },
                        publication: {
                            disconnect: true
                        }
                    }
                });
            }
        }
    }

    // Update Statuses
    const existingStatuses = await client.prisma.publicationStatus.findMany();
    console.log(`Updating ${existingStatuses.length} statuses...`);

    for (const status of existingStatuses) {
        if (status.publicationId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    versionOf: status.publicationId
                },
                select: {
                    id: true,
                    versionOf: true
                }
            });

            if (linkedVersion) {
                await client.prisma.publicationStatus.update({
                    where: {
                        id: status.id
                    },
                    data: {
                        publicationVersion: {
                            connect: {
                                id: linkedVersion.id
                            }
                        },
                        publication: {
                            disconnect: true
                        }
                    }
                });
            }
        }
    }

    // Update CoAuthors
    const existingCoAuthors = await client.prisma.coAuthors.findMany();
    console.log(`Updating ${existingCoAuthors.length} coAuthors...`);

    for (const coAuthor of existingCoAuthors) {
        if (coAuthor.publicationId) {
            const linkedVersion = await client.prisma.publicationVersion.findFirst({
                where: {
                    versionOf: coAuthor.publicationId
                },
                select: {
                    id: true,
                    versionOf: true
                }
            });

            if (linkedVersion) {
                await client.prisma.coAuthors.update({
                    where: {
                        id: coAuthor.id
                    },
                    data: {
                        publicationVersion: {
                            connect: {
                                id: linkedVersion.id
                            }
                        },
                        publication: {
                            disconnect: true
                        }
                    },
                    include: {
                        publicationVersion: true
                    }
                });
            }
        }
    }
};

migrateToVersionedPublications()
    .then(() =>
        console.log(`Done`)
    )
    .catch((error) => console.log(error));