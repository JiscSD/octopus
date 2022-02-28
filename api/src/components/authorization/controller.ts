import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';

import * as userService from 'user/service';
import * as authorizationService from 'authorization/service';

export const authorize = async (event: I.APIRequest<I.AuthorizeRequestBody>): Promise<I.JSONResponse> => {
    try {
        const orcidRequest = await axios.post(
            'https://orcid.org/oauth/token',
            `client_id=${process.env.ORCID_ID}&client_secret=${process.env.ORCID_SECRET}&grant_type=authorization_code&redirect_uri=${process.env.UI_CALLBACK_URL}&code=${event.body.code}`
        );

        const userInformation = await axios.get(`https://orcid.org/${orcidRequest.data.orcid}/public-record.json`);

        const user = await userService.upsertUser(orcidRequest.data.orcid, {
            firstName: userInformation.data?.names?.givenNames?.value || '',
            lastName: userInformation.data?.names?.familyName?.value || ''
        });

        const token = authorizationService.createJWT(user);

        return response.json(200, token);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
