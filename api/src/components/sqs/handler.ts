export const generatePDFs = (event): object => {
    event.Records.forEach((record) => {
        const { body } = record;
        console.log(body);
    });

    return {};
};
