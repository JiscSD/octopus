import React from 'react';
import * as Types from '@types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    return {
        redirect: {
            destination: `/publications/${requestedId}/versions/latest`, // this url might change in OC-391
            permanent: false
        }
    };
};

const Publication: Types.NextPage = (): React.ReactElement => <></>;

export default Publication;
