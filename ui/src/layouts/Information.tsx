import React from 'react';

import * as Components from '@/components';

type Props = {
    fixedHeader?: boolean;
    children: React.ReactNode;
};

const Information: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.JumpToContent />
        <Components.Header fixed={props.fixedHeader} />
        <main className="container mx-auto px-8 pt-8 lg:gap-4 lg:pt-16">
            <section className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 transition-colors duration-500 dark:text-white-50 lg:w-8/12">
                {props.children}
            </section>
        </main>
        <Components.Footer waves={true} />
    </>
);

export default Information;
