import * as HeadlessUI from '@headlessui/react';
import * as OutlineIcons from '@heroicons/react/outline';

type Props = {
    heading: string;
    content: string;
};

const Accordion: React.FC<Props> = (props): React.ReactElement => (
    <HeadlessUI.Disclosure>
        {({ open }) => (
            <>
                <HeadlessUI.Disclosure.Button className="flex max-w-full justify-between rounded-lg bg-teal-100 px-4 py-2 text-left font-montserrat text-xl text-teal-900 outline-0 hover:bg-teal-200 focus:ring-2 focus:ring-yellow-400 focus:ring-offset-2 dark:bg-grey-700 dark:text-white-50">
                    {props.heading}
                    <div className="mr-6 h-7 w-7">
                        <OutlineIcons.ChevronUpIcon
                            className={`${
                                open ? 'rotate-180 transform' : ''
                            } mx-4 h-7 w-7 text-teal-500 dark:text-white-50`}
                        />
                    </div>
                </HeadlessUI.Disclosure.Button>
                <HeadlessUI.Disclosure.Panel className="w-full px-4 pt-2 pb-6 text-lg font-medium leading-7 text-grey-700 dark:text-grey-200">
                    <p>{props.content}</p>
                </HeadlessUI.Disclosure.Panel>
            </>
        )}
    </HeadlessUI.Disclosure>
);

export default Accordion;
