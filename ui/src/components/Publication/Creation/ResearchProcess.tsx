import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';

const ResearchProcess: React.FC = () => {
    const type = Stores.usePublicationCreationStore((state) => state.type);
    const selfDeclaration = Stores.usePublicationCreationStore((state) => state.selfDeclaration);
    const updateSelfDeclaration = Stores.usePublicationCreationStore((state) => state.updateSelfDeclaration);

    return (
        <>
            <Components.PublicationCreationStepTitle text="Pre-registration" />
            {type === 'HYPOTHESIS' && (
                <>
                    <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50 lg:w-2/3">
                        Indicate whether this hypothesis is being pre-registered. If selected, this marker tells readers
                        that your hypothesis has been published before any data was collected that might indicate
                        whether or not the hypothesis is supported.
                    </p>
                    <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50 lg:w-2/3">
                        Pre-registration of hypotheses helps avoid HARK-ing (Hypothesising After the Results are Known),
                        which is when your description of your original ideas are influenced by knowledge identified in
                        later research results. The smaller publication types on Octopus, which can be immediately
                        registered at each research stage, aim to further reduce the pressures to publish
                        &apos;positive&apos; results which neatly fit a narrative.
                    </p>
                </>
            )}
            {type === 'PROTOCOL' && (
                <>
                    <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50 lg:w-2/3">
                        Indicate whether this research method or protocol is being pre-registered. If selected, this
                        marker tells readers that your method or protocol has been published before any data was
                        collected according to it.
                    </p>
                    <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50 lg:w-2/3">
                        Pre-registration of methods, including a plan of how the results will be analysed, helps improve
                        the quality of research methods by allowing peer review before data is collected. Statistical
                        analysis plans also help avoid p-hacking, which is when you carry out many different statistical
                        tests and only report those which give &apos;positive&apos; results. It should also help give a
                        broader diversity of comparable results by allowing more researchers to collect data according
                        to the same method.
                    </p>
                    <p className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50 lg:w-2/3">
                        The smaller publication types on Octopus, which can be immediately registered at each research
                        stage, aim to further reduce the pressures to publish &apos;positive&apos; results which neatly
                        fit a narrative.
                    </p>
                </>
            )}
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
                        {type === 'PROTOCOL' && 'Results have not yet been collected according to this method.'}
                        {type === 'HYPOTHESIS' &&
                            'Results have not yet been collected to test this hypothesis (i.e. this is a pre-registration).'}
                    </span>
                </label>
            </fieldset>
        </>
    );
};

export default ResearchProcess;
