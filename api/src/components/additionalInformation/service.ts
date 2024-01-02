import * as client from 'lib/client';
import * as I from 'interface';
import * as publicationVersionService from 'publicationVersion/service';

export const create = async (publicationVersionId: string, data: I.CreateAdditionalInformationBody) => {
    const additionalInformation = await client.prisma.additionalInformation.create({
        data: {
            publicationVersionId,
            ...data
        }
    });
    await publicationVersionService.update(publicationVersionId, { updatedAt: new Date().toISOString() });

    return additionalInformation;
};
