import React from 'react';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Types from '@types';

const SurveyAlert: React.FC = (): React.ReactElement => {
    const feedback = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.feedback);
    const toggleFeedback = Stores.usePreferencesStore((state: Types.PreferencesStoreTypes) => state.toggleFeedback);

    return (
        <Framer.motion.div
            initial={{ opacity: 0, translateX: '-100%' }}
            animate={{ opacity: 1, translateX: 0 }}
            transition={{ delay: 0.5 }}
            className={`fixed left-0 ${
                !feedback ? '-bottom-[14.25rem]' : 'bottom-0'
            } z-30 w-full rounded-tr-lg bg-teal-300 py-3 pl-6 pr-6 text-grey-800 transition-all duration-500 dark:bg-teal-700 dark:text-grey-100 print:hidden md:w-72`}
        >
            <button
                className="mb-3 block rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                name="Open Close Label"
                aria-label="Open Close Label"
                onClick={() => toggleFeedback()}
            >
                Help us improve Octopus
            </button>
            <button
                onClick={() => toggleFeedback()}
                name="Open Close icon"
                aria-label="Open Close icon"
                className="absolute top-[5.35%] right-5 rounded-full border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
            >
                {!feedback ? (
                    <OutlineIcons.ChevronUpIcon className="h-5 w-5 text-grey-800 transition-colors duration-500 dark:text-white-50" />
                ) : (
                    <OutlineIcons.XCircleIcon className="h-5 w-5 text-grey-800 transition-colors duration-500 dark:text-white-50" />
                )}
            </button>
            <span className="mb-2 block text-sm">
                We&apos;re still developing the platform, and your comments will help us identify any issues and
                opportunities for improvement.
            </span>
            <span className="mb-2 block text-sm">
                We need your{' '}
                <Components.Link href="https://forms.office.com/e/80g02emciH" openNew={true}>
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
        </Framer.motion.div>
    );
};

export default SurveyAlert;
