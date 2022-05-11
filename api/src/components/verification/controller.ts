import * as response from 'lib/response';
import * as email from 'lib/email';
import * as I from 'interface';

import cryptoRandomString from 'crypto-random-string';

export const requestCode = async (
    event: I.AuthenticatedAPIRequest<undefined, I.RequestVerificationCodeParameters, I.GetUserParameters>
) => {
    try {
        // generate code
        const code = cryptoRandomString({ length: 7, type: 'distinguishable' });

        // store code with user

        // generate email
        await email.verificationCode({
            to: event.queryStringParameters.email,
            code
        });

        return response.json(200, {});
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const confirmCode = async (
    event: I.AuthenticatedAPIRequest<I.ConfirmVerificationCodeParameters, undefined, I.GetUserParameters>
) => {
    try {
        return response.json(200, event);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
