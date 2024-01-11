import * as response from 'lib/response';
import * as additionalInformationService from 'additionalInformation/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as Helpers from 'lib/helpers';
import * as I from 'interface';

export const create = async (
    event: I.AuthenticatedAPIRequest<
        I.CreateAdditionalInformationBody,
        undefined,
        I.CreateAdditionalInformationPathParams
    >
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist'
            });
        }

        // Ensure that the publication version is DRAFT
        if (publicationVersion?.currentStatus !== 'DRAFT') {
            return response.json(400, {
                message: 'You can only add additional information to a draft publication'
            });
        }

        // Ensure that current user owns this publication version
        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You cannot add additional information to a publication version you do not own'
            });
        }

        // Ensure URL is valid
        if (!Helpers.validateURL(event.body.url)) {
            return response.json(403, {
                message: 'You must supply a valid URL'
            });
        }

        // Create the additional information
        const additionalInformation = await additionalInformationService.create(
            event.pathParameters.publicationVersionId,
            event.body
        );

        return response.json(200, additionalInformation);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error' });
    }
};

export const deleteAdditionalInformation = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DeleteAdditionalInformationPathParams>
): Promise<I.JSONResponse> => {
    try {
        const publicationVersion = await publicationVersionService.getById(event.pathParameters.publicationVersionId);

        // Check that the publication version exists
        if (!publicationVersion) {
            return response.json(404, {
                message: 'This publication version does not exist.'
            });
        }

        // Ensure that the publication version is a draft
        if (publicationVersion.currentStatus !== 'DRAFT') {
            return response.json(400, {
                message: 'You cannot delete additional information from a publication version that is not a draft.'
            });
        }

        if (event.user.id !== publicationVersion.user.id) {
            return response.json(403, {
                message: 'You do not have permission to delete additional information from this publication version.'
            });
        }

        const additionalInformation = await additionalInformationService.deleteAdditionalInformation(
            publicationVersion.id,
            event.pathParameters.additionalInformationId
        );

        return response.json(200, additionalInformation);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
