import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Assets from '@assets';
import * as Types from '@types';

const StepFour: React.FC = (): React.ReactElement | null => {
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
        setLoading(false);
    }, [content]);

    return (
        <div className="pb-16 transition-colors duration-500 dark:border-grey-700">
            <Components.PublicationCreationStepTitle text="Main text" />
            <span className="mb-4 block text-xs leading-snug text-grey-700">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Quia placeat delectus soluta mollitia, non
                provident repudiandae, nobis possimus, id ipsam suscipit.
            </span>
            {!loading ? (
                // <Components.Editor content={content} changeCallback={updateContent} />
                <Components.TextEditor defaultContent={content} contentChangeHandler={updateContent} />
            ) : (
                <div className="mt-16 flex animate-bounce justify-center">
                    <Assets.Logo width={60} height={60} className="fill-teal-500" />
                </div>
            )}
        </div>
    );
};

export default StepFour;
