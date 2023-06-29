import supertest from 'supertest';
import * as config from 'config';

let host;

switch (process.env.STAGE) {
    case 'local':
        host = 'https://api.localhost/local';
        break;
    case 'ci':
        host = 'docker-container-name';
        break;
    default:
    // should fail if no stage is set
}

export const agent = supertest.agent(`${host}/${config.versions.v1}`);

export const rollback = (): void => {};

export const migrate = (): void => {};

export const seed = (): void => {};
