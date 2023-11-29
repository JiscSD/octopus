import React from 'react';
import * as Types from '@types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    return {
        redirect: {
            destination: `/publications/${requestedId}/versions/latest`,
            permanent: true
        }
    };
};

const Publication: Types.NextPage = (): React.ReactElement => <></>;

export default Publication;
