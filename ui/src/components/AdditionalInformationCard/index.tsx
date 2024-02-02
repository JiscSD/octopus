import React from 'react';

type Props = {
    additionalInformation: {
        title: string;
        url: string;
        description?: string;
    };
};

const AdditionalInformationCard: React.FC<Props> = ({
    additionalInformation: { title, url, description }
}): React.ReactElement => (
    <section className="w-full space-y-4 rounded bg-white-50 px-6 py-6 shadow transition-colors duration-500 dark:bg-grey-700">
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

export default AdditionalInformationCard;
