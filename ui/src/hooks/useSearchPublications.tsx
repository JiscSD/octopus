import useSWR from 'swr';

import * as Config from '@config';

type Props = {
    query: string;
};

const useSearchPublications = (props: Props) => {
    const { data, error } = useSWR('/publications');

    return data;
};

export default useSearchPublications;
