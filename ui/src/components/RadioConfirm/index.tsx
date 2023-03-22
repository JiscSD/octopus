import React from 'react';
import * as Stores from '@stores';

type Props = {
    status: boolean | undefined;
    updateStatusTrue: () => void;
    updateStatusFalse: () => void;
};

const RadioConfirm: React.FC<Props> = (props): React.ReactElement => {
    return (
        <fieldset className="mb-2 space-x-6">
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="coi"
                    value="true"
                    id="coi-true"
                    checked={props.status}
                    onChange={() => props.updateStatusTrue()}
                />
                <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">Yes</span>
            </label>
            <label className="inline-flex items-center">
                <input
                    type="radio"
                    name="coi"
                    value="false"
                    id="coi-false"
                    checked={props.status === false}
                    onChange={() => props.updateStatusFalse()}
                />
                <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">No</span>
            </label>
        </fieldset>
    );
};

export default RadioConfirm;
