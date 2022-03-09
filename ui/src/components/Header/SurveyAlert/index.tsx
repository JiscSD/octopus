import React from 'react';

import * as Components from '@components';

const SurveyAlert: React.FC = (): JSX.Element => (
    <div className="mb-4 bg-teal-200 py-3 text-center text-grey-800 transition-colors duration-500 dark:bg-teal-700 dark:text-grey-100">
        <p>
            This platform is under active development. We need your{' '}
            <Components.Link href="https://forms.office.com/r/DhYd8AdHkx" openNew={true}>
                <span className="underline">feedback</span>
            </Components.Link>{' '}
            to help make it better.
        </p>
    </div>
);

export default SurveyAlert;
