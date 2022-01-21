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
                <Components.SectionTwo
                    className="bg-teal-50 dark:bg-grey-400"
                    waveFillTop="fill-teal-100 dark:fill-grey-500 transition-colors duration-500"
                    waveFillMiddle="fill-teal-200 dark:fill-grey-600 transition-colors duration-500"
                    waveFillBottom="fill-teal-700 dark:fill-grey-800 transition-colors duration-500"
                >
                    <div className="container mx-auto px-8 py-16">
                        <p>Content here for publication with slug/id {router.query.slug}</p>
                    </div>
                </Components.SectionTwo>
            </Layouts.Standard>
        </>
    );
};

export default Publication;
