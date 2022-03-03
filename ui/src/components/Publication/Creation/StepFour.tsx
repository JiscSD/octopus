import React from 'react';

import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Config from '@config';
import * as Stores from '@stores';
import * as Types from '@types';

const StepFour: React.FC = (): JSX.Element | null => {
    const content: string = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.content
    );
    const updateContent = Stores.usePublicationCreationStore(
        (state: Types.PublicationCreationStoreType) => state.updateContent
    );

    React.useEffect(() => {
        console.log(content);
    }, [content]);

    return content ? (
        <div>
            <Components.Editor content={content} changeCallback={updateContent} />
        </div>
    ) : null;
};

export default StepFour;
