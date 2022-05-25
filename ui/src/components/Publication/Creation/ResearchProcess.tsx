import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';

const ResearchProcess: React.FC = () => {
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const selfDeclaration = Stores.usePublicationCreationStore((state) => state.selfDeclaration);
    const updateSelfDeclaration = Stores.usePublicationCreationStore((state) => state.updateSelfDeclaration);

    return (
        <>
            <Components.PublicationCreationStepTitle text="Self declaration" />
            <fieldset className="my-8 space-y-4">
                <label htmlFor="self-declaration" className="flex items-center space-x-2 hover:cursor-pointer">
                    <input
                        id="self-declaration"
                        aria-describedby={type}
                        name="self-declaration"
                        type="checkbox"
                        className="h-4 w-4 rounded border-grey-300 text-teal-600 outline-none transition-colors duration-150 hover:cursor-pointer focus:ring-yellow-500 disabled:text-grey-300 hover:disabled:cursor-not-allowed"
                        checked={selfDeclaration}
                        onChange={() => updateSelfDeclaration(!selfDeclaration)}
                    />
                    <span className="ml-2 text-grey-800 transition-colors duration-500 dark:text-white-50">
                        {type === 'PROTOCOL' && 'Data has not yet been collected according to this method/protocol.'}
                        {type === 'HYPOTHESIS' &&
                            'Data has not yet been collected to test this hypothesis (i.e. this is a preregistration)'}
                    </span>
                </label>
                {type === 'PROTOCOL' && (
                    <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                        This is similar to a &apos;registered report&apos;. Best research practice involves publishing
                        your protocol and allowing peer review of it before collecting data.
                    </span>
                )}
            </fieldset>
        </>
    );
};

export default ResearchProcess;
