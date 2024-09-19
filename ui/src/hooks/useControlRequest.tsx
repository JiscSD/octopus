import React, { useCallback, useState } from 'react';
import axios from 'axios';
import * as Config from '@/config';
import * as Contexts from '@/contexts';
import * as SWRConfig from 'swr';
import * as FaIcons from 'react-icons/fa';
import * as api from '@/api';
import * as Helpers from '@/helpers';

const useControlRequest = (publicationId: string) => {
    const confirmation = Contexts.useConfirmationModal();
    const [loadingControlRequest, setLoadingControlRequest] = useState(false);
    const [controlRequestError, setControlRequestError] = useState('');

    const handleControlRequest = useCallback(
        async (e: React.MouseEvent<Element, MouseEvent>) => {
            if (loadingControlRequest) {
                return;
            }

            const confirmed = await confirmation(
                'Take over editing',
                'This action will remove the current corresponding author and allow you to make edits instead. Are you sure you want to do this?',
                <FaIcons.FaEdit className="h-8 w-8 text-grey-600" />,
                'Request Control'
            );

            if (confirmed) {
                setControlRequestError('');
                setLoadingControlRequest(true);

                try {
                    // create new version
                    await api.get(
                        `${Config.endpoints.publications}/${publicationId}/publication-versions/latest/request-control`,
                        Helpers.getJWT()
                    );

                    // re-fetch control requests for this user
                    await SWRConfig.mutate(`${Config.endpoints.users}/me/control-requests`);
                } catch (error) {
                    console.log(error);
                    setControlRequestError(
                        axios.isAxiosError(error) ? error.response?.data?.message : (error as Error).message
                    );
                }

                setLoadingControlRequest(false);
            }
        },
        [confirmation, loadingControlRequest, publicationId]
    );

    return { handleControlRequest, loadingControlRequest, controlRequestError };
};

export default useControlRequest;
