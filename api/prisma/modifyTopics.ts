import * as client from '../src/lib/client';
import * as fs from 'fs';

// Modify topics provided in an input file.
// There are 4 types of operation that might be done, with a function for each.
// This script should read a JSON file and deal with each entry in the file appropriately based on its specified "action". E.g.:
/**
 * {
 *    action: 'rename',
 *    topicId: 'test',
 *    name: 'Mathematics'
 * }
 *
 */

type ModifyTopicData = {
    action: 'delete' | 'merge' | 'change parent' | 'rename';
    topicId: string;
};

interface DeletionData extends ModifyTopicData {
    action: 'delete';
}

interface MergeData extends ModifyTopicData {
    action: 'merge';
    mergeTargetTopicId: string;
}

interface ChangeParentData extends ModifyTopicData {
    action: 'change parent';
    newParentId: string;
}

interface RenameData extends ModifyTopicData {
    action: 'rename';
    newTitle: string;
}

type BulkData = (DeletionData | MergeData | ChangeParentData | RenameData)[];

type Environment = 'int' | 'prod';

const readDataFromFile = (
    environment: Environment = 'int'
): {
    data: BulkData;
    error?: string;
} => {
    const inputFileName = 'prisma/modifyTopics.json';

    if (!fs.existsSync(inputFileName)) {
        return {
            data: [],
            error: `Input file "${inputFileName}" not found.`
        };
    }

    const fileData = JSON.parse(fs.readFileSync(inputFileName, 'utf8'));
    const mappedData = fileData.map((modification) => {
        let extraFields;

        switch (modification.modificationType) {
            case 'rename':
                extraFields = {
                    newTitle: modification.newName
                };
                break;
            case 'change parent':
                extraFields = {
                    newParentId: modification[environment + 'NewParentOrMergeTargetId']
                };
                break;
            case 'merge':
                extraFields = {
                    mergeTargetTopicId: modification[environment + 'NewParentOrMergeTargetId']
                };
                break;
        }

        return {
            action: modification.modificationType,
            topicId: modification[environment + 'TopicId'],
            ...extraFields
        };
    });

    return {
        data: mappedData
    };
};

type OperationResponse = {
    success: boolean;
    message?: string;
};

const deleteTopic = async (topicId: string, dryRun?: boolean): Promise<OperationResponse> => {
    const failureMessageBase = `Failed to delete topic ${topicId}: `;

    try {
        const topic = await client.prisma.topic.findUnique({
            where: {
                id: topicId
            },
            select: {
                title: true,
                _count: {
                    select: {
                        children: true,
                        publicationVersions: true
                    }
                }
            }
        });

        if (!topic) {
            return {
                success: false,
                message: failureMessageBase + 'topic not found'
            };
        }

        if (topic._count.children) {
            return {
                success: false,
                message: failureMessageBase + 'has child topic(s)'
            };
        }

        if (topic._count.publicationVersions) {
            return {
                success: false,
                message: failureMessageBase + 'has child publication(s)'
            };
        }

        if (!dryRun) {
            await client.prisma.topic.delete({
                where: {
                    id: topicId
                }
            });
        }

        return {
            success: true,
            message: dryRun ? `Successful deletion of topic ${topicId} (${topic.title}).` : ''
        };
    } catch (err) {
        return {
            success: false,
            message: err
        };
    }
};

const renameTopic = async (topicId: string, newTitle: string, dryRun?: boolean): Promise<OperationResponse> => {
    try {
        const topic = await client.prisma.topic.findUnique({
            where: {
                id: topicId
            },
            select: {
                title: true
            }
        });

        if (!topic) {
            return {
                success: false,
                message: `Failed to rename topic ${topicId}: topic does not exist`
            };
        }

        if (!dryRun) {
            await client.prisma.topic.update({
                where: {
                    id: topicId
                },
                data: {
                    title: newTitle
                }
            });
        }

        return {
            success: true,
            message: dryRun ? `Successful rename of topic ${topicId} from "${topic.title}" to "${newTitle}` : ''
        };
    } catch (err) {
        return {
            success: false,
            message: err
        };
    }
};

const changeTopicParent = async (
    topicId: string,
    newParentId: string,
    dryRun?: boolean
): Promise<OperationResponse> => {
    const failureMessageBase = `Failed to change parent of topic ${topicId} to ${newParentId}: `;

    try {
        const topic = await client.prisma.topic.findUnique({
            where: {
                id: topicId
            },
            select: {
                title: true,
                parents: {
                    select: {
                        id: true,
                        title: true
                    }
                }
            }
        });

        if (!topic) {
            return {
                success: false,
                message: failureMessageBase + 'topic does not exist'
            };
        }

        const parentTopic = await client.prisma.topic.findUnique({
            where: {
                id: newParentId
            }
        });

        if (!parentTopic) {
            return {
                success: false,
                message: failureMessageBase + 'new parent topic does not exist'
            };
        }

        if (!dryRun) {
            await client.prisma.topic.update({
                where: {
                    id: topicId
                },
                data: {
                    parents: {
                        connect: {
                            id: newParentId
                        }
                    }
                }
            });
        }

        return {
            success: true,
            message: dryRun ? `Successful parent change of topic ${topicId} (${topic.title}) to ${newParentId}` : ''
        };
    } catch (err) {
        return {
            success: false,
            message: err
        };
    }
};

const mergeTopic = async (
    topicId: string,
    mergeTargetTopicId: string,
    dryRun?: boolean
): Promise<OperationResponse> => {
    const failureMessageBase = `Failed to merge topic ${topicId} into ${mergeTargetTopicId}: `;

    try {
        const topic = await client.prisma.topic.findUnique({
            where: {
                id: topicId
            },
            select: {
                title: true,
                children: {
                    select: {
                        id: true,
                        parents: {
                            select: {
                                id: true
                            }
                        }
                    }
                },
                publicationVersions: {
                    select: {
                        id: true,
                        topics: true
                    }
                }
            }
        });

        if (!topic) {
            return {
                success: false,
                message: failureMessageBase + 'topic does not exist'
            };
        }

        const mergeTargetTopic = await client.prisma.topic.findUnique({
            where: {
                id: mergeTargetTopicId
            },
            select: {
                title: true,
                publicationVersions: {
                    select: {
                        id: true
                    }
                }
            }
        });

        if (!mergeTargetTopic) {
            return {
                success: false,
                message: failureMessageBase + 'merge target topic does not exist'
            };
        }

        if (!dryRun) {
            // Reassign child topics
            if (topic.children.length) {
                for (const child of topic.children) {
                    // IDs of parent topics, minus the topic we are merging in, plus the merge target topic.
                    // In other words, the final parent IDs of the child topic being reassigned.
                    const newParentIds = [
                        ...child.parents.filter((parent) => parent.id !== topicId).map((parent) => parent.id),
                        mergeTargetTopicId
                    ];
                    await client.prisma.topic.update({
                        where: {
                            id: child.id
                        },
                        data: {
                            parents: {
                                set: newParentIds.map((parentId) => ({
                                    id: parentId
                                }))
                            }
                        }
                    });
                }
            }

            // Reassign child publication versions
            if (topic.publicationVersions.length) {
                await client.prisma.topic.update({
                    where: {
                        id: mergeTargetTopicId
                    },
                    data: {
                        publicationVersions: {
                            connect: topic.publicationVersions.map((version) => ({
                                id: version.id
                            }))
                        }
                    }
                });
            }

            // Delete original topic
            await client.prisma.topic.delete({
                where: {
                    id: topicId
                }
            });
        }

        let dryRunMessage = `Successful merge of topic ${topicId} (${topic.title}) to ${mergeTargetTopicId} (${mergeTargetTopic.title})`;
        dryRunMessage += topic.children.length
            ? ` (${topic.children.length} child topic${topic.children.length > 1 ? 's' : ''} reassigned)`
            : '';
        dryRunMessage += topic.publicationVersions.length
            ? ` (${topic.publicationVersions.length} child publication${
                  topic.publicationVersions.length > 1 ? 's' : ''
              } reassigned)`
            : '';

        return {
            success: true,
            message: dryRun ? dryRunMessage : ''
        };
    } catch (err) {
        return {
            success: false,
            message: err
        };
    }
};

const processData = async (
    environment: Environment,
    testData?: BulkData,
    dryRun?: boolean
): Promise<{
    processedSuccessfully: number;
    total: number;
    errors: boolean;
    messages?: string[];
}> => {
    let data: BulkData = [];

    if (!testData) {
        const fileData = readDataFromFile(environment);

        if (fileData.error) {
            return {
                processedSuccessfully: 0,
                total: 0,
                errors: true,
                messages: [fileData.error]
            };
        }

        data = fileData.data;
    } else {
        data = testData;
    }

    const messages: string[] = [];
    let errors = false;
    let processedSuccessfully = 0;

    for (const topic of data) {
        let result: OperationResponse = { success: false };

        switch (topic.action) {
            case 'delete':
                result = await deleteTopic(topic.topicId, dryRun);
                break;
            case 'rename':
                result = await renameTopic(topic.topicId, topic.newTitle, dryRun);
                break;
            case 'change parent':
                result = await changeTopicParent(topic.topicId, topic.newParentId, dryRun);
                break;
            case 'merge':
                result = await mergeTopic(topic.topicId, topic.mergeTargetTopicId, dryRun);
                break;
        }

        if (!result.success) {
            errors = true;
            messages.push(result.message ?? `Unknown "${topic.action}" error for topic ${topic.topicId}`);
        } else {
            processedSuccessfully++;

            if (dryRun) {
                messages.push(result.message ?? `Successful "${topic.action}" for topic ${topic.topicId}`);
            }
        }
    }

    return {
        processedSuccessfully,
        total: data.length,
        errors,
        messages
    };
};

processData('int', undefined, true)
    .then((response) => console.log(response))
    .catch((err) => console.log(err));
