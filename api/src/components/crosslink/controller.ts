import * as crosslinkService from 'crosslink/service';
import * as I from 'interface';
import * as publicationService from 'publication/service';
import * as response from 'lib/response';

export const create = async (
    event: I.AuthenticatedAPIRequest<I.CreateCrosslinkRequestBody, undefined, undefined>
): Promise<I.JSONResponse> => {
    try {
        const publicationA = await publicationService.get(event.body.publications[0]);
        const publicationB = await publicationService.get(event.body.publications[1]);

        if (!(publicationA && publicationB)) {
            return response.json(404, { message: 'One or both of the publications was not found' });
        }

        if (
            !(
                publicationA.versions.some((version) => version.currentStatus === 'LIVE') &&
                publicationB.versions.some((version) => version.currentStatus === 'LIVE')
            )
        ) {
            return response.json(400, { message: 'Both publications in a crosslink must be published' });
        }

        const existingCrosslink = await crosslinkService.getByPublicationPair(event.body.publications);

        if (existingCrosslink) {
            return response.json(400, { message: 'A crosslink already exists between these publications' });
        }

        const crosslink = await crosslinkService.create(event.body.publications, event.user.id);

        return response.json(200, crosslink);
    } catch {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
