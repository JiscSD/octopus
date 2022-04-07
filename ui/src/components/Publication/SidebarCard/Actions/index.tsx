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
import * as api from '@api';

type ActionProps = {
    publication: Interfaces.Publication;
};

type RatingSelectorProps = {
    title: string;
    labels: string[];
    value: number[];
    callback: (value: number[]) => void;
    disabled: boolean;
};

const RatingSelector: React.FC<RatingSelectorProps> = (props): React.ReactElement => (
    <div>
        <p className="mb-4 text-left text-sm text-grey-500">{props.title}</p>
        <div className="mb-12">
            <ReactRange.Range
                step={1}
                min={0}
                max={10}
                disabled={props.disabled}
                values={props.value}
                onChange={(values) => props.callback(values)}
                renderMark={({ props, index }) => (
                    <div {...props} style={{ ...props.style }} className="relative -bottom-2 h-4 w-0.5 bg-teal-200">
                        <span className="absolute -left-full -bottom-full text-xxs text-grey-500">{index}</span>
                    </div>
                )}
                renderTrack={({ props: trackProps, children }) => (
                    <div
                        {...trackProps}
                        style={{ ...trackProps.style }}
                        className={`h-2 w-full rounded-sm bg-teal-200 ${props.disabled ? 'opacity-50' : ''}`}
                    >
                        {children}
                    </div>
                )}
                renderThumb={({ props: rangeProps, isDragged }) => (
                    <div
                        {...rangeProps}
                        style={{ ...rangeProps.style }}
                        className="relative h-4 w-4 rounded-full border-transparent bg-teal-600 outline-0 focus:ring-2 focus:ring-yellow-400"
                    >
                        {isDragged && (
                            <span
                                className={`absolute -top-7 left-1/2 z-50 w-fit -translate-x-1/2 whitespace-nowrap rounded bg-teal-700 px-2 py-0.5 text-xs text-white-50 
                                                ${props.value[0] === 0 && '!left-0 !translate-x-0'} 
                                                ${props.value[0] === 10 && '!right-0 !-translate-x-full'}`}
                            >
                                {props.labels[props.value[0]]}
                            </span>
                        )}
                    </div>
                )}
            />
        </div>
    </div>
);

const Actions: React.FC<ActionProps> = (props): React.ReactElement => {
    const router = Router.useRouter();
    const SWRConfig = SWR.useSWRConfig();
    const user = Stores.useAuthStore((state) => state.user);
    const [showModel, setShowModel] = React.useState(false);
    const [firstRatingValue, setFirstRatingValue] = React.useState([5]);
    const [secondRatingValue, setSecondRatingValue] = React.useState([5]);
    const [thirdRatingValue, setThirdRatingValue] = React.useState([5]);
    const [error, setError] = React.useState<string | undefined>();
    const [submitting, setSubmitting] = React.useState(false);

    const save = async () => {
        setSubmitting(true);
        try {
            await api.post(
                `${Config.endpoints.publications}/${props.publication.id}/ratings`,
                {
                    type: Config.values.octopusInformation.publications[props.publication.type].ratings[0].id,
                    value: firstRatingValue[0]
                },
                user?.token
            );

            await api.post(
                `${Config.endpoints.publications}/${props.publication.id}/ratings`,
                {
                    type: Config.values.octopusInformation.publications[props.publication.type].ratings[1].id,
                    value: secondRatingValue[0]
                },
                user?.token
            );

            await api.post(
                `${Config.endpoints.publications}/${props.publication.id}/ratings`,
                {
                    type: Config.values.octopusInformation.publications[props.publication.type].ratings[2].id,
                    value: thirdRatingValue[0]
                },
                user?.token
            );

            SWRConfig.mutate(`${Config.endpoints.publications}/${props.publication.id}`);
            setShowModel(false);
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
                setFirstRatingValue([5]);
                setSecondRatingValue([5]);
                setThirdRatingValue([5]);
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
                    <div className="mb-8">
                        {!!error && <Components.Alert severity="ERROR" title={error} className="my-4 text-left" />}
                        <div className="mb-20 mt-8 space-y-16">
                            <RatingSelector
                                title={
                                    Config.values.octopusInformation.publications[props.publication.type].ratings[0]
                                        .value
                                }
                                labels={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                                value={firstRatingValue}
                                callback={setFirstRatingValue}
                                disabled={submitting}
                            />
                            <RatingSelector
                                title={
                                    Config.values.octopusInformation.publications[props.publication.type].ratings[1]
                                        .value
                                }
                                labels={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                                value={secondRatingValue}
                                callback={setSecondRatingValue}
                                disabled={submitting}
                            />
                            <RatingSelector
                                title={
                                    Config.values.octopusInformation.publications[props.publication.type].ratings[2]
                                        .value
                                }
                                labels={['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', '10']}
                                value={thirdRatingValue}
                                callback={setThirdRatingValue}
                                disabled={submitting}
                            />
                        </div>
                    </div>
                </>
            </Components.Modal>

            <div className="relative py-2">
                <div className="absolute inset-0 flex items-center" aria-hidden="true">
                    <div className="w-full border-t border-grey-300" />
                </div>
                <div className="relative flex justify-center">
                    <span className="bg-white-50 px-2 text-xs text-grey-500">Actions</span>
                </div>
            </div>

            {/** Download options */}
            <div className="flex">
                <span className="mr-2 text-sm font-semibold text-grey-800">Download:</span>
                <button
                    aria-label="Print button"
                    onClick={() => window.print()}
                    className="mr-4 flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                >
                    <Image src="/images/pdf.svg" alt="PDF Icon" width={18} height={18} />
                    <span className="ml-1">pdf</span>
                </button>
                <button
                    aria-label="Download JSON"
                    onClick={() =>
                        Helpers.blobFileDownload(
                            `https://int.api.octopus.ac/v1/publications/${props.publication.id}`,
                            `${props.publication.id}.json`
                        )
                    }
                    className="mr-4 flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                >
                    <Image src="/images/json.svg" alt="PDF Icon" width={18} height={18} />
                    <span className="ml-1">json</span>
                </button>
            </div>

            {/** Button actions */}
            <button
                aria-label="Write review button"
                onClick={() => {
                    router.push({
                        pathname: `${Config.urls.createPublication.path}`,
                        query: {
                            for: props.publication.id,
                            type: 'PEER_REVIEW'
                        }
                    });
                }}
                className="flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
            >
                Write a review
            </button>
            {!!user && (
                <button
                    aria-label="Rate this publication"
                    onClick={() => setShowModel(true)}
                    className="flex items-center rounded border-transparent text-right text-sm font-medium text-teal-600 outline-0 hover:underline focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                >
                    Rate this publication
                </button>
            )}
        </>
    );
};

export default Actions;
