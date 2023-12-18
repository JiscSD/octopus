import React, { useState } from 'react';
import axios from 'axios';
import * as Config from '@/config';
import * as api from '@/api';
import * as Helpers from '@/helpers';
import { useRouter } from 'next/router';

const useCreateNewVersion = (publicationId: string) => {
    const router = useRouter();
    const [loadingNewVersion, setLoadingNewVersion] = useState(false);
    const [newVersionError, setNewVersionError] = useState('');

    const handleCreateNewVersion = React.useCallback(
        async (e: React.MouseEvent<Element, MouseEvent>) => {
            if (loadingNewVersion) {
                return;
            }

            setNewVersionError('');
            setLoadingNewVersion(true);

            try {
                // create new version
                await api.post(
                    `${Config.endpoints.publications}/${publicationId}/publication-versions`,
                    {},
                    Helpers.getJWT()
                );

                // redirect user to the edit page
                await router.push(`/publications/${publicationId}/edit?step=0`);
            } catch (error) {
                console.log(error);
                setNewVersionError(
                    axios.isAxiosError(error) ? error.response?.data?.message : (error as Error).message
                );
            }

            setLoadingNewVersion(false);
        },
        [loadingNewVersion, publicationId, router]
    );

    return { handleCreateNewVersion, loadingNewVersion, newVersionError };
};

export default useCreateNewVersion;
