import { NextPage } from 'next';

import ErrorTemplate from 'src/templates/Error';

const Error404: NextPage = () => {
    return <ErrorTemplate statusCode={404} title='Not found' content='Lorem ipsum' />;
};

export default Error404;
