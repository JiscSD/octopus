import React from 'react';

import * as Types from '@/types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const { id: requestedId, ...rest } = context.query;
    const otherQueryParams = Object.keys(rest)
        .filter((key) => !!rest[key])
        .map((key) => `${key}=${rest[key]}`);
    return {
        redirect: {
            destination: `/publications/${requestedId}/versions/latest${otherQueryParams.length ? '?' + otherQueryParams.join('&') : ''}`,
            permanent: true
        }
    };
};

const Publication: Types.NextPage = (): React.ReactElement => <></>;

export default Publication;
