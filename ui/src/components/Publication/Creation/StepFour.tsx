import React from 'react';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Assets from '@assets';

const StepFour: React.FC = (): React.ReactElement | null => {
    const description = Stores.usePublicationCreationStore((state) => state.description);
    const updateDescription = Stores.usePublicationCreationStore((state) => state.updateDescription);
    const keywords = Stores.usePublicationCreationStore((state) => state.keywords);
    const updateKeywords = Stores.usePublicationCreationStore((state) => state.updateKeywords);
    const content: string = Stores.usePublicationCreationStore((state) => state.content);
    const updateContent = Stores.usePublicationCreationStore((state) => state.updateContent);

    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        setLoading(false);
    }, [content]);

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Main text" />
                {!loading ? (
                    <Components.TextEditor defaultContent={content} contentChangeHandler={updateContent} />
                ) : (
                    <div className="mt-16 flex animate-bounce justify-center">
                        <Assets.Logo width={60} height={60} className="fill-teal-500" />
                    </div>
                )}
            </div>

            <div>
                <Components.PublicationCreationStepTitle text="Description" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Include a short description of your publication to aid discovery. We recommend around 160 characters
                    in length.
                </span>
                <textarea
                    required
                    rows={5}
                    value={description}
                    onChange={(e) => updateDescription(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                ></textarea>
            </div>

            <div>
                <Components.PublicationCreationStepTitle text="Keywords" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Include up to 10 keywords relating to your content. These can be comma-separated and/or line
                    separated.
                </span>
                <textarea
                    required
                    rows={5}
                    value={keywords}
                    onChange={(e) => updateKeywords(e.target.value)}
                    className="block w-full rounded-md border border-grey-100 bg-white-50 text-grey-800 shadow outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                ></textarea>
            </div>
        </div>
    );
};

export default StepFour;
