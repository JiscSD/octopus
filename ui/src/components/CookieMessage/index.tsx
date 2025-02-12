import React from 'react';

import * as Components from '@/components';
import * as Config from '@/config';
import * as Stores from '@/stores';

const CookieMessage: React.FC = (): React.ReactElement => {
    const { showCookieMessage, toggleCookieMessage } = Stores.usePreferencesStore();
    return showCookieMessage ? (
        <div className="fixed bottom-0 w-full">
            <Components.Banner>
                <span className="flex font-montserrat items-center gap-4 p-2">
                    <span className="w-full text-center">
                        This website uses strictly necessary cookies for site functionality. No personal data is
                        collected. To learn more, read our{' '}
                        <Components.Link
                            href={Config.urls.cookiePolicy.path}
                            openNew
                            className="underline underline-offset-4"
                        >
                            Cookie Policy
                        </Components.Link>
                        .
                    </span>
                    <div className="flex">
                        <Components.Button variant="underlined" onClick={toggleCookieMessage} title="Dismiss" />
                    </div>
                </span>
            </Components.Banner>
        </div>
    ) : (
        <></>
    );
};

export default CookieMessage;
