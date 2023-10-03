import React from 'react';
import BarLoader from 'react-spinners/BarLoader';

type Props = {
    loading: boolean;
};

const ModalBarLoader: React.FC<Props> = (props) => {
    return (
        <BarLoader
            loading={props.loading}
            color="#4ea5cb"
            cssOverride={{ width: '100%', position: 'absolute' }}
            height="0.25rem"
        />
    );
};

export default ModalBarLoader;
