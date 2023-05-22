import axios from 'axios';

export const generatePDFs = async (event): Promise<object> => {
    for (const record of event.Records) {
        const { body } = record;

        try {
            await axios.get(`https://${process.env.STAGE}.api.octopus.ac/v1/publications/${body}/pdf`);
        } catch (err) {
            console.log(err);
        }
    }

    return {};
};
