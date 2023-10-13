import React from 'react';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    publicationVersions: Interfaces.PublicationVersion[];
};

const LatestPublications: React.FC<Props> = (props): React.ReactElement => (
    <>
        <Components.PageSubTitle text="Latest publications" />
        <h3 className="mb-6 block font-montserrat text-lg font-medium text-grey-700 transition-colors duration-500 dark:text-grey-50 ">
            See the latest publications that have been uploaded to Octopus
        </h3>

        {/** If there are no latest or there was an error, we do show an alert */}
        {props.publicationVersions.length ? (
            <Components.PublicationCarousel publicationVersions={props.publicationVersions} />
        ) : (
            <Components.Alert
                title="There was a problem fetching the latest publications"
                details={['Unable to show latest publications.']}
                severity="ERROR"
                allowDismiss={false}
            />
        )}
    </>
);

export default LatestPublications;
