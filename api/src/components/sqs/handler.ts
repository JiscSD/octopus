import axios from 'axios';

export const generatePDFs = async (event): Promise<void> => {
    for (const record of event.Records) {
        const { body } = record;

        try {
            await axios.get(
                `https://${process.env.STAGE}.api.octopus.ac/v1/publications/${body}/pdf?generateNewPDF=true`
            );
        } catch (err) {
            console.log(err);
        }
    }
};
