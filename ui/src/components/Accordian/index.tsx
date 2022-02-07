import { Disclosure } from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/outline';

type Props = {
    heading: string;
    content: string;
};

const Accordian: React.FC<Props> = (props): JSX.Element => {
    return (
        <Disclosure>
            <Disclosure.Button>
                <div className="flex flex-row items-center gap-2">
                    <OutlineIcons.ChevronRightIcon className="w-10 text-teal-500" />
                    <h3 className="border-b-4 border-teal-300 pb-2 font-montserrat text-xl font-semibold">
                        {props.heading}
                    </h3>
                </div>
            </Disclosure.Button>
            <Disclosure.Panel>
                <p className="text-md mx-12 pb-6 text-justify">{props.content}</p>
            </Disclosure.Panel>
        </Disclosure>
    );
};

export default Accordian;
