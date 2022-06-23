import React from 'react';

import * as Components from '@components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
    publicationId?: string;
};

const Publication: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.JumpToContent />
        <Components.SurveyWidget />
        <Components.Header fixed={props.fixedHeader} />
        {props.publicationId && (
            <div className="container mx-auto hidden px-8 pt-6 print:hidden lg:block lg:pt-16">
                <Components.PublicationVisulization id={props.publicationId} />
            </div>
        )}
        <main className="container mx-auto px-8 pb-6 pt-4 lg:grid lg:pb-16 lg:pt-8 xl:grid-cols-12 xl:gap-8 2xl:gap-16">
            {props.children}
        </main>
        <Components.Footer waves={true} />
    </>
);

export default Publication;
