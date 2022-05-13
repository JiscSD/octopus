import React from 'react';
import axios from 'axios';
import * as Framer from 'framer-motion';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Stores from '@stores';
import * as Config from '@config';
import * as Types from '@types';
import * as api from '@api';
import * as Interfaces from '@interfaces';

type Props = {
    loading: boolean;
    error: boolean;
    ror: string;
};

const TableRow: React.FC<Props> = (props: Interfaces.funder): React.ReactElement => {
    const publicationId = Stores.usePublicationCreationStore((state) => state.id);
    const funders = Stores.usePublicationCreationStore((state) => state.funders);
    const updateFunders = Stores.usePublicationCreationStore((state) => state.updateFunders);
    const user = Stores.useAuthStore((state) => state.user);

    const [isLoading, setIsLoading] = React.useState(false);

    const onDeleteFunderHandler = async (id: string) => {
        setIsLoading(true);
        try {
            await api.destroy(`${Config.endpoints.publications}/${publicationId}/funders/${id}`, user?.token);
            updateFunders(funders.filter((funder) => funder.id !== id));
            setIsLoading(false);
        } catch (err) {
            console.log(err);
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
                    <a href={props.item.link}>{props.item.link}</a>
                </td>
                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    {props.item.city}, {props.item.country}
                </td>
                <td className="space-nowrap py-4 pl-4 pr-3 text-sm text-grey-900 transition-colors duration-500 dark:text-white-50 sm:pl-6">
                    {props.item.ror}
                </td>
                <td className="space-nowrap h-full items-center justify-center py-4 text-center">
                    {isLoading ? (
                        <OutlineIcons.RefreshIcon
                            className="ml-6 h-full w-7 animate-reverse-spin justify-center align-middle text-teal-600 transition-colors duration-500 dark:text-teal-400"
                            aria-hidden="true"
                            aria-label="Loading ror data"
                        />
                    ) : (
                        <button
                            onClick={() => onDeleteFunderHandler(props.item.id)}
                            className=" h-full justify-center align-middle"
                        >
                            <OutlineIcons.TrashIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                        </button>
                    )}
                </td>
            </tr>
        </>
    );
};

const RorIcon: React.FC<Props> = (props): React.ReactElement => {
    if (props.loading) {
        return (
            <OutlineIcons.RefreshIcon
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

const Funders: React.FC = (): React.ReactElement => {
    const funders = Stores.usePublicationCreationStore((state) => state.funders);
    const updateFunders = Stores.usePublicationCreationStore((state) => state.updateFunders);

    const publicationId = Stores.usePublicationCreationStore((state) => state.id);
    const user = Stores.useAuthStore((state) => state.user);

    const [method, setMethod] = React.useState<'ror' | 'manual'>('ror');
    const [ror, setRor] = React.useState('' || null);
    const [name, setName] = React.useState('');
    const [city, setCity] = React.useState('');
    const [country, setCountry] = React.useState('');
    const [link, setLink] = React.useState('');
    const [submitLoading, setSubmitLoading] = React.useState(false);

    const [rorLoading, setRorLoading] = React.useState(false);
    const [rorError, setRorError] = React.useState(false);

    const getRorData = React.useCallback(
        async (value) => {
            const actualRor = value.split('/')[value.split('/').length - 1];
            setRor(value);
            setRorLoading(true);
            try {
                const rorResponse = await axios.get(`https://api.ror.org/organizations/${actualRor}`);
                setRorError(false);
                setName(rorResponse.data.name);
                setCity(rorResponse.data.addresses[0].city);
                setLink(rorResponse.data.links[0]);
                setCountry(rorResponse.data.country.country_name);
            } catch (err) {
                setRorError(true);
            }
            setRorLoading(false);
        },
        [ror]
    );

    React.useEffect(() => {
        if (method === 'manual') {
            setRor(null);
        }
    }, [method]);

    const onSubmitHandler = async () => {
        setSubmitLoading(true);
        try {
            const response = await api.post(
                `${Config.endpoints.publications}/${publicationId}/funders`,
                {
                    name,
                    country,
                    city,
                    link,
                    ror
                },
                user?.token
            );
            setSubmitLoading(false);
            updateFunders([...funders, response.data]);
        } catch (err) {
            setSubmitLoading(false);
            console.log(err);
        }
    };

    return (
        <div className="space-y-12 2xl:space-y-16">
            <div>
                <Components.PublicationCreationStepTitle text="Funding" />
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    Provide the details of any sources of funding for this work.
                </span>
                <span className="mb-2 block text-sm leading-snug text-grey-700 transition-colors duration-500 dark:text-white-50">
                    We recommend that where possible you use your funder’s{' '}
                    <Components.Link
                        href="https://ror.org/"
                        openNew={true}
                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                    >
                        <span>ROR identifier</span>
                    </Components.Link>
                    . This ensures that consistent, accurate organisational data is displayed and enables more efficient
                    discovery and tracking of research outputs across institutions and funding bodies.
                </span>
            </div>
            <div className="flex items-center space-x-4">
                <fieldset className="w-full">
                    <div className="mb-2 flex items-center">
                        <input
                            id="ror"
                            name="funder-method"
                            type="radio"
                            defaultChecked={method === 'ror'}
                            onChange={(e) => setMethod('ror')}
                            className="border-gray-300 h-4 w-4 text-teal-600 focus:ring-teal-600"
                        />
                        <label
                            htmlFor="ror"
                            className="text-gray-700 ml-3 block text-sm font-medium dark:text-white-100"
                        >
                            Enter funder ROR ID
                        </label>
                    </div>
                    <div className="relative mb-6">
                        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                            <RorIcon loading={rorLoading} error={rorError} ror={ror} />
                        </div>
                        <input
                            disabled={method === 'manual'}
                            name="ror"
                            className={`w-1/2 rounded border border-grey-100 bg-white-50 p-2 pl-10 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'manual' ? 'bg-grey-50 dark:bg-grey-800' : 'bg-white-50'
                            }`}
                            placeholder="01rv9gx86 or https://ror.org/01rv9gx86"
                            value={ror}
                            onChange={(e) => getRorData(e.target.value)}
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
                            Enter funder details manually
                        </label>
                    </div>
                    <div className="mb-4">
                        <input
                            placeholder="Name"
                            disabled={method === 'ror'}
                            className={`w-1/2 rounded border border-grey-100  p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-800' : 'bg-white-50'
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
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-800' : 'bg-white-50'
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
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-800' : 'bg-white-50'
                            }`}
                            value={country}
                            onChange={(e) => setCountry(e.target.value)}
                        />
                    </div>
                    <div className="mb-4">
                        <input
                            placeholder="Link"
                            disabled={method === 'ror'}
                            className={`w-1/2 rounded border border-grey-100  p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400 ${
                                method === 'ror' ? 'bg-grey-50 dark:bg-grey-800' : 'bg-white-50'
                            }`}
                            value={link}
                            onChange={(e) => setLink(e.target.value)}
                        />
                    </div>
                </fieldset>
            </div>
            <Components.Button
                title="Add funder"
                disabled={name == '' || link == '' || city == '' || link == ''}
                onClick={onSubmitHandler}
                iconPosition="RIGHT"
                icon={
                    submitLoading ? (
                        <OutlineIcons.RefreshIcon className="h-6 w-6 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                    ) : (
                        <OutlineIcons.PlusCircleIcon className="h-6 w-6 text-teal-500 transition-colors duration-500 dark:text-white-50" />
                    )
                }
            />
            <Framer.motion.div initial={{ opacity: 0.5 }} animate={{ opacity: 1 }} className="mt-8 flex flex-col">
                <div className="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
                    <div className="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
                        {funders.length ? (
                            <div className="overflow-hidden shadow ring-1 ring-black ring-opacity-5 dark:ring-transparent md:rounded-lg">
                                <table className="min-w-full divide-y divide-grey-100 dark:divide-teal-300">
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
                                        {funders.map((item) => (
                                            <TableRow item={item} key={item.id} />
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <Components.Alert
                                severity="INFO"
                                title="This publication does not have any funders."
                                className="w-fit"
                            />
                        )}
                    </div>
                </div>
            </Framer.motion.div>
        </div>
    );
};

export default Funders;
