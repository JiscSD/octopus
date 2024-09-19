import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@/components';

const Funders: React.FC = (): React.ReactElement => {
    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Funding" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Provide the details of any sources of funding for this work.
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    We recommend that where possible you use your funder&apos;s{' '}
                    <Components.Link
                        href="https://ror.org/"
                        openNew={true}
                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                    >
                        <span>ROR identifier</span>
                    </Components.Link>
                    . This ensures that consistent, accurate organisational data is displayed and enables more efficient
                    discovery and tracking of research outputs across institutions and funding bodies.
                </span>
                <Components.Button
                    title="Search for your organisation's ROR"
                    href="https://ror.org/"
                    openNew
                    endIcon={
                        <OutlineIcons.MagnifyingGlassIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                    }
                />
            </div>
            <Components.FunderForm />
        </div>
    );
};

export default Funders;
