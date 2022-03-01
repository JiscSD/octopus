import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';

import * as userService from 'user/service';
import * as authorizationService from 'authorization/service';

export const authorize = async (event: I.APIRequest<I.AuthorizeRequestBody>): Promise<I.JSONResponse> => {
    try {
        let callbackURL = '';
        switch (process.env.stage) {
            case 'local':
                callbackURL = 'https://localhost:3001/login';
                break;
            case 'prod':
                callbackURL = 'https://api.octopus.ac/login';
                break;
            default:
                callbackURL = `https://${process.env.stage}.api.octopus.ac/login`;
        }

        const orcidRequest = await axios.post(
            'https://orcid.org/oauth/token',
            `client_id=${process.env.ORCID_ID}&client_secret=${process.env.ORCID_SECRET}&grant_type=authorization_code&redirect_uri=${callbackURL}&code=${event.body.code}`
        );

        const ORCIDRequestPublicUserResponse = await axios.get(
            `https://orcid.org/${orcidRequest.data.orcid}/public-record.json`
        );
        const userInformation: I.ORCIDUser = ORCIDRequestPublicUserResponse.data;

        const user = await userService.upsertUser(orcidRequest.data.orcid, {
            firstName: userInformation.names?.givenNames?.value || '',
            lastName: userInformation.names?.familyName?.value || ''
        });

        const token = authorizationService.createJWT(user);

        return response.json(200, token);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
