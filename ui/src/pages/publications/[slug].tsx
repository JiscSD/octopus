import { GetServerSideProps, NextPage } from 'next';
import Head from 'next/head';
import { useRouter } from 'next/router';

import * as Layouts from '@layouts';
import * as Components from '@components';

export const getServerSideProps: GetServerSideProps = async (context) => {
    const { data } = context.query; // this is the full url, not just query params, so because the file is named [slug], there is a slug object, i.e the dynamic part

    console.log(data); // will log in our nodejs process, not console

    const publication = {}; // query here to our api to get pub

    return {
        props: {
            publication
        }
    };
};

type Props = {
    publication: any; // change when we know the shape
};

const Publication: NextPage<Props> = (props): JSX.Element => {
    const router = useRouter(); // do not get the route here, this is client side data fetching

    return (
        <>
            <Head>
                <title>Some piub</title>
            </Head>
            <Layouts.Standard fixedHeader={false}>
                <Components.Section
                    className="bg-teal-50 dark:bg-grey-600"
                    wave={true}
                    waveFill="fill-teal-50 dark:fill-grey-600"
                >
                    <div className="container mx-auto px-8">
                        <p>Content here for publication with slug/id {router.query.slug}</p>
                    </div>
                </Components.Section>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
