import { NextPage } from 'next';

import * as Templates from '@templates';

const Error404: NextPage = () => {
    return <Templates.ErrorTemplate statusCode={404} title='Not found' content='Lorem ipsum' />;
};

export default Error404;
