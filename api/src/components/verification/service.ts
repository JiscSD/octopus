import * as client from 'lib/client';

import * as I from 'interface';

export const upsert = async (request: I.UpdateVerificationInformation) => {
    const verification = await client.prisma.verification.upsert({
        select: {
            id: true,
            orcid: true,
            code: true,
            email: true,
            createdAt: true,
            updatedAt: true
        },
        where: {
            orcid: request.orcid
        },
        update: {
            email: request.email,
            code: request.code
        },
        create: {
            orcid: request.orcid,
            email: request.email,
            code: request.code
        }
    });

    return verification;
};

export const find = async (orcid: string) => {
    const verification = await client.prisma.verification.findUnique({ where: { orcid } });
    return verification;
};

export const deleteVerification = async (orcid: string) => {
    await client.prisma.verification.delete({ where: { orcid } });
};
