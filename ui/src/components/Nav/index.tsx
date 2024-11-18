import React, { useCallback, useMemo } from 'react';
import ClickAwayListener from 'react-click-away-listener';

import * as Components from '@/components';
import * as Router from 'next/router';
import * as Interfaces from '@/interfaces';
import * as Config from '@/config';
import * as Stores from '@/stores';
import * as Helpers from '@/helpers';
import * as OutlineIcons from '@heroicons/react/24/outline';
import * as HeadlessUI from '@headlessui/react';
import * as Framer from 'framer-motion';

type FlickerLessLinkProps = {
    subItem: Interfaces.NavMenuItem;
    active: boolean;
    onClick?: (event: React.MouseEvent<HTMLAnchorElement>) => void;
};

const FlickerLessLink = React.forwardRef<HTMLAnchorElement, FlickerLessLinkProps>((props, ref) => {
    const { label, value, onClick } = props.subItem;

    return (
        <Components.Link
            ref={ref}
            href={value}
            onClick={onClick}
            className={`${
                props.active ? 'ring-yellow-400 hover:ring-transparent active:ring-yellow-400 ' : 'ring-transparent'
            } text-white m-0 block w-full rounded-md p-1 ring-2`}
        >
            {label}
        </Components.Link>
    );
});

FlickerLessLink.displayName = 'FlickerLessLink';

const Nav: React.FC = (): React.ReactElement => {
    const router = Router.useRouter();
    const { user, setUser } = Stores.useAuthStore();
    const [open, setOpen] = React.useState(false);

    const handleClose = useCallback(() => {
        setOpen(false);
    }, []);

    const handleLogOut = useCallback(
        (event: React.MouseEvent<HTMLAnchorElement>) => {
            event.preventDefault();
            Helpers.clearJWT();
            setUser(null);
            router.push({
                pathname: `${Config.urls.home.path}`
            });
        },
        [router, setUser]
    );

    const items = useMemo(() => {
        const menuItems: Interfaces.NavMenuItem[] = [
            {
                label: 'Browse',
                value: Config.urls.browsePublications.path
            },
            {
                label: 'About',
                value: '#about',
                subItems: [
                    {
                        label: 'Learn More',
                        value: Config.urls.about.path
                    },
                    {
                        label: 'Research Culture Report',
                        value: Config.urls.researchCultureReport.path
                    },
                    {
                        label: 'News and Updates',
                        value: Config.urls.blog.path
                    },
                    {
                        label: 'Our Aims',
                        value: Config.urls.octopusAims.path
                    }
                ]
            },
            {
                label: 'How To',
                value: '#how-to',
                subItems: [
                    {
                        label: 'Author Guide',
                        value: Config.urls.authorGuide.path
                    },
                    {
                        label: 'FAQ',
                        value: Config.urls.faq.path
                    },
                    {
                        label: 'API Documentation',
                        value: '/documentation/api'
                    }
                ]
            },
            {
                label: 'Publish',
                value: Config.urls.createPublication.path
            }
        ];

        if (user) {
            menuItems.push({
                label: user.firstName || user.lastName ? `${user?.firstName} ${user?.lastName}` : 'Anonymous User',
                value: `${Config.urls.viewUser.path}/${user.id}`,
                dataTestId: 'username-button',
                subItems: [
                    {
                        label: 'My Account',
                        value: Config.urls.account.path
                    },
                    {
                        label: 'My Bookmarks',
                        value: Config.urls.myBookmarks.path
                    },
                    {
                        label: 'Log out',
                        value: '#log-out',
                        onClick: handleLogOut
                    }
                ]
            });
        }

        return menuItems;
    }, [handleLogOut, user]);

    return (
        <>
            <div className="relative h-8 w-8 lg:hidden">
                <button
                    aria-label="Mobile Navigation Menu"
                    onClick={(e) => {
                        setOpen((prevState) => !prevState);
                    }}
                    onKeyDown={(e) => {
                        const key = e.code;

                        // if using keyboard navigation, focus first link in the dropdown for easier access
                        if (['Space', 'Enter'].includes(key)) {
                            e.preventDefault();
                            setOpen((prevState) => !prevState);
                            setTimeout(() => {
                                (document.querySelector('ul > li > a') as HTMLAnchorElement)?.focus();
                            }, 0);
                        }
                    }}
                    className="rounded border-transparent outline-0 focus:ring-2 focus:ring-yellow-400"
                >
                    <OutlineIcons.Bars3Icon
                        className={`h-8 w-8 text-teal-500 dark:text-white-50 ${
                            open && 'text-grey-100'
                        } transition-colors duration-500 `}
                    />
                </button>
                <Framer.AnimatePresence>
                    {open && (
                        <ClickAwayListener onClickAway={handleClose}>
                            <Framer.motion.nav
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.25 }}
                                exit={{ opacity: 0 }}
                                className="absolute right-0 top-10 z-50 w-max rounded bg-white-50 px-4 shadow-md dark:border-2 dark:border-teal-300 dark:bg-grey-800"
                            >
                                <ul>
                                    {items.map((item) => (
                                        <li key={item.value} className="my-4">
                                            {item.subItems?.length ? (
                                                <HeadlessUI.Menu as="div" className="relative inline-block text-left">
                                                    <HeadlessUI.Menu.Button className="rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50">
                                                        <span className="flex items-center">
                                                            {item.label}
                                                            <OutlineIcons.ChevronDownIcon className="ml-2 h-4 w-4 text-grey-500 transition-colors duration-500 dark:text-teal-500" />
                                                        </span>
                                                    </HeadlessUI.Menu.Button>
                                                    <HeadlessUI.Transition
                                                        as="div"
                                                        enter="transition ease-out duration-100"
                                                        enterFrom="transform opacity-0 scale-95"
                                                        enterTo="transform opacity-100 scale-100"
                                                        leave="transition ease-in duration-75"
                                                        leaveFrom="transform opacity-100 scale-100"
                                                        leaveTo="transform opacity-0 scale-95"
                                                    >
                                                        <HeadlessUI.Menu.Items
                                                            as="ul"
                                                            className="mt-1 focus:outline-none dark:divide-teal-600 dark:border-teal-500 dark:bg-grey-800"
                                                        >
                                                            {item.subItems.map((subItem, index) => (
                                                                <li
                                                                    key={index}
                                                                    className="py-2 pl-4 text-teal-600 transition-colors duration-500 dark:text-white-50"
                                                                >
                                                                    <HeadlessUI.Menu.Item>
                                                                        {({ active }) => (
                                                                            <FlickerLessLink
                                                                                active={active}
                                                                                subItem={subItem}
                                                                                onClick={(e) => {
                                                                                    if (
                                                                                        typeof subItem.onClick ===
                                                                                        'function'
                                                                                    ) {
                                                                                        subItem.onClick(e);
                                                                                    }

                                                                                    handleClose();
                                                                                }}
                                                                            />
                                                                        )}
                                                                    </HeadlessUI.Menu.Item>
                                                                </li>
                                                            ))}
                                                        </HeadlessUI.Menu.Items>
                                                    </HeadlessUI.Transition>
                                                </HeadlessUI.Menu>
                                            ) : (
                                                <Components.Link
                                                    href={item.value}
                                                    onKeyDown={(e) => {
                                                        const key = e.code;

                                                        if (key === 'Space') {
                                                            // prevent scroll and fire click event
                                                            e.preventDefault();
                                                            e.currentTarget.click();
                                                        }
                                                    }}
                                                    className="p-2"
                                                    onClick={handleClose}
                                                >
                                                    <span className="font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                                                        {item.label}
                                                    </span>
                                                </Components.Link>
                                            )}
                                        </li>
                                    ))}
                                </ul>
                            </Framer.motion.nav>
                        </ClickAwayListener>
                    )}
                </Framer.AnimatePresence>
            </div>

            <nav className="hidden lg:block">
                <ul className="flex items-center">
                    {items.map((item) => (
                        <li key={item.value} className="first:ml-0 last:mr-0 md:mx-1 lg:mx-2">
                            {item.subItems?.length ? (
                                <HeadlessUI.Menu as="div" className="relative z-50 inline-block text-left">
                                    <HeadlessUI.Menu.Button
                                        data-testid={item.dataTestId}
                                        className="rounded border-transparent p-2 font-medium text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-white-50"
                                    >
                                        <span className="flex items-center">
                                            {item.label}
                                            <OutlineIcons.ChevronDownIcon className="ml-2 h-4 w-4 text-grey-500 transition-colors duration-500 dark:text-teal-500" />
                                        </span>
                                    </HeadlessUI.Menu.Button>
                                    <HeadlessUI.Transition
                                        as="div"
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <HeadlessUI.Menu.Items
                                            as="ul"
                                            className="absolute right-0 mt-2 w-56 origin-top-right divide-y divide-grey-200 divide-opacity-40 rounded-md border-2 border-transparent bg-white-50 shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none dark:divide-teal-600 dark:border-teal-500 dark:bg-grey-800"
                                        >
                                            {item.subItems.map((subItem, index) => (
                                                <li
                                                    key={index}
                                                    className="p-2 text-teal-600 transition-colors duration-500 dark:text-white-50"
                                                >
                                                    <HeadlessUI.Menu.Item>
                                                        {({ active }) => (
                                                            <FlickerLessLink subItem={subItem} active={active} />
                                                        )}
                                                    </HeadlessUI.Menu.Item>
                                                </li>
                                            ))}
                                        </HeadlessUI.Menu.Items>
                                    </HeadlessUI.Transition>
                                </HeadlessUI.Menu>
                            ) : (
                                <Components.Link href={item.value} className="p-2">
                                    <span className="font-medium text-grey-800 transition-colors duration-500 dark:text-white-50">
                                        {item.label}
                                    </span>
                                </Components.Link>
                            )}
                        </li>
                    ))}
                </ul>
            </nav>
        </>
    );
};

export default Nav;
