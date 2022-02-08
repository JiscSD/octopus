import React from 'react';
import * as SolidIcons from '@heroicons/react/solid';

import * as Interfaces from '@interfaces';

type Props = {
    metadata: Interfaces.SearchResultMeta;
};

const Pagination: React.FC<Props> = (props): JSX.Element => {
    const [active, setActive] = React.useState();

    return (
        <div className="flex items-center justify-between px-4 py-3 sm:px-6">
            <div className="flex flex-1 justify-between sm:hidden">
                <a
                    href="#"
                    className="relative inline-flex items-center rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
                >
                    Previous
                </a>
                <a
                    href="#"
                    className="relative ml-3 inline-flex items-center rounded-md border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700 hover:bg-grey-50"
                >
                    Next
                </a>
            </div>
            <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
                <div>
                    <p className="text-sm text-grey-700">
                        Showing <span className="font-medium">1</span> to <span className="font-medium">10</span> of{' '}
                        <span className="font-medium">97</span> results
                    </p>
                </div>
                <div>
                    <nav className="relative z-0 inline-flex -space-x-px rounded-md shadow-sm" aria-label="Pagination">
                        <a
                            href="#"
                            className="relative inline-flex items-center rounded-l-md border border-grey-300 bg-white px-2 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50"
                        >
                            <span className="sr-only">Previous</span>
                            <SolidIcons.ChevronLeftIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                        {/* Current: "z-10 bg-teal-50 border-teal-500 text-teal-600", Default: "bg-white border-grey-300 text-grey-500 hover:bg-grey-50" */}
                        <a
                            href="#"
                            aria-current="page"
                            className="relative z-10 inline-flex items-center border border-teal-500 bg-teal-50 px-4 py-2 text-sm font-medium text-teal-600"
                        >
                            1
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50"
                        >
                            2
                        </a>
                        <a
                            href="#"
                            className="relative hidden items-center border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50 md:inline-flex"
                        >
                            3
                        </a>
                        <span className="relative inline-flex items-center border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-700">
                            ...
                        </span>
                        <a
                            href="#"
                            className="relative hidden items-center border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50 md:inline-flex"
                        >
                            8
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50"
                        >
                            9
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center border border-grey-300 bg-white px-4 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50"
                        >
                            10
                        </a>
                        <a
                            href="#"
                            className="relative inline-flex items-center rounded-r-md border border-grey-300 bg-white px-2 py-2 text-sm font-medium text-grey-500 hover:bg-grey-50"
                        >
                            <span className="sr-only">Next</span>
                            <SolidIcons.ChevronRightIcon className="h-5 w-5" aria-hidden="true" />
                        </a>
                    </nav>
                </div>
            </div>
        </div>
    );
};

export default Pagination;
