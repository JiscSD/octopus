export const getAll = (event): Promise<IArguments.JSONResponse> => {
    try {
        const publications = publicationService.getAll(event.queryStringParameters)
    } catch (err) {
        return response.json(500, { message: 'Unknown server error.' })
    }
};