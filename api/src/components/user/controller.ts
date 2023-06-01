import * as response from 'lib/response';
import * as userService from 'user/service';
import * as I from 'interface';

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
    try {
        const isAccountOwner = Boolean(event.user?.id === event.pathParameters.id);

        const user = isAccountOwner ? event.user : await userService.get(event.pathParameters.id);

        if (!user) {
            return response.json(400, { message: 'User not found' });
        }

        const userPublications = await userService.getPublications(
            event.pathParameters.id,
            event.queryStringParameters,
            isAccountOwner
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
