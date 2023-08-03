import * as I from 'lib/interface';
import * as client from 'lib/client';
import * as publicationService from 'components/publication/service';
import * as topicService from 'components/topic/service';

const convertResearchTopics = async (): Promise<number> => {
    // get all research problems which need to be converted to research topics
    const researchTopicProblems = await publicationService.getResearchTopics();

    const createdTopics: (I.Topic & { publicationId: string })[] = []; // publicationId is needed for creating connections later on

    // create bare research topics for each research problem they correspond to
    for (const problem of researchTopicProblems) {
        const createdTopic = await topicService.create({
            title: problem.title || '',
            language: problem.language,
            parentIds: []
        });

        createdTopics.push({ ...createdTopic, publicationId: problem.id });
    }

    // create relations for each created topic
    for (let i = 0; i < createdTopics.length; i++) {
        const currentProblem = researchTopicProblems[i];
        const currentTopic = createdTopics[i];

        // find parents
        const parentTopics = createdTopics.filter((topic) =>
            currentProblem.linkedTo.some((link) => link.publicationToRef.id === topic.publicationId)
        );

        // find children
        const childTopics = createdTopics.filter((topic) =>
            currentProblem.linkedFrom.some((link) => link.publicationFromRef.id === topic.publicationId)
        );

        // find linked research problems which are not themselves topics
        const linkedProblems = currentProblem.linkedFrom
            .filter(
                (link) =>
                    link.publicationFromRef.type === 'PROBLEM' &&
                    !childTopics.some((childTopic) => childTopic.publicationId === link.publicationFromRef.id)
            )
            .map((link) => link.publicationFromRef.id);

        // check if the converted problem had some linked "HYPOTHESIS" children
        if (currentProblem.linkedFrom.some((link) => link.publicationFromRef.type === 'HYPOTHESIS')) {
            linkedProblems.push(currentProblem.id); // assign the research problem to it's corresponding research topic (to itself)
        }

        await client.prisma.topic.update({
            where: {
                id: currentTopic.id
            },
            data: {
                parents: {
                    connect: parentTopics?.map((topic) => ({ id: topic.id }))
                },
                children: {
                    connect: childTopics?.map((topic) => ({ id: topic.id }))
                },
                publications: {
                    connect: linkedProblems.map((problemId) => ({ id: problemId })) // assign linked research problems to the created topic
                }
            }
        });
    }

    return createdTopics.length;
};

convertResearchTopics()
    .then((createdTopicsCount) =>
        console.log(`Successfully converted ${createdTopicsCount} research problems to research topics`)
    )
    .catch((error) => console.log(error));
