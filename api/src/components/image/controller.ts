import * as response from 'lib/response';
import * as I from 'interface';

import * as imageService from 'image/service';

export const create = async (event: I.AuthenticatedAPIRequest<I.ImageSentBody>): Promise<I.JSONResponse> => {
    try {
        const imageType = event.body.image?.split(';')[0].split('/')[1];

        if (imageType !== 'png' && imageType !== 'jpeg' && imageType !== 'jpg') {
            return response.json(422, { message: 'Invalid' });
        }

        const imageReference = await imageService.createDBReference(event.body.name, imageType, event.user.id);

        await imageService.uploadToS3(imageReference.id, event.body.image, imageType);

        return response.json(201, imageReference);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const destroy = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, I.DestroyImagePathParams>
): Promise<I.JSONResponse> => {
    try {
        const image = await imageService.get(event.pathParameters.id);

        if (!image) {
            return response.json(404, { message: 'This image does not exist' });
        }

        if (image.user !== event.user.id) {
            return response.json(403, { message: 'You do not have permission to delete this image' });
        }

        const deletedImage = await imageService.destroy(event.pathParameters.id);

        return response.json(201, deletedImage);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getAll = async (event: I.AuthenticatedAPIRequest) => {
    try {
        const images = await imageService.getAll(event.user.id);

        return response.json(200, images);
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' });
    }
};
