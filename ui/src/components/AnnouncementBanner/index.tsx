import React from 'react';

import * as Components from '@/components';
import * as Stores from '@/stores';

type Props = { children: React.ReactNode };

const AnnouncementBanner: React.FC<Props> = (props: Props): React.ReactElement => {
    const { showAnnouncementBanner, toggleAnnouncementBanner } = Stores.usePreferencesStore();
    return showAnnouncementBanner ? (
        <div className="fixed bottom-0 w-full">
            <Components.Banner>
                <span className="flex font-montserrat items-center gap-4 p-2">
                    <span className="w-full">{props.children}</span>
                    <div className="flex">
                        <Components.Button variant="underlined" onClick={toggleAnnouncementBanner} title="Dismiss" />
                    </div>
                </span>
            </Components.Banner>
        </div>
    ) : (
        <></>
    );
};

export default AnnouncementBanner;
