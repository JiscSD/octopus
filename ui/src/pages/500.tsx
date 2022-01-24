import { NextPage } from 'next';

import * as Templates from '@templates';

const Error500: NextPage = () => {
    return <Templates.ErrorTemplate statusCode={500} title="Internal serevr error" content="Lorem ipsum" />;
};

export default Error500;
