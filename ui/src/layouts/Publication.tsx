import React from 'react';

import * as Components from '@components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
};

const Publication: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.JumpToContent />
        <Components.SurveyWidget />
        <Components.Header fixed={props.fixedHeader} />
        <Components.Banner />
        <main className="container mx-auto px-8 py-6 lg:grid lg:py-16 xl:grid-cols-12 xl:gap-8 2xl:gap-16">
            {props.children}
        </main>
        <Components.Footer waves={true} />
    </>
);

export default Publication;
