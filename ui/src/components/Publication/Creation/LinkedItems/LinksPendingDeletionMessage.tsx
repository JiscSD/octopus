import React from 'react';

const LinksPendingDeletionMessage: React.FC<{ publicationTitles: string[] }> = (props): React.ReactElement => {
    const hasPublications = props.publicationTitles.length > 0;

    return (
        <>
            {hasPublications ? (
                <>
                    <p className="mt-2 text-sm font-semibold text-grey-700">
                        Links to the following publications will be deleted upon publish:
                    </p>
                    <ul className="mt-2 mx-auto w-min text-sm text-grey-700 list-disc">
                        {props.publicationTitles.map((title) => (
                            <li key={title} className="whitespace-nowrap text-left">
                                {title}
                            </li>
                        ))}
                    </ul>
                </>
            ) : null}
        </>
    );
};

export default LinksPendingDeletionMessage;
