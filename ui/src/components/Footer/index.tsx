import { FC } from 'react';

import * as Components from '@components';
import * as Config from '@config';

const Footer: FC = (): JSX.Element => {
    return (
        <footer className="bg-grey-50 dark:bg-grey-800 pt-20 pb-12 transition-all duration-500">
            <div className="container mx-auto px-8 grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                <div className="">
                    <h3 className="block mb-12 font-montserrat font-bold text-4xl text-purple-300">Octopus</h3>
                    <div className="mb-12">
                        <Components.Link
                            href={Config.urls.search.path}
                            className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <h4 className="font-montserrat font-semibold text-purple-300 dark:text-purple-200">
                                Search
                            </h4>
                        </Components.Link>
                        <Components.Link
                            href={Config.urls.createPublication.path}
                            className="block max-w-fit p-1 mb-1 rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                        >
                            <h4 className="font-montserrat font-semibold text-purple-300 dark:text-purple-200">
                                Publish
                            </h4>
                        </Components.Link>
                    </div>
                    <div>
                        <h5 className="block mb-12 font-montserrat font-bold text-sm text-md text-purple-400 dark:text-purple-200">
                            In partnership with
                        </h5>
                    </div>
                    <div>SOME LOGO</div>
                </div>
                <div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
                <div>
                    <div>1</div>
                    <div>2</div>
                    <div>3</div>
                </div>
                <div>
                    <div>1ssasa</div>
                    <div>2asasas</div>
                    <div>asasasas3</div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
