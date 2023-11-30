import React from 'react';
import * as OutlineIcons from '@heroicons/react/24/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    publicationVersions: Interfaces.PublicationVersion[];
};

const Carousel: React.FC<Props> = (props): React.ReactElement => {
    const container = React.useRef<HTMLDivElement | any>();

    return (
        <div className="relative">
            {/** Left arrow */}
            <button
                type="button"
                onClick={(e) => (container.current.scrollLeft += -280)}
                className="absolute -left-16 top-1/2 hidden -translate-y-full rounded outline-0 focus:ring-2 focus:ring-yellow-400 2xl:block"
            >
                <OutlineIcons.ChevronLeftIcon className="h-10 w-10 text-teal-500" />
            </button>

            <div className="overflow-hidden">
                <div
                    ref={container}
                    className="scrollbar flex snap-x snap-mandatory overflow-x-scroll overscroll-y-none scroll-smooth pb-6 pl-[2px] pt-2 sm:snap-none"
                >
                    {props.publicationVersions.map((publicationVersion, index: number) => (
                        <div key={index} className="mr-10 min-w-[300px] snap-center sm:snap-align-none">
                            <Components.PublicationCard publicationVersion={publicationVersion} />
                        </div>
                    ))}
                </div>
            </div>

            {/** Left arrow */}
            <button
                type="button"
                onClick={(e) => (container.current.scrollLeft += 280)}
                className="absolute -right-8 top-1/2 z-20 hidden -translate-y-full rounded outline-0 focus:ring-2 focus:ring-yellow-400 2xl:block 3xl:-right-16 "
            >
                <OutlineIcons.ChevronRightIcon className="h-10 w-10 text-teal-500" />
            </button>

            {/** Fade off */}
            <div className="absolute right-0 top-0 hidden h-full w-1/6 select-none bg-gradient-to-r from-transparent to-white-50 transition-colors duration-500 dark:to-grey-800 md:block" />
        </div>
    );
};

export default Carousel;
