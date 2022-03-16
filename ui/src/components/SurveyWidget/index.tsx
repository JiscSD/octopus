import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';

const SurveyAlert: React.FC = (): JSX.Element | null => {
    const feedback = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.feedback);
    const toggleFeedback = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.toggleFeedback);

    if (feedback)
        return (
            <Framer.motion.div
                initial={{ opacity: 0, transform: 'translateX(-100%)' }}
                animate={{ opacity: 1, transform: 'translateX(0)' }}
                transition={{ delay: 0.5 }}
                className="fixed left-0 bottom-0 z-30 w-full rounded-tr-lg bg-teal-700 py-4 pl-6 pr-8 text-grey-100 transition-all duration-500 md:w-72"
            >
                <span className="mb-3 block ">Help us improve Octopus</span>
                <span className="mb-2 block text-sm">
                    We&apos;re still developing the platform, and your comments will help us identify any issues and
                    opportunities for improvement.
                </span>
                <span className="mb-2 block text-sm">
                    We need your{' '}
                    <Components.Link href="https://forms.office.com/r/DhYd8AdHkx" openNew={true}>
                        <span className="underline">feedback</span>
                    </Components.Link>{' '}
                    to help make it better.
                </span>
                <span className="block text-sm">
                    If you&apos;d like to get more involved with platform development, do consider joining the Octopus{' '}
                    <Components.Link
                        openNew={true}
                        href="https://www.jisc.ac.uk/get-involved/octopus-user-community"
                        className="underline"
                    >
                        <span>user community</span>
                    </Components.Link>
                    .
                </span>
                <button
                    onClick={() => toggleFeedback()}
                    className="absolute top-2 right-2 rounded-full border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <OutlineIcons.XCircleIcon className="h-5 w-5 text-white" />
                </button>
            </Framer.motion.div>
        );

    return null;
};

export default SurveyAlert;
