import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as response from 'lib/response';
import * as eventService from 'event/service';
import * as topicService from 'topic/service';
import * as userService from 'user/service';
import { Prisma } from '@prisma/client';
import { prisma } from 'lib/client';
import * as crypto from 'crypto';

export const getAll = async (event: I.APIRequest<undefined, I.UserFilters>): Promise<I.JSONResponse> => {
    try {
        const users = await userService.getAll(event.queryStringParameters);

        return response.json(200, users);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (
    event: I.OptionalAuthenticatedAPIRequest<undefined, undefined, I.GetUserParameters>
): Promise<I.JSONResponse> => {
    try {
        // Authenticated account owners can retrieve private fields (such as email)
        const isAccountOwner = Boolean(event.user?.id === event.pathParameters.id);

        const user = await userService.get(event.pathParameters.id, isAccountOwner);

        if (!user) {
            return response.json(404, { message: 'User not found ' });
        }

        return response.json(200, user);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getPublications = async (
    event: I.OptionalAuthenticatedAPIRequest<undefined, I.UserPublicationsFilters, I.GetUserParameters>
): Promise<I.JSONResponse> => {
    const versionStatus = event.queryStringParameters?.versionStatus;
    const versionStatusArray = versionStatus ? versionStatus.split(',') : [];

    if (versionStatusArray.length && versionStatusArray.some((status) => !I.PublicationStatusEnum[status])) {
        return response.json(400, {
            message: "Invalid version status provided. Valid values include 'DRAFT', 'LIVE', 'LOCKED"
        });
    }

    try {
        const isAccountOwner = Boolean(event.user?.id === event.pathParameters.id);

        const user = isAccountOwner ? event.user : await userService.get(event.pathParameters.id);

        if (!user) {
            return response.json(400, { message: 'User not found' });
        }

        const userPublications = await userService.getPublications(
            event.pathParameters.id,
            event.queryStringParameters,
            isAccountOwner,
            versionStatusArray.length ? (versionStatusArray as I.PublicationStatusEnum[]) : undefined
        );

        return response.json(200, userPublications);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getUserList = async (event: I.APIRequest): Promise<I.JSONResponse> => {
    const apiKey = event.queryStringParameters?.apiKey;

    if (apiKey !== process.env.LIST_USERS_API_KEY) {
        return response.json(401, { message: "Please provide a valid 'apiKey'." });
    }

    try {
        const userList = await userService.getUserList();

        return response.json(200, userList);
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getUserControlRequests = async (event: I.AuthenticatedAPIRequest<undefined>): Promise<I.JSONResponse> => {
    const requesterId = event.user.id;

    try {
        const userControlRequests = await eventService.getMany({
            type: 'REQUEST_CONTROL',
            data: {
                path: ['requesterId'],
                equals: requesterId
            }
        });

        return response.json(200, userControlRequests);
    } catch (error) {
        console.log(error);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

type ValidationResult = { valid: true } | { valid: false; message: string };

const commonOrganisationalAccountValidation = async <
    T extends Pick<I.CreateOrganisationalAccountInput, 'email' | 'url' | 'defaultTopic'>
>(
    data: T,
    environment: I.Environment
): Promise<ValidationResult> => {
    if (data.email && !Helpers.validateEmail(data.email)) {
        return { valid: false, message: 'Supplied email addresses must be valid.' };
    }

    if (data.url && !Helpers.validateURL(data.url)) {
        return { valid: false, message: 'Supplied URLs must be valid.' };
    }

    if (data.defaultTopic) {
        const topicId = data.defaultTopic.ids[environment];
        const topic = await topicService.get(topicId);

        if (!topic) {
            return { valid: false, message: `Topic not found with ID ${topicId}.` };
        }

        if (topic && topic.title !== data.defaultTopic.title) {
            return {
                valid: false,
                message: `Topic found, but its title (${topic.title}) doesn't match the input data's title (${data.defaultTopic.title}).`
            };
        }
    }

    return { valid: true };
};

// Should only be called by a developer running a script.
export const createOrganisationalAccounts = async (
    users: I.CreateOrganisationalAccountInput[],
    environment: I.Environment = 'int'
): Promise<string | Prisma.Result<typeof prisma.user, Prisma.UserCreateArgs, 'create'>[]> => {
    if (!(users.constructor === Array)) {
        return 'An array must be supplied.';
    }

    const inputData: Prisma.UserUncheckedCreateInput[] = [];

    for (const user of users) {
        if (!Object.prototype.hasOwnProperty.call(user, 'name')) {
            return 'Please provide a name for all accounts.';
        }

        const validate = await commonOrganisationalAccountValidation(user, environment);

        if (!validate.valid) {
            return validate.message;
        }

        inputData.push({
            firstName: user.name,
            role: 'ORGANISATION' as I.Role,
            email: user.email,
            ror: user.ror,
            url: user.url,
            defaultTopicId: user.defaultTopic ? user.defaultTopic.ids[environment] : null
        });
    }

    return await userService.createManyUsers(inputData);
};

// Should only be called by a developer running a script.
type UpdateOrganisationalAccountResult = string | Prisma.Result<typeof prisma.user, Prisma.UserUpdateArgs, 'update'>;

export const updateOrganisationalAccounts = async (
    data: I.UpdateOrganisationalAccountInput[],
    environment: I.Environment = 'int'
): Promise<string | Array<UpdateOrganisationalAccountResult>> => {
    // Validate first.
    const invalidMessages: string[] = [];

    for (const user of data) {
        // Verify that the user is an organisational user.
        // Other types of user shouldn't be updatable other than by getting their latest data from orcid.
        const userId: string = user[environment + 'Id'];
        const dbUser = await userService.get(userId);

        if (!dbUser || dbUser.role !== 'ORGANISATION') {
            invalidMessages.push('The supplied user ID does not belong to an existing organisational account.');
        }

        // Verify that at least one applicable field is being updated.
        if (!(user.name || user.email || user.ror || user.url || user.defaultTopic || user.regenerateApiKey)) {
            invalidMessages.push('No applicable field values have been supplied.');
        }

        // Validate field values.
        const validateCommonFields = await commonOrganisationalAccountValidation(user, environment);

        if (!validateCommonFields.valid) {
            invalidMessages.push(validateCommonFields.message);
        }
    }

    if (invalidMessages.length) {
        return invalidMessages;
    }

    const output: Array<UpdateOrganisationalAccountResult> = [];

    try {
        for (const user of data) {
            output.push(
                await userService.updateUser(user[environment + 'Id'], {
                    ...(user.name && { firstName: user.name }),
                    ...(user.email && { email: user.email }),
                    ...(user.ror && { ror: user.ror }),
                    ...(user.url && { url: user.url }),
                    ...(user.defaultTopic && { defaultTopicId: user.defaultTopic.ids[environment] }),
                    ...(user.regenerateApiKey && { apiKey: crypto.randomUUID() })
                })
            );
        }
    } catch (error) {
        console.log(error);

        return 'Error updating organisational accounts.';
    }

    console.log('Successfully updated organisational accounts.');

    return output;
};
