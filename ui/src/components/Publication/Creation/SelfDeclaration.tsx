import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';

const SelfDeclaration: React.FC = () => {
    const selfDeclaration = Stores.usePublicationCreationStore((state) => state.selfDeclaration);
    const updateSelfDeclaration = Stores.usePublicationCreationStore((state) => state.updateSelfDeclaration);

    return <div className="space-y-12 2xl:space-y-16">{/** do the thing */}</div>;
};

export default SelfDeclaration;
