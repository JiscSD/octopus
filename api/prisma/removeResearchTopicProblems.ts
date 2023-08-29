import * as client from 'lib/client';
import * as publicationService from 'components/publication/service';
import axios from 'axios';

const updateDoiState = (doi: string): Promise<unknown> => {
    console.log('Updating DOI:', doi);

    // registered/findable DOIs cannot be deleted
    // but we can update their state from "findable" to "registered" so they are not available anymore via the Public API
    // https://support.datacite.org/docs/doi-states
    return axios.put(
        `${process.env.DATACITE_ENDPOINT}/${doi}`,
        {
            data: {
                attributes: {
                    event: 'hide'
                }
            }
        },
        {
            auth: {
                username: process.env.DATACITE_USER as string,
                password: process.env.DATACITE_PASSWORD as string
            }
        }
    );
};

const removeResearchTopicProblems = async (): Promise<{ deletedCount: number; remainingCount: number }> => {
    // get all research topic problems which don't have hypothesis children
    const researchTopicProblems = await publicationService.getResearchTopics({
        linkedFrom: {
            none: {
                publicationFromRef: {
                    type: 'HYPOTHESIS'
                }
            }
        }
    });

    const toBeDeleted: string[] = [];

    // update DOIs in chunks
    const chunkSize = 10;

    for (let i = 0; i < researchTopicProblems.length; i += chunkSize) {
        const currentChunk = researchTopicProblems.slice(i, i + chunkSize);

        const promises = currentChunk.map((problem) =>
            updateDoiState(problem.doi).catch((error) => {
                console.log('Error updating DOI:', problem.doi);

                return error as Error;
            })
        );

        const results = await Promise.all(promises);

        results.forEach((result, index) => {
            if (!(result instanceof Error)) {
                toBeDeleted.push(currentChunk[index].id);
            }
        });
    }

    // delete all research problems where id matches
    // all their links will be deleted in cascade
    const { count: deletedCount } = await client.prisma.publication.deleteMany({
        where: {
            id: {
                in: toBeDeleted
            }
        }
    });

    const remainingCount = researchTopicProblems.length - deletedCount;

    return { deletedCount, remainingCount };
};

removeResearchTopicProblems()
    .then(({ deletedCount, remainingCount }) => {
        console.log(`Successfully deleted ${deletedCount} research problems.`);

        if (remainingCount) {
            console.log('Remaining research problems which could not be deleted:', remainingCount);
            console.log('Please check the logs above.');
        }
    })
    .catch((error) => console.log(error));
