import { Disclosure } from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/outline';

type Props = {
    heading: string;
    content: string;
};

const Accordion: React.FC<Props> = (props): JSX.Element => {
    return (
        <Disclosure>
            {({ open }) => (
                <>
                    <Disclosure.Button className="flex w-full justify-between rounded-lg bg-teal-100 px-4 py-2 text-left text-sm font-medium text-teal-900 hover:bg-teal-200 focus:outline-none focus-visible:ring focus-visible:ring-teal-500 focus-visible:ring-opacity-75 dark:bg-grey-700 dark:text-white">
                        {props.heading}
                        <OutlineIcons.ChevronUpIcon
                            className={`${open ? 'rotate-180 transform' : ''} h-5 w-5 text-teal-500 dark:text-white`}
                        />
                    </Disclosure.Button>
                    <Disclosure.Panel className="text-gray-700 px-4 pt-2 pb-2 text-sm dark:text-grey-200">
                        <p>{props.content}</p>
                    </Disclosure.Panel>
                </>
            )}
        </Disclosure>
    );
};

export default Accordion;
