import React from 'react';

import * as Interfaces from '@interfaces';

type Props = {
    reference: Interfaces.Reference;
    loading: boolean;
}

const EditReference: React.FC<Props> = (props): React.ReactElement => {
    return (
        <p> {props.reference.id} </p>
    )
}

export default EditReference;