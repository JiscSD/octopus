import React from 'react';
import * as SWR from 'swr';
import Image from 'next/image';
import * as Router from 'next/router';
import * as ReactRange from 'react-range';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Interfaces from '@interfaces';
import * as Components from '@components';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';

type ActionProps = {
    id: string;
    type: Types.PublicationType;
};

type RatingSelectorProps = {
    title: string;
    description: string;
    labels: string[];
    value?: number[];
    callback: (value: number[]) => void;
    disabled: boolean;
};

const RatingSelector: React.FC<RatingSelectorProps> = (props): React.ReactElement => (
    <div>
        <p className="mb-1 text-left font-montserrat text-base font-medium text-grey-700">{props.title}</p>
        <p className="mb-4 text-left font-montserrat text-xs text-grey-500">{props.description}</p>
        <div className="mb-12 grid grid-cols-8 items-start gap-4">
            <div className="col-span-7">
                <ReactRange.Range
                    step={1}
                    min={0}
                    max={10}
                    disabled={props.disabled}
                    values={props.value ?? [5]}
                    onChange={(values) => props.callback(values)}
                    renderMark={({ props: markProps, index }) => (
                        <div
                            {...markProps}
                            style={{ ...markProps.style }}
                            className={`relative -bottom-2 h-4 w-0.5 transition-colors duration-500 ${
                                props.value ? 'bg-teal-200' : 'bg-grey-100'
                            }`}
                        >
                            <span
                                className={`absolute -bottom-full text-xxs text-grey-500
                                ${index === 0 ? 'left-0' : ''} ${index === 10 ? 'right-0 left-auto' : ''}`}
                            >
                                {(index === 0 && props.labels[0]) || (index === 10 && props.labels[10])}
                            </span>
                        </div>
                    )}
                    renderTrack={({ props: trackProps, children }) => (
                        <div
                            {...trackProps}
                            style={{ ...trackProps.style }}
                            className={`h-2 w-full rounded-sm transition-colors duration-500 
                            ${props.value ? 'bg-teal-200' : 'bg-grey-100'} ${props.disabled ? 'opacity-50' : ''}`}
                        >
                            {children}
                        </div>
                    )}
                    renderThumb={({ props: rangeProps, isDragged }) => (
                        <div
                            {...rangeProps}
                            style={{ ...rangeProps.style }}
                            className={`relative h-4 w-4 rounded-full border-transparent outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 ${
                                props.value ? 'bg-teal-600' : 'bg-grey-300'
                            }`}
                        >
                            {/* {isDragged && (
                                <span
                                    className={`absolute -top-7 left-1/2 z-50 w-fit -translate-x-1/2 whitespace-nowrap rounded bg-teal-700 px-2 py-0.5 text-xs text-white-50
                                                ${props.value[0] === 0 && '!left-0 !translate-x-0'}
                                                ${props.value[0] === 10 && '!right-0 !-translate-x-full'}`}
                                >
                                    {props.labels[props.value[0]]}
                                </span>
                            )} */}
                        </div>
                    )}
                />
            </div>
            <span className="col-span-1 font-montserrat text-sm font-medium text-grey-700">
                {props.value ? props.value[0] : 'N/A'}
            </span>
        </div>
    </div>
);

const Actions: React.FC<ActionProps> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const SWRConfig = SWR.useSWRConfig();
    const user = Stores.useAuthStore((state) => state.user);
    const notificationStore = Stores.useNoficiationStore();
    const [showModel, setShowModel] = React.useState(false);
    const [firstRatingValue, setFirstRatingValue] = React.useState<number[] | undefined>();
    const [secondRatingValue, setSecondRatingValue] = React.useState<number[] | undefined>();
    const [thirdRatingValue, setThirdRatingValue] = React.useState<number[] | undefined>();
    const [error, setError] = React.useState<string | undefined>();
    const [submitting, setSubmitting] = React.useState(false);

    const save = async () => {
        setSubmitting(true);
        try {
            if (firstRatingValue) {
                await api.post(
                    `${Config.endpoints.publications}/${props.id}/ratings`,
                    {
                        type: Config.values.octopusInformation.publications[props.type].ratings[0].id,
                        value: firstRatingValue[0]
                    },
                    user?.token
                );
            }

            if (secondRatingValue) {
                await api.post(
                    `${Config.endpoints.publications}/${props.id}/ratings`,
                    {
                        type: Config.values.octopusInformation.publications[props.type].ratings[1].id,
                        value: secondRatingValue[0]
                    },
                    user?.token
                );
            }

            if (thirdRatingValue) {
                await api.post(
                    `${Config.endpoints.publications}/${props.id}/ratings`,
                    {
                        type: Config.values.octopusInformation.publications[props.type].ratings[2].id,
                        value: thirdRatingValue[0]
                    },
                    user?.token
                );
            }

            SWRConfig.mutate(`${Config.endpoints.publications}/${props.id}`);
            setShowModel(false);
            notificationStore.setTitle('You did it!');
            notificationStore.setIcon(
                <OutlineIcons.CheckCircleIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />
            );
            notificationStore.setMessage('Lorem ipsum dolor sit amet consectetur, adipisicing elit.');
            notificationStore.setDismiss(true);
            notificationStore.toggleVisibility(true);
        } catch (err) {
            console.log(err);
            const { message } = err as Interfaces.JSONResponseError;
            setError(message);
        }
    };

    React.useEffect(() => {
        if (!showModel) {
            // Takes into account closing transition time
            setTimeout(() => {
                setFirstRatingValue(undefined);
                setSecondRatingValue(undefined);
                setThirdRatingValue(undefined);
                setError(undefined);
                setSubmitting(false);
            }, 200);
        }
    }, [showModel]);

    return (
        <>
            <Components.Modal
                open={showModel}
                setOpen={setShowModel}
                positiveActionCallback={save}
                positiveButtonText="Submit my rating"
                cancelButtonText="Cancel"
                title="Rate this publication"
                disableButtons={submitting}
            >
                <>
                    {!!submitting && (
                        <OutlineIcons.RefreshIcon className="absolute right-4 top-4 h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                    )}
                    <p className="mt-4 mb-8 text-left text-xs text-grey-700">
                        Lorem ipsum dolor sit amet consectetur adipisicing elit. Amet quisquam facere fuga doloremque
                        animi unde nihil debitis.
                    </p>
                    <div className="mb-8">
                        {!!error && <Components.Alert severity="ERROR" title={error} className="my-4 text-left" />}
                        <div className="mb-20 space-y-12">
                            <RatingSelector
                                title={Config.values.octopusInformation.publications[props.type].ratings[0].value}
                                description={
                                    Config.values.octopusInformation.publications[props.type].ratings[0].description
                                }
                                labels={['Bad', '', '', '', '', '', '', '', '', '', 'Good']}
                                value={firstRatingValue}
                                callback={setFirstRatingValue}
                                disabled={submitting}
                            />
                            <RatingSelector
                                title={Config.values.octopusInformation.publications[props.type].ratings[1].value}
                                description={
                                    Config.values.octopusInformation.publications[props.type].ratings[1].description
                                }
                                labels={['Bad', '', '', '', '', '', '', '', '', '', 'Good']}
                                value={secondRatingValue}
                                callback={setSecondRatingValue}
                                disabled={submitting}
                            />
                            <RatingSelector
                                title={Config.values.octopusInformation.publications[props.type].ratings[2].value}
                                description={
                                    Config.values.octopusInformation.publications[props.type].ratings[2].description
                                }
                                labels={['Bad', '', '', '', '', '', '', '', '', '', 'Good']}
                                value={thirdRatingValue}
                                callback={setThirdRatingValue}
                                disabled={submitting}
                            />
                        </div>
                    </div>
                </>
            </Components.Modal>

            <Components.SectioBreak name="Actions" />

            {/** Download options */}
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800 transition-colors duration-500 dark:text-grey-50">
                    Download:
                </span>
                <button
                    aria-label="Print button"
                    onClick={() => window.print()}
                    className="mr-4 flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                >
                    <Image src="/images/pdf.svg" alt="PDF Icon" width={18} height={18} />
                    <span className="ml-1">pdf</span>
                </button>
                <button
                    aria-label="Download JSON"
                    onClick={() =>
                        Helpers.blobFileDownload(`${Config.endpoints.publications}/${props.id}`, `${props.id}.json`)
                    }
                    className="mr-4 flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                >
                    <Image src="/images/json.svg" alt="PDF Icon" width={18} height={18} />
                    <span className="ml-1">json</span>
                </button>
            </div>

            {user ? (
                <>
                    <button
                        aria-label="Write review button"
                        onClick={() => {
                            router.push({
                                pathname: `${Config.urls.createPublication.path}`,
                                query: {
                                    for: props.id,
                                    type: 'PEER_REVIEW'
                                }
                            });
                        }}
                        className="flex items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                    >
                        Write a review
                    </button>
                    <button
                        aria-label="Rate this publication"
                        onClick={() => setShowModel(true)}
                        className="flex items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                    >
                        Rate this publication
                    </button>
                </>
            ) : (
                <>
                    <Components.Link
                        href={Config.urls.orcidLogin.path}
                        className="flex items-center rounded border-transparent text-sm font-medium text-teal-600 outline-0 transition-colors duration-500 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400 dark:text-teal-400"
                    >
                        Sign in to rate & review
                    </Components.Link>
                </>
            )}
        </>
    );
};

export default Actions;
