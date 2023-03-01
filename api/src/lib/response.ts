import * as I from 'interface';

type Jsonify<T> = T extends {toJSON(): infer U}
  ? U
  : T extends object
  ? {
      [k in keyof T]: Jsonify<T[k]>;
    }
  : T;

export const json = <T>(statusCode: number, body: Jsonify<T>): I.JSONResponse => ({
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
