import { ECSClient, RunTaskCommand, RunTaskCommandInput } from '@aws-sdk/client-ecs';

const client = new ECSClient();

export const runFargateTask = async (config: {
    clusterArn: string;
    containerOverride?: {
        command: string[];
        name: string;
    };
    securityGroups: string[];
    subnetIds: string[];
    taskDefinitionId: string;
}): Promise<void> => {
    const input: RunTaskCommandInput = {
        cluster: config.clusterArn,
        launchType: 'FARGATE',
        networkConfiguration: {
            awsvpcConfiguration: {
                securityGroups: config.securityGroups,
                subnets: config.subnetIds
            }
        },
        ...(config.containerOverride && {
            overrides: {
                containerOverrides: [
                    {
                        command: config.containerOverride.command,
                        name: config.containerOverride.name
                    }
                ]
            }
        }),
        taskDefinition: config.taskDefinitionId
    };
    const command = new RunTaskCommand(input);
    const response = await client.send(command);
    console.log(response);
};
