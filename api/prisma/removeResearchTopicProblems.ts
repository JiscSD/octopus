import * as client from 'lib/client';
import * as publicationService from 'components/publication/service';

const removeResearchTopicProblems = async (): Promise<number> => {
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

    // delete all research problems where id matches
    // all their links will be deleted in cascade
    const { count } = await client.prisma.publication.deleteMany({
        where: {
            id: {
                in: researchTopicProblems.map((problem) => problem.id)
            }
        }
    });

    return count;
};

removeResearchTopicProblems()
    .then((deletedProblemsCount) => console.log(`Successfully deleted ${deletedProblemsCount} research problems`))
    .catch((error) => console.log(error));
