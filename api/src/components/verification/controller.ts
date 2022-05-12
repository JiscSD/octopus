import * as verificationService from 'verification/service';
import * as userService from 'user/service';
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

        // store code with user orcid and email
        await verificationService.upsert({
            orcid: event.pathParameters.id,
            code,
            email: event.queryStringParameters.email
        });

        // generate email
        await email.verificationCode({
            to: event.queryStringParameters.email,
            code
        });

        return response.json(200, { message: 'OK' });
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const confirmCode = async (
    event: I.AuthenticatedAPIRequest<I.ConfirmVerificationCodeParameters, undefined, I.GetUserParameters>
) => {
    try {
        const verification = await verificationService.find(event.pathParameters.id);

        if (!verification) {
            return response.json(404, { message: 'Not found' });
        }

        // TODO: Check if code has expired

        // TODO: Failed attempts

        if (verification.code === event.body?.code) {
            // Valid code received, delete verification from db
            await verificationService.deleteVerification(verification.orcid);

            // Update the user email
            await userService.updateEmail(verification.orcid, verification.email);

            return response.json(200, { message: 'OK' });
        }

        return response.json(400, { message: 'Bad request' });
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
