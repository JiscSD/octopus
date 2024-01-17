import React from 'react';
import axios from 'axios';

import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as Components from '@/components';
import * as Stores from '@/stores';
import * as Config from '@/config';
import * as api from '@/api';
import * as Interfaces from '@/interfaces';
import * as Helpers from '@/helpers';

type IconProps = {
    loading: boolean;
    error: boolean;
    ror: string;
};

type RowProps = {
    item: Interfaces.Funder;
};

const TableRow: React.FC<RowProps> = (props): React.ReactElement => {
    const { publicationVersion, updatePublicationVersion } = Stores.usePublicationCreationStore();
    const user = Stores.useAuthStore((state) => state.user);
    const [isLoading, setIsLoading] = React.useState(false);

    const onDeleteRowHandler = async (id: string) => {
        setIsLoading(true);
        try {
            await api.destroy(
                `${Config.endpoints.publicationVersions}/${publicationVersion.id}/funders/${id}`,
                user?.token
            );

            updatePublicationVersion({
                ...publicationVersion,
                funders: publicationVersion.funders.filter((funder) => funder.id !== id)
            });
            setIsLoading(false);
        } catch (err) {
            setIsLoading(false);
        }
    };

    return (
        <>
            <tr key={props.item.id} className="h-12 align-middle">
                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    {props.item.name}
                </td>
                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    <Components.Link href={props.item.link} openNew>
                        {props.item.link}
                    </Components.Link>
                </td>
                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    {props.item.city}, {props.item.country}
                </td>
                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    {props.item.ror}
                </td>
                <td className="space-nowrap h-full items-center justify-center py-4 text-center">
                    {isLoading ? (
                        <Components.IconButton
                            className="p-2"
                            title="Refresh"
                            icon={
                                <OutlineIcons.ArrowPathIcon
                                    className="ml-6 h-full w-7 animate-reverse-spin justify-center align-middle text-teal-600 transition-colors duration-500 dark:text-teal-400"
                                    aria-hidden="true"
                                    aria-label="Loading ror data"
                                />
                            }
                        />
                    ) : (
                        <Components.IconButton
                            className=" h-full justify-center align-middle"
                            title="Delete"
                            icon={
                                <OutlineIcons.TrashIcon
                                    className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50"
                                    aria-hidden="true"
                                />
                            }
                            onClick={() => onDeleteRowHandler(props.item.id)}
                        />
                    )}
                </td>
            </tr>
        </>
    );
};

const RorIcon: React.FC<IconProps> = (props): React.ReactElement => {
    if (props.loading) {
        return (
            <OutlineIcons.ArrowPathIcon
                className="h-5 w-5 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400"
                aria-hidden="true"
                aria-label="Loading ror data"
            />
        );
    }

    if (!props.ror) {
        return (
            <OutlineIcons.MinusCircleIcon
                className="h-5 w-5 text-teal-600 transition-colors duration-500 dark:text-teal-400"
                aria-hidden="true"
                aria-label="Please enter ror data"
            />
        );
    }

    if (!props.loading && props.error && props.ror) {
        return (
            <OutlineIcons.ExclamationCircleIcon
                className="h-5 w-5 text-red-600 transition-colors duration-500 dark:text-teal-400"
                aria-hidden="true"
                aria-label="Invalid ror ID"
            />
        );
    }

    return (
        <OutlineIcons.CheckCircleIcon
            className="h-5 w-5 text-green-600 transition-colors duration-500 dark:text-teal-400"
            aria-hidden="true"
            aria-label="Valid ror ID"
        />
    );
};

let timeout: NodeJS.Timeout;

const RORForm: React.FC = (props): React.ReactElement => {
    const { publicationVersion, updatePublicationVersion, setError } = Stores.usePublicationCreationStore();

    const user = Stores.useAuthStore((state) => state.user);

    const [method, setMethod] = React.useState<'ror' | 'manual'>('ror');
    const [ror, setRor] = React.useState('');
    const [name, setName] = React.useState('');
    const [city, setCity] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [link, setLink] = React.useState('');
    const [isLinkValid, setIsLinkValid] = React.useState(true);
    const [submitLoading, setSubmitLoading] = React.useState(false);
    const [rorLoading, setRorLoading] = React.useState(false);
    const [rorError, setRorError] = React.useState(false);

    const getRorData = React.useCallback(async (value: string) => {
        const actualRor = value.split('/')[value.split('/').length - 1];
        setRor(value);
        setRorLoading(true);

        clearTimeout(timeout);

        timeout = setTimeout(async () => {
            try {
                const rorResponse = await axios.get(`https://api.ror.org/organizations/${actualRor}`);
                setRorError(false);
                setName(rorResponse.data.name);
                setCity(rorResponse.data.addresses[0].city);
                setLink(rorResponse.data.links[0]);
                setIsLinkValid(true);
                setCountry(rorResponse.data.country.country_name);
            } catch (err) {
                setRorError(true);
            }
            setRorLoading(false);
        }, 300);
    }, []);

    React.useEffect(() => {
        if (method === 'manual') {
            setRor('');
        }
    }, [method]);

    const onSubmitHandler = async () => {
        const isValidLink = Helpers.validateURL(link);

        if (!isValidLink) {
            return setIsLinkValid(false);
        }

        setSubmitLoading(true);
        try {
            const response = await api.post<Interfaces.Funder>(
                `${Config.endpoints.publicationVersions}/${publicationVersion.id}/funders`,
                {
                    name,
                    country,
                    city,
                    link,
                    ror
                },
                user?.token
            );
            const createdRorRecord = response.data;
            updatePublicationVersion({
                ...publicationVersion,
                funders: [...publicationVersion.funders, createdRorRecord]
            });
            setSubmitLoading(false);
            setName('');
            setCountry('');
            setCity('');
            setLink('');
            setRor('');
        } catch (err) {
            setError(axios.isAxiosError(err) ? err.response?.data.message : (err as Error).message);
            setSubmitLoading(false);
        }
    };

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div className="flex items-center ">
                <fieldset className="w-full">
                    <div className="flex items-center">
                        <input
                            id="ror"
                            name="funder-method"
                            type="radio"
                            defaultChecked={method === 'ror'}
                            onChange={(e) => setMethod('ror')}
                            className="border-gray-300 mb-2 h-4 w-4 text-teal-600 focus:ring-teal-600"
                        />
                        <label
                            htmlFor="ror"
                            className="text-gray-700 mb-2 ml-3 block text-sm font-medium dark:text-white-100"
                        >
                            Enter ROR ID
                        </label>
                    </div>
                    <div className="relative mb-6">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <RorIcon loading={rorLoading} error={rorError} ror={ror} />
                        </div>
                        <input
                            disabled={method === 'manual'}
                            name="ror"
                            className={`w-1/2 rounded border border-grey-100 bg-white-50 p-2 pl-10 text-grey-700 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'manual' ? 'bg-grey-50 dark:bg-grey-400' : 'bg-white-50'
                            }`}
                            placeholder="01rv9gx86 or https://ror.org/01rv9gx86"
                            value={ror}
                            onChange={(e) => getRorData(e.target.value)}
                        />
                        <Components.Button
                            className="pl-5"
                            title="Add funder"
                            disabled={!ror || rorLoading || rorError}
                            onClick={onSubmitHandler}
                            endIcon={
                                submitLoading ? (
                                    <OutlineIcons.ArrowPathIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                ) : (
                                    <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                )
                            }
                        />
                    </div>
                    <div className="mb-2 flex items-center">
                        <input
                            id="manual"
                            name="funder-method"
                            type="radio"
                            defaultChecked={method === 'manual'}
                            onChange={(e) => setMethod('manual')}
                            className="border-gray-300 h-4 w-4 text-teal-600 focus:ring-teal-600"
                        />
                        <label
                            htmlFor="manual"
                            className="text-gray-700 ml-3 block text-sm font-medium dark:text-white-100"
                        >
                            Enter the organisation&apos;s details manually
                        </label>
                    </div>
                    <div className="mb-4">
                        <input
                            placeholder="Name"
                            disabled={method === 'ror'}
                            className={`w-1/2 rounded border border-grey-100  p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-400' : 'bg-white-50'
                            }`}
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            placeholder="City"
                            disabled={method === 'ror'}
                            className={`w-1/2 rounded border border-grey-100  p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-400' : 'bg-white-50'
                            }`}
                            value={city}
                            onChange={(e) => setCity(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            placeholder="Country"
                            disabled={method === 'ror'}
                            className={`w-1/2 rounded border border-grey-100  p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-400' : 'bg-white-50'
                            }`}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div>
                        <input
                            placeholder="Link"
                            disabled={method === 'ror'}
                            className={`w-1/2 rounded border border-grey-100  p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-400' : 'bg-white-50'
                            }`}
                            type="url"
                            value={link}
                            onChange={(e) => {
                                setLink(e.target.value);
                                if (!isLinkValid) {
                                    setIsLinkValid(true);
                                }
                            }}
                        />
                        <Components.Button
                            className="pl-5"
                            title="Add funder"
                            disabled={
                                method == 'ror' ||
                                name == '' ||
                                link == '' ||
                                city == '' ||
                                link == '' ||
                                isLinkValid == false
                            }
                            onClick={onSubmitHandler}
                            endIcon={
                                submitLoading ? (
                                    <OutlineIcons.ArrowPathIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                ) : (
                                    <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                                )
                            }
                        />
                        {method === 'manual' && !isLinkValid ? (
                            <Components.Alert
                                severity="ERROR"
                                title='Please enter a valid URL starting with "http".'
                                className="mt-3 w-1/2"
                            />
                        ) : null}
                    </div>
                </fieldset>
            </div>
            <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                <div className="my-2">
                    <div className="inline-block min-w-full py-2 align-middle">
                        {publicationVersion.funders.length ? (
                            <div className="mb-6 overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                                <table className="min-w-full divide-y divide-grey-100  dark:divide-teal-300">
                                    <thead className="bg-grey-50 transition-colors duration-500 dark:bg-grey-700">
                                        <tr>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                                Name
                                            </th>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                                Link
                                            </th>
                                            <th className='"whitespace-pre " py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6'>
                                                Location
                                            </th>
                                            <th className='"whitespace-pre " py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6'>
                                                ROR
                                            </th>
                                            <th className="whitespace-pre py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-grey-900 transition-colors duration-500 dark:text-grey-50 sm:pl-6 ">
                                                Delete
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-grey-100 bg-white-50 transition-colors duration-500 dark:divide-teal-300 dark:bg-grey-600">
                                        {publicationVersion.funders.map((item) => (
                                            <TableRow item={item} key={item.id} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <Components.Alert
                                severity="INFO"
                                title="This publication does not have any funders"
                                className="w-full lg:w-1/2"
                            />
                        )}

                        <div className="mb-2 flex flex-col">
                            <label
                                htmlFor="ror-additional-info"
                                id="ror-additional-info"
                                className="text-gray-700 mt-6 block text-sm font-medium dark:text-white-100"
                            >
                                If needed, provide further information on this publication’s funding arrangements
                            </label>
                            <textarea
                                id="ror-additional-info"
                                aria-labelledby="ror-additional-info"
                                name="free-text"
                                className="mb-2 mt-3 w-full rounded border border-grey-100 bg-white-50 p-2 text-grey-700 shadow focus:ring-2 focus:ring-yellow-400"
                                placeholder="Enter any details"
                                value={publicationVersion.fundersStatement ?? ''}
                                rows={5}
                                onChange={(e) =>
                                    updatePublicationVersion({
                                        ...publicationVersion,
                                        fundersStatement: e.target.value
                                    })
                                }
                            />
                        </div>
                    </div>
                </div>
            </Framer.motion.div>
        </div>
    );
};

export default RORForm;
