import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/outline';

type Props = {
    heading: string;
    content: string;
};

const Accordion: React.FC<Props> = (props): JSX.Element => (
    <HeadlessUI.Disclosure>
        {({ open }) => (
            <>
                <HeadlessUI.Disclosure.Button className="flex max-w-screen-sm justify-between rounded-lg bg-teal-100 px-4 py-2 text-left text-xl text-teal-900 outline-0 hover:bg-teal-200 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:bg-grey-700 dark:text-white lg:max-w-screen-md">
                    {props.heading}
                    <div className="mr-6 h-7 w-7">
                        <OutlineIcons.ChevronUpIcon
                            className={`${
                                open ? 'rotate-180 transform' : ''
                            } mx-4 h-7 w-7 text-teal-500 dark:text-white`}
                        />
                    </div>
                </HeadlessUI.Disclosure.Button>
                <HeadlessUI.Disclosure.Panel className="text-gray-70 w-10/12 px-4 pt-2 pb-6 text-sm dark:text-grey-200">
                    <p>{props.content}</p>
                </HeadlessUI.Disclosure.Panel>
            </>
        )}
    </HeadlessUI.Disclosure>
);

export default Accordion;
