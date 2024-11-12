import React from 'react';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Stores from '@/stores';
import * as Types from '@/types';

type Props = {
    authorIds: string[];
    publicationId: string;
    publicationType: Types.PublicationType;
};

const HeaderActions: React.FC<Props> = (props) => {
    const { user } = Stores.useAuthStore();

    return user ? (
        <div className="col-span-8 mb-10 pb-10 flex flex-col md:flex-row gap-4 md:gap-8 border-b border-grey-200">
            {Helpers.linkedPublicationTypes[props.publicationType as keyof typeof Helpers.linkedPublicationTypes].map(
                (childPublicationType) => {
                    return (
                        <Components.Button
                            variant="block"
                            title={`Write a linked ${Helpers.formatPublicationType(childPublicationType as Types.PublicationType)}`}
                            key={childPublicationType}
                            href={`${Config.urls.createPublication.path}?for=${props.publicationId}&type=${childPublicationType}`}
                            openNew={true}
                        />
                    );
                }
            )}
            {!props.authorIds.includes(user.id) && (
                <Components.Button
                    title="Write a review"
                    variant="block"
                    href={`${Config.urls.createPublication.path}?for=${props.publicationId}&type=PEER_REVIEW`}
                    openNew={true}
                />
            )}
        </div>
    ) : null;
};

export default HeaderActions;
