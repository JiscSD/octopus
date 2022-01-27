import React from 'react';
import ClickAwayListener from 'react-click-away-listener';

import * as Stores from '@stores';
import * as Types from '@types';

const CommandPalette: React.FC = (): JSX.Element => {
    const showCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.showCmdPalette);
    const toggleCmdPalette = Stores.useGlobalsStore((state: Types.GlobalsStoreType) => state.toggleCmdPalette);

    return (
        showCmdPalette && (
            <div>
                <ClickAwayListener onClickAway={() => toggleCmdPalette()}>
                    <p>hello</p>
                </ClickAwayListener>
            </div>
        )
    );
};

export default CommandPalette;
