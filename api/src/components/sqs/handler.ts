import axios from 'axios';

import * as email from 'lib/email';

export const generatePDFs = async (event): Promise<void> => {
    for (const record of event.Records) {
        const { body } = record;

        try {
            await axios.get(
                `https://${process.env.STAGE}.api.octopus.ac/v1/publications/${body}/pdf?generateNewPDF=true`
            );
        } catch (err) {
            console.log(err);
            // Send notification when PDF has failed to generate
            const message = `PDF generation for publication with ID ${body} has failed. Please check the function logs.`;
            await email.send({
                to: process.env.SLACK_CHANNEL_EMAIL || '',
                subject: 'A PDF has failed to generate',
                html: `<html><body><p>${message}</p></body></html>`,
                text: message
            });
        }
    }
};
