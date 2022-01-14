import * as utils from 'utilities';

beforeEach(() => {
    utils.test.rollback();
    utils.test.migrate();
    utils.test.seed();
});

describe('Publications', () => {
    test.todo('example test');
});
