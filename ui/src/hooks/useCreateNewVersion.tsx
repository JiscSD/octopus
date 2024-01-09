import React, { useState } from 'react';
import axios from 'axios';
import * as Config from '@config';
import * as api from '@api';
import * as Helpers from '@helpers';
import * as Contexts from '@contexts';
import * as FaIcons from 'react-icons/fa';
import { useRouter } from 'next/router';

const useCreateNewVersion = (publicationId: string) => {
    const router = useRouter();
    const confirmation = Contexts.useConfirmationModal();
    const [loadingNewVersion, setLoadingNewVersion] = useState(false);
    const [newVersionError, setNewVersionError] = useState('');

    const handleCreateNewVersion = React.useCallback(
        async (e: React.MouseEvent<Element, MouseEvent>) => {
            e.preventDefault();

            if (loadingNewVersion) {
                return;
            }

            const confirmed = await confirmation(
                'Create new version',
                'Are you sure you want to create a new version? You will be responsible for making edits to the draft, and publishing it once any co-authors have approved.',
                <FaIcons.FaEdit className="h-8 w-8 text-grey-600" />,
                'Confirm'
            );

            if (confirmed) {
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
            }
        },
        [confirmation, loadingNewVersion, publicationId, router]
    );

    return { handleCreateNewVersion, loadingNewVersion, newVersionError };
};

export default useCreateNewVersion;
