import * as verificationService from 'verification/service';
import * as userService from 'user/service';
import * as response from 'lib/response';
import * as email from 'lib/email';
import * as I from 'interface';
import moment from 'moment';

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

        // If code has expired, remove it from the database and return appropriate error
        if (moment().diff(verification.createdAt, 'minutes') > Number(process.env.VALIDATION_CODE_EXPIRY)) {
            await verificationService.deleteVerification(verification.orcid);
            return response.json(404, { message: 'Not found' });
        }

        if (verification.code === event.body?.code) {
            // Valid code received, delete verification from db
            await verificationService.deleteVerification(verification.orcid);

            // Update the user email
            await userService.updateEmail(verification.orcid, verification.email);

            return response.json(200, { message: 'OK' });
        }

        const increment = await verificationService.incrementAttempts(verification.orcid);

        // Expire code on repeated failures to enter correct value
        if (increment.attempts >= Number(process.env.VALIDATION_CODE_ATTEMPTS)) {
            await verificationService.deleteVerification(verification.orcid);
            return response.json(404, { message: 'Not found' });
        }

        return response.json(422, { message: 'Incorrect code' });
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
