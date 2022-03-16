import React from 'react';
import * as OutlineIcons from '@heroicons/react/outline';

import * as Components from '@components';
import * as Interfaces from '@interfaces';

type Props = {
    publications: Interfaces.Publication[];
};

const Carousel: React.FC<Props> = (props): JSX.Element => {
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
                    className="scrollbar flex snap-x snap-mandatory overflow-x-scroll overscroll-y-none pt-2 pb-6 pl-[2px] sm:snap-none"
                >
                    {props.publications.map((publication: Interfaces.Publication, index: number) => (
                        <div key={index} className="mr-10 min-w-[300px] snap-center sm:snap-align-none">
                            <Components.PublicationCard publication={publication} />
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
            <div className="absolute top-0 right-0 hidden h-full w-1/6 select-none bg-gradient-to-r from-transparent to-white transition-colors duration-500 dark:to-grey-800 md:block" />
        </div>
    );
};

export default Carousel;
