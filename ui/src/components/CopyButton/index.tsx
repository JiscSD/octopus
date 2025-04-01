import React, { useState } from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@/components';
import * as Stores from '@/stores';

type Props = {
    id?: string;
    className?: string;
    textToCopy: string;
    title: string;
};

const CopyButton: React.FC<Props> = (props): React.ReactElement => {
    const [copied, setCopied] = useState(false);
    const setToast = Stores.useToastStore((state) => state.setToast);

    const confirmationMessage = 'Copied!';

    const handleCopy = () => {
        navigator.clipboard.writeText(props.textToCopy).then(() => {
            setCopied(true);
            setToast({
                visible: true,
                title: confirmationMessage,
                message: null,
                icon: <OutlineIcons.DocumentDuplicateIcon className="h-6 w-6 text-teal-400" />,
                dismiss: false
            });
        });
    };

    return (
        <>
            <span className="sr-only" aria-live="polite">
                {copied && confirmationMessage}
            </span>
            <Components.IconButton
                className={props.className}
                icon={<OutlineIcons.DocumentDuplicateIcon className="h-4 w-4" />}
                title={props.title}
                onClick={handleCopy}
            />
        </>
    );
};

export default CopyButton;
