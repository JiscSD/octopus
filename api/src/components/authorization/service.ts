import JWT from 'jsonwebtoken';
import axios from 'axios';

import * as I from 'interface';
import * as client from 'lib/client';

const SECRET = process.env.JWT_SECRET as string;

export const createJWT = (user: I.User): string => {
    const jwt = JWT.sign(user, SECRET, { expiresIn: '8h' });
    return jwt;
};

export const validateJWT = (token: string) => {
    try {
        const decodedJWT = JWT.verify(token, SECRET);
        return decodedJWT as I.User;
    } catch (e) {
        console.log(e);
        return null;
    }
};

export const verifyOrcidAccess = async (orcid: string) => {
    const orcidAccessToken = (
        await client.prisma.user.findUnique({
            select: {
                orcidAccessToken: true
            },
            where: {
                orcid
            }
        })
    )?.orcidAccessToken;

    const orcidMemberApiUrl = process.env.ORCID_MEMBER_API_URL;

    // fetching ORCID user will throw an error if the token is revoked/invalid
    return axios.get(`${orcidMemberApiUrl}/${orcid}/record`, {
        headers: {
            Accept: 'application/json',
            Authorization: `Bearer ${orcidAccessToken}`
        }
    });
};

export const revokeOrcidAccess = async (orcid: string) => {
    const orcidAccessToken = (
        await client.prisma.user.findUnique({
            select: {
                orcidAccessToken: true
            },
            where: {
                orcid
            }
        })
    )?.orcidAccessToken;

    const orcidAuthUrl = process.env.ORCID_AUTH_URL;
    const clientId = process.env.ORCID_ID;
    const clientSecret = process.env.ORCID_SECRET;

    return axios.post(
        `${orcidAuthUrl}/revoke`,
        `client_id=${clientId}&client_secret=${clientSecret}&token=${orcidAccessToken}`,
        {
            headers: {
                Accept: 'application/json'
            }
        }
    );
};
