import React from 'react';

import * as Components from '@/components';
import * as Interfaces from '@/interfaces';
import * as Types from '@/types';

type SidebarCardProps = {
    publicationVersion: Interfaces.PublicationVersion;
    linkedFrom: Interfaces.LinkedFromPublication[];
    flags: Interfaces.Flag[];
    sectionList: {
        title: string;
        href: string;
    }[];
};

const SidebarCard: React.FC<SidebarCardProps> = (props): React.ReactElement => (
    <div className="w-full space-y-2 rounded bg-white-50 px-6 py-6 shadow transition-colors duration-500 dark:bg-grey-900">
        <Components.PublicationSidebarCardGeneral
            publicationVersion={props.publicationVersion}
            linkedFrom={props.linkedFrom}
            flags={props.flags}
        />
        <Components.PublicationSidebarCardActions publicationVersion={props.publicationVersion} />
        <Components.PublicationSidebarCardSections sectionList={props.sectionList} />
    </div>
);

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const requestedId = context.query.id;
    return {
        redirect: {
            destination: `/publications/${requestedId}/versions/latest`,
            permanent: true
        }
    };
};

const Publication: Types.NextPage = (): React.ReactElement => <></>;

export default Publication;
