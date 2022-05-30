import React from 'react';

import * as Components from '@components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
};

const Information: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.JumpToContent />
        <Components.SurveyWidget />
        <Components.Header fixed={props.fixedHeader} />
        <main className="container mx-auto px-8 pt-8 lg:gap-4 lg:pt-16">{props.children}</main>
        <Components.Footer waves={true} />
    </>
);

export default Information;
