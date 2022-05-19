import * as response from 'lib/response';
import * as userService from 'user/service';
import * as I from 'interface';

export const getAll = async (event: I.APIRequest<undefined, I.UserFilters>) => {
    try {
        const users = await userService.getAll(event.queryStringParameters);

        return response.json(200, users);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const get = async (event: I.OptionalAuthenticatedAPIRequest<undefined, undefined, I.GetUserParameters>) => {
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
    event: I.OptionalAuthenticatedAPIRequest<undefined, undefined, I.GetUserParameters>
) => {
    try {
        // Authenticated account owners can retrieve private fields (such as email)
        const isAccountOwner = Boolean(event.user?.id === event.pathParameters.id);

        const statuses: Array<I.ValidStatuses> = isAccountOwner ? ['DRAFT', 'LIVE'] : ['LIVE'];

        const userPublications = await userService.getPublications(event.pathParameters.id, statuses, isAccountOwner);

        if (!userPublications) {
            return response.json(404, { message: 'User not found' });
        }

        return response.json(200, userPublications);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
