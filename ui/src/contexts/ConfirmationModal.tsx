import React, { createContext, PropsWithChildren, useCallback, useContext, useState } from 'react';
import * as Components from '@components';

type ConfirmationModalContextType = (
    description: string,
    title?: string,
    icon?: React.ReactNode,
    positiveButtonText?: string,
    cancelButtonText?: string
) => Promise<boolean>;

const initialValue: ConfirmationModalContextType = () => Promise.resolve(false);

const ConfirmationModalContext = createContext<ConfirmationModalContextType>(initialValue);
export const useConfirmationModal = () => useContext(ConfirmationModalContext);

const ConfirmationModalProvider = ({ children }: PropsWithChildren<{}>) => {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState<string>('Are you sure?');
    const [description, setDescription] = useState<string | null>(null);
    const [icon, setIcon] = useState<React.ReactNode>(null);
    const [positiveButtonText, setPositiveButtonText] = useState('Save');
    const [cancelButtonText, setCancelButtonText] = useState('Cancel');
    const [promise, setPromise] = useState<{
        resolve: (value: boolean) => void;
        reject: (reason: boolean) => void;
    } | null>(null);

    const confirmation = useCallback(
        (
            description: string,
            title?: string,
            icon?: React.ReactNode,
            positiveButtonText?: string,
            cancelButtonText?: string
        ): Promise<boolean> =>
            new Promise((resolve, reject) => {
                setDescription(description);
                setTitle(title ? title : 'Are you sure?');
                setIcon(icon ? icon : null);
                setPositiveButtonText(positiveButtonText ? positiveButtonText : 'Save');
                setCancelButtonText(cancelButtonText ? cancelButtonText : 'Cancel');
                setPromise({ resolve, reject });
                setOpen(true);
            }),
        []
    );

    const handlePositiveAction = useCallback(() => {
        if (promise) {
            promise.resolve(true);
            setOpen(false);
        }
    }, [promise]);

    const handleCancelAction = useCallback(() => {
        if (promise) {
            promise.resolve(false);
            setOpen(false);
        }
    }, [promise]);

    return (
        <ConfirmationModalContext.Provider value={confirmation}>
            {children}
            <Components.Modal
                open={open}
                setOpen={(open: boolean) => {
                    if (!open) {
                        handleCancelAction();
                    }
                }}
                icon={icon}
                title={title}
                positiveButtonText={positiveButtonText}
                cancelButtonText={cancelButtonText}
                positiveActionCallback={handlePositiveAction}
                negativeActionCallback={handleCancelAction}
            >
                <p className="text-gray-500 text-sm">{description}</p>
            </Components.Modal>
        </ConfirmationModalContext.Provider>
    );
};

export default ConfirmationModalProvider;
