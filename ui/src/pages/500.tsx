import { NextPage } from 'next';

import ErrorTemplate from 'src/templates/Error';

const Error500: NextPage = () => {
    return <ErrorTemplate statusCode={500} title='Internal serevr error' content='Lorem ipsum' />;
};

export default Error500;
