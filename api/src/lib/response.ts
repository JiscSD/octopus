import * as I from 'interface';

export const json = (statusCode: number, body): I.JSONResponse => ({
    body: JSON.stringify(body),
    headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    statusCode
});

export const unknownError = {
    body: JSON.stringify({ message: 'unknown error.' }),
    headers: {
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    },
    statusCode: 500
};
