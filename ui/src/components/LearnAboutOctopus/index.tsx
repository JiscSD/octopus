import React from 'react';
import * as Framer from 'framer-motion';

import * as Components from '@components';

type GridItemProps = {
    title: string;
    children: React.ReactChildren | React.ReactChild;
};

const GridItem: React.FC<GridItemProps> = (props) => (
    <div className="col-span-1 transition-all duration-500 lg:col-span-6 xl:col-span-3">
        <h3 className="mb-2 block font-montserrat text-lg font-semibold text-grey-900 decoration-teal-300 decoration-2 transition-colors duration-500 dark:text-white">
            {props.title}
        </h3>
        <p className="block text-sm leading-6 tracking-wide text-grey-700 transition-colors duration-500 dark:text-grey-200 lg:text-base">
            {props.children}
        </p>
    </div>
);

const LearnAboutOctopus = () => (
    <>
        <Framer.motion.div
            initial={{ opacity: 0, transform: 'translateY(5%)' }}
            animate={{ opacity: 1, transform: 'translateY(0)' }}
            className="container mx-auto mb-10 gap-6 px-8 transition-all duration-500 lg:mb-24"
        >
            <Components.HTMLVideo
                srcWebM="/video/webm/a_quick_introduction_to_octopus.webm"
                srcMp4="/video/mp4/a_quick_introduction_to_octopus.mp4"
                title="A quick introduction to Octopus: the new primary research record for science"
                showCaption={false}
                controls={true}
                poster="/images/jpg/poster.jpg"
                width={1080}
                className="mx-auto !w-fit"
            />
        </Framer.motion.div>

        <div className="container mx-auto px-8">
            <div className="mb-10 grid grid-cols-1 gap-10 md:mb-16 lg:mx-auto lg:mb-28 lg:grid-cols-12 ">
                <GridItem title="Free and quick to publish">
                    Octopus is designed to help researchers get their work published quickly, easily and freely. Break
                    away from the tyranny of &apos;papers&apos; and publish your work faster!
                </GridItem>
                <GridItem title="Establish your priority">
                    No need to worry about being &apos;scooped&apos; - once you&apos;ve published an idea, or a protocol
                    in Octopus you have established your priority. That work now has your name and date on it for
                    everyone to see.
                </GridItem>
                <GridItem title="Find relevant work">
                    All publications in Octopus are linked, forming branching chains. If you subscribe to a particular
                    research problem you can easily see all work linked to it.
                </GridItem>
                <GridItem title="Get the credit you deserve">
                    All your work in Octopus, including reviews that you write, are displayed on your personal page for
                    others to see, along with ratings that others have given them.
                </GridItem>
            </div>
        </div>
    </>
);

export default LearnAboutOctopus;
