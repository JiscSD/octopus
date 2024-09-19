import * as client from 'lib/client';

import * as I from 'interface';

export const upsert = (request: I.UpdateVerificationInformation) =>
    client.prisma.verification.upsert({
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

export const find = (orcid: string) => client.prisma.verification.findUnique({ where: { orcid } });

export const deleteVerification = (orcid: string) => client.prisma.verification.delete({ where: { orcid } });

export const incrementAttempts = (orcid: string) =>
    client.prisma.verification.update({
        where: { orcid },
        data: {
            attempts: {
                increment: 1
            }
        }
    });
