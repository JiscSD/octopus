import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Assets from '@assets';
import * as Types from '@types';

const StepFour: React.FC = (): JSX.Element | null => {
    const content: string = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.content
    );
    const updateContent = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateContent
    );

    const [loading, setLoading] = React.useState(true);

    // We need to watch the content from the store as it goes from null to the default state of '' if this is a new publication.
    // Because of that, lets make use of it by adding a loading state with a loading icon
    React.useEffect(() => {
        setTimeout(() => setLoading(false), 800);
    }, [content]);

    return (
        <div className="border-b border-grey-100 pb-16 transition-colors duration-500 dark:border-grey-700">
            <h2 className="mb-6 block font-montserrat text-xl text-grey-800 transition-colors duration-500 dark:text-white">
                This publications full text
            </h2>
            {!loading ? (
                <Components.Editor content={content} changeCallback={updateContent} />
            ) : (
                <div className="mt-16 flex animate-bounce justify-center">
                    <Assets.Logo width={60} height={60} className="fill-teal-500" />
                </div>
            )}
        </div>
    );
};

export default StepFour;
