import React from 'react';

import * as Helpers from '@/helpers';
import * as Types from '@/types';

type Props = {
    additionalInformation: {
        title: string;
        url: string;
        description?: string;
    };
    publicationLanguage?: Types.Languages;
};

const AdditionalInformationCard: React.FC<Props> = ({
    additionalInformation: { title, url, description },
    publicationLanguage: language
}): React.ReactElement => {
    const languageIfNotEnglish = language ? Helpers.languageIfNotEnglish(language) : undefined;
    return (
        <section
            lang={languageIfNotEnglish}
            className="w-full space-y-4 rounded bg-white-50 px-6 py-6 shadow transition-colors duration-500 dark:bg-grey-700"
            data-testid="additional-information-card"
        >
            <h3 className="font-montserrat font-bold text-grey-800 transition-colors duration-500 dark:text-white-100">
                {title}
            </h3>
            {description && (
                <p className="leading-relaxed text-grey-800 transition-colors duration-500 dark:text-grey-100">
                    {description}
                </p>
            )}
            <a
                href={url}
                title={title}
                aria-label={title}
                className="block text-sm font-semibold text-teal-600 underline transition-colors duration-500 dark:text-teal-300"
            >
                {url}
            </a>
        </section>
    );
};

export default AdditionalInformationCard;
