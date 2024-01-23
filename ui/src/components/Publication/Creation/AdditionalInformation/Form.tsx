import axios from 'axios';
import React from 'react';

import * as ReactIconsFA from 'react-icons/fa';

import * as api from '@/api';
import * as Components from '@/components';
import * as Config from '@/config';
import * as Helpers from '@/helpers';
import * as Interfaces from '@/interfaces';
import * as Stores from '@/stores';

const Form: React.FC = () => {
    const { publicationVersion, updatePublicationVersion } = Stores.usePublicationCreationStore();
    const user = Stores.useAuthStore((state) => state.user);

    const [title, setTitle] = React.useState('');
    const [url, setUrl] = React.useState('');
    const [description, setDescription] = React.useState('');

    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState<null | string>(null);

    const addAdditionalInformation = async () => {
        if (title.trim() === '') {
            return setError('Please enter a title');
        }

        const isValidLink = Helpers.validateURL(url);

        if (!isValidLink) {
            return setError('Please supply a valid URL starting with "http"');
        }

        if (description.length > 255) {
            return setError('Short description must not be longer than 255 characters');
        }

        setLoading(true);
        try {
            const response = await api.post<Interfaces.AdditionalInformation>(
                `${Config.endpoints.publicationVersions}/${publicationVersion.id}/additional-information`,
                { title, url, description },
                user?.token
            );
            setError(null);
            updatePublicationVersion({
                ...publicationVersion,
                additionalInformation: [...publicationVersion.additionalInformation, response.data]
            });
            setLoading(false);
            setTitle('');
            setUrl('');
            setDescription('');
        } catch (err) {
            setError(axios.isAxiosError(err) ? err.response?.data.message : (err as Error).message);
            setLoading(false);
        }
    };

    return (
        <fieldset className="flex flex-col items-start">
            {error && <Components.Alert severity="ERROR" title={error} className="mb-3 w-1/2" />}
            <input
                placeholder="Title*"
                className="mb-4 w-1/2 rounded border border-grey-100  bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
            />
            <input
                placeholder="URL*"
                className="mb-4 w-1/2 rounded border border-grey-100  bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                required
            />
            <input
                placeholder="Short description"
                className="mb-4 w-1/2 rounded border border-grey-100  bg-white-50 p-2 text-grey-800 shadow focus:ring-2 focus:ring-yellow-400"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />
            <Components.Button
                onClick={addAdditionalInformation}
                disabled={loading}
                title="Save link"
                endIcon={
                    <ReactIconsFA.FaRegSave className="h-6 w-6 text-teal-500 transition-colors dark:text-white-50" />
                }
            />
        </fieldset>
    );
};

export default Form;
