import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Types from '@types';

type Props = {
    severity: Types.Severity;
    title?: string;
    details?: string[];
    allowDismiss?: boolean;
    supportLink?: {
        text: string;
        url: string;
        external: boolean;
    };
    className?: string;
    children?: React.ReactNode;
};

const Alert: React.FC<Props> = (props): React.ReactElement => {
    const [show, setShow] = React.useState(false);
    const [classes, setClasses] = React.useState({
        title: '',
        details: '',
        icon: <></>,
        background: ''
    });

    React.useEffect(() => {
        let classesCopy = classes;

        switch (props.severity) {
            case 'WARNING':
                classesCopy.title = 'text-grey-800';
                classesCopy.details = 'text-grey-700';
                classesCopy.icon = (
                    <OutlineIcons.ExclamationIcon
                        className={`text h-5 w-5 text-grey-800 transition-colors duration-500 ${classes.icon}`}
                        aria-hidden="true"
                    />
                );
                classesCopy.background = 'bg-yellow-200 dark:bg-yellow-500';
                break;
            case 'ERROR':
                classesCopy.title = 'text-white-50 dark:text-white-50';
                classesCopy.details = 'text-white-100 dark:text-grey-50';
                classesCopy.icon = (
                    <OutlineIcons.XCircleIcon
                        className={`h-5 w-5 text-white-50 transition-colors duration-500 dark:text-white-50 ${classes.icon}`}
                        aria-hidden="true"
                    />
                );
                classesCopy.background = 'bg-red-500';
                break;
            case 'SUCCESS':
                classesCopy.title = 'text-grey-800 dark:text-white-50';
                classesCopy.details = 'text-grey-700 dark:text-white-50';
                classesCopy.icon = (
                    <OutlineIcons.CheckCircleIcon
                        className={`h-5 w-5 text-grey-800 transition-colors duration-500 dark:text-white-50 ${classes.icon}`}
                        aria-hidden="true"
                    />
                );
                classesCopy.background = 'bg-teal-300 dark:bg-teal-500';
                break;
            default:
                // Info
                classesCopy.title = 'text-white-100 dark:text-white-50';
                classesCopy.details = 'text-white-100 dark:text-grey-50';
                classesCopy.icon = (
                    <OutlineIcons.InformationCircleIcon
                        className={`h-5 w-5 text-white-100 transition-colors duration-500 dark:text-white-50 ${classes.icon}`}
                        aria-hidden="true"
                    />
                );
                classesCopy.background = 'bg-teal-700 dark:bg-teal-700';
        }

        setClasses(classesCopy);
        setShow(true);
    }, [props.severity, classes]);

    return (
        <Framer.AnimatePresence>
            {show && (
                <Framer.motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.35 }}
                    exit={{ opacity: 0 }}
                    className={`rounded-md p-4 pr-8 transition-colors duration-500 ${classes.background} ${
                        props.className ? props.className : ''
                    }`}
                >
                    <div className="grid grid-cols-20">
                        <div className="col-span-1 row-span-2 mr-4">{classes.icon}</div>
                        <div className="col-span-19">
                            {!!props.title && (
                                <h3 className={`text-sm font-medium transition-colors duration-500 ${classes.title}`}>
                                    {props.title}
                                </h3>
                            )}

                            {props.children}

                            {props.details && (
                                <div className={`mt-2 text-sm transition-colors duration-500 ${classes.details}`}>
                                    <ul role="list" className="list-disc space-y-1 pl-5">
                                        {props.details.map((detail) => (
                                            <li key={detail}>{detail}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {props.supportLink && (
                                <div className="mt-3 flex">
                                    <Components.Link
                                        href={props.supportLink.url}
                                        openNew={props.supportLink.external}
                                        className="mr-2 flex rounded outline-0 focus:ring-2 focus:ring-yellow-400"
                                    >
                                        <span className="rounded bg-grey-700 py-1 px-2 text-sm font-semibold text-white-50 transition-colors duration-500">
                                            {props.supportLink.text}
                                        </span>
                                    </Components.Link>
                                </div>
                            )}

                            {props.allowDismiss && (
                                <div className="mt-3 flex">
                                    <button
                                        type="button"
                                        onClick={() => setShow(false)}
                                        className="rounded bg-grey-700 py-1 px-2 text-sm font-semibold text-white-50 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400"
                                    >
                                        Dismiss
                                    </button>
                                </div>
                            )}
                        </div>
                    </div>
                </Framer.motion.div>
            )}
        </Framer.AnimatePresence>
    );
};

export default Alert;
