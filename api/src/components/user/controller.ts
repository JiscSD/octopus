import * as Helpers from 'lib/helpers';
import * as I from 'interface';
import * as response from 'lib/response';
import * as eventService from 'event/service';
import * as publicationService from 'publication/service';
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

// Should only be called by a developer running a script.
export const createOrganisationalAccounts = async (
    users: I.CreateOrganisationalAccountInput[]
): Promise<string | Prisma.Result<typeof prisma.user, Prisma.UserCreateArgs, 'create'>[]> => {
    if (!(users.constructor === Array)) {
        return 'An array must be supplied.';
    }

    if (users.some((user) => !Object.prototype.hasOwnProperty.call(user, 'name'))) {
        return 'Please provide a name for all accounts.';
    }

    // Validate email address
    if (users.some((user) => user.email && !Helpers.validateEmail(user.email))) {
        return 'Supplied email addresses must be valid.';
    }

    const inputData = users.map((user) => ({
        firstName: user.name,
        role: 'ORGANISATION' as I.Role,
        email: user.email,
        ror: user.ror,
        url: user.url
    }));

    return await userService.createManyUsers(inputData);
};

// Should only be called by a developer running a script.
export const updateOrganisationalAccount = async (
    id: string,
    user: I.UpdateOrganisationalAccountInput,
    regenerateApiKey = false
): Promise<string | Prisma.Result<typeof prisma.user, Prisma.UserUpdateArgs, 'update'>> => {
    // Verify that the user is an organisational user.
    // Other types of user shouldn't be updatable other than by getting their latest data from orcid.
    const dbUser = await userService.get(id);

    if (!dbUser || dbUser.role !== 'ORGANISATION') {
        return 'The supplied user ID does not belong to an existing organisational account.';
    }

    // Validate email address
    if (user.email && !Helpers.validateEmail(user.email)) {
        return 'Supplied email address must be valid.';
    }

    // Verify that defaultPublicationId refers to a publication owned by this account.
    if (user.defaultPublicationId) {
        const defaultPublication = await publicationService.get(user.defaultPublicationId);

        if (!defaultPublication) {
            return 'Default publication not found.';
        }

        if (!defaultPublication.versions.some((version) => version.user.id === id)) {
            return 'Default publication is not owned by this user.';
        }
    }

    // Verify that at least one applicable field is being updated.
    if (!(user.name || user.email || user.ror || user.url || user.defaultPublicationId || regenerateApiKey)) {
        return 'No applicable field values have been supplied.';
    }

    return await userService.updateUser(id, {
        ...(user.name && { firstName: user.name }),
        ...(user.email && { email: user.email }),
        ...(user.ror && { ror: user.ror }),
        ...(user.url && { url: user.url }),
        ...(user.defaultPublicationId && { defaultPublicationId: user.defaultPublicationId }),
        ...(regenerateApiKey && { apiKey: crypto.randomUUID() })
    });
};
