import axios from 'axios';

export const generatePDFs = async (event): Promise<object> => {
    const promises = event.Records.forEach(async (record) => {
        const { body } = record;
        console.log('Publication ID:', body);

        try {
            await axios.get(`https://${process.env.STAGE}.api.octopus.ac/v1/publications/${body}/pdf`);
        } catch (err) {
            console.log(err);
        }
    });

    await Promise.all(promises);

    return {};
};
