import React from 'react';

import * as Interfaces from '@interfaces';
import * as Components from '@components';

type Props = {
    positiveActionCallback: (reference: Interfaces.Reference) => void;
    negativeActionCallback: () => void;
    reference: Interfaces.Reference;
    loading: boolean;
}

const EditReference: React.FC<Props> = (props): React.ReactElement => {
    return (
        <>
        <p> {props.reference.id} </p>
        <div className="mt-6 flex justify-between space-x-4">
                <Components.ModalButton
                    text="Cancel"
                    title="Cancel"
                    onClick={() => props.negativeActionCallback()}
                    disabled={props.loading}
                    actionType="NEGATIVE"
                />
                <Components.ModalButton
                    text="Save"
                    title="Save"
                    onClick={() => props.positiveActionCallback(props.reference)}
                    disabled={props.loading}
                    loading={props.loading}
                    actionType="POSITIVE"
                />
            </div>
        </>
    )
}

export default EditReference;