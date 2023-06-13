
import * as client from '../src/lib/client';
import * as I from 'interface';

import { Prisma } from '@prisma/client';

const updateAffiliationFormat = (affiliations: I.LegacyAffiliation[]): I.MappedOrcidAffiliation[] => {
    const newAffiliations = affiliations.map(affiliation => {
        const now = Date.now();

        return {
            id: 'octopus-' + affiliation.id, // previously this was typed as a number but our old affiliations have string IDs
            affiliationType: "misc." as const,
            title: affiliation.name,
            departmentName: null,
            startDate: null,
            endDate: null,
            organization: {
                name: affiliation.name, // Is this right?
                address: {
                    city: affiliation.city,
                    region: null,
                    country: affiliation.country
                },
                'disambiguated-organization': affiliation.ror ? {
                    'disambiguated-organization-identifier': affiliation.ror,
                    'disambiguation-source': 'ROR'
                } : null,
            },
            createdAt: now,
            updatedAt: now,
            source: {
                name: 'placeholder', // TODO
                orcid: 'placeholder', // TODO
            },
            url: affiliation.link
        };
    });

    return newAffiliations;
};

// Converts old style affiliations (stored against the publication) to
// the new style (stored against the corresponding author).
const convertAffiliations = async (): Promise<void> => {
    // Get publications with old style affiliations.
    const publications = await client.prisma.publication.findMany({
        where: {
            affiliations: {
                some: {}
            }
        },
        include: {
            affiliations: true,
            coAuthors: true
        }
    });

    if (!publications.length) {
        console.log("No publications found with old affiliations style. Exiting.");

        return;
    }

    const errors: {publicationId: string, message: string}[] = [];

    for (const publication of publications) {
        // Map values to new structure.
        const newAffiliations = updateAffiliationFormat(publication.affiliations);
        const correspondingAuthor = publication.coAuthors?.find(
            coAuthor => coAuthor.linkedUser === publication.createdBy
        );

        // If there is a corresponding author, attach the affiliations to them.
        if (correspondingAuthor) {
            const affiliationsToAdd = correspondingAuthor.affiliations.concat(
                newAffiliations as unknown[] as Prisma.JsonArray
            );

            try {
                await client.prisma.coAuthors.update({
                    where: {
                        id: correspondingAuthor.id,
                    },
                    data: {
                        affiliations: affiliationsToAdd,
                        isIndependent: false
                    }
                });
                // Delete old affiliations.
                await client.prisma.affiliations.deleteMany({
                    where: {
                        publicationId: publication.id
                    }
                });
            } catch (err) {
                errors.push({
                    publicationId: publication.id,
                    message: err
                });
            }
        } else {
            // If there is not a corresponding author, create one using the publication's createdBy value.
            // Attach the affiliations to them, then attach them to the publication's coAuthors list in first position.
            try {
                const creator = await client.prisma.user.findUnique({
                    where: {
                        id: publication.createdBy
                    }
                });

                // Update the publication's coauthors in one transaction. Existing ones will only have their position
                // changed, and the only author created will be the corresponding author.
                const newCoAuthors = [{
                    email: creator?.email as string,
                    linkedUser: creator?.id as string,
                    affiliations: newAffiliations
                }, ...publication.coAuthors];
                await client.prisma.$transaction(
                    newCoAuthors.map((author, index) => 
                        client.prisma.coAuthors.upsert({
                            where: {
                                publicationId_email: {
                                    publicationId: publication.id,
                                    email: author.email
                                }
                            },
                            create: {
                                position: index,
                                email: author.email,
                                linkedUser: author.linkedUser,
                                affiliations: author.affiliations as unknown[] as Prisma.JsonArray,
                                isIndependent: false,
                                publicationId: publication.id,
                                confirmedCoAuthor: true,
                                approvalRequested: false
                            },
                            update: {
                                position: index
                            }
                        })
                    )
                );
                // Delete old affiliations.
                await client.prisma.affiliations.deleteMany({
                    where: {
                        publicationId: publication.id
                    }
                });
            } catch (err) {
                errors.push({
                    publicationId: publication.id,
                    message: err
                });
            }
        }

    }

    if (errors.length) {
        console.log('Errors have been found!');
        console.log(errors);
    } else {
        console.log('Converted affiliations successfully for ' + String(publications.length) + ' publications.');
    }
};

// await convertAffiliations().catch(error => console.log(error)).then(() => console.log('Finished'));
try {
    await convertAffiliations();
} catch (error) {
    console.log(error);
}