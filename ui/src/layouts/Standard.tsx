import React from 'react';

import * as Components from '@components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
};

const Standard: React.FC<Props> = (props): JSX.Element => (
    <>
        <Components.JumpToContent />
        <Components.SurveyWidget />
        <Components.Header fixed={props.fixedHeader} />
        <main>{props.children}</main>
        <Components.Footer />
    </>
);

export default Standard;
