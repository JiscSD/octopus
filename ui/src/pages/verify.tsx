import Head from 'next/head';

import * as React from 'react';
import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';
import * as Types from '@types';
import * as Helpers from '@helpers';
import * as Stores from '@stores';
import * as SolidIcons from '@heroicons/react/solid';
import * as OutlineIcons from '@heroicons/react/outline';
import * as HeadlessUI from '@headlessui/react';
import * as api from '@api';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    const token = Helpers.guardPrivateRoute(context);

    return {
        props: {}
    };
};

const Validate: Types.NextPage = (): React.ReactElement => {
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const setToast = Stores.useToastStore((state) => state.setToast);
    const [emailAddress, setEmailAddress] = React.useState('');
    const [showCode, setShowCode] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false);

    const submitEmail = () => {
        setLoading(true);
        requestCode();
    };

    const requestCode = async () => {
        try {
            setCode('');

            await api.get(`${Config.endpoints.verification}/${user?.orcid}?email=${emailAddress}`, user?.token);

            setShowCode(true);
            setLoading(false);

            setToast({
                visible: true,
                dismiss: true,
                title: 'Email sent',
                icon: <OutlineIcons.MailIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                message: 'Please check your inbox for your verification code.'
            });
        } catch (err) {
            setLoading(false);
            setToast({
                visible: true,
                dismiss: true,
                title: 'Unable to send verification email',
                icon: <OutlineIcons.MailIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                message: 'Please check your email address and try again.'
            });
        }
    };

    const verifyCode = async () => {
        try {
            setLoading(true);

            await api.post(`${Config.endpoints.verification}/${user?.orcid}`, { code }, user?.token);

            setLoading(false);
        } catch (err) {
            setLoading(false);
            setToast({
                visible: true,
                dismiss: true,
                title: 'Incorrect code',
                icon: <OutlineIcons.KeyIcon className="h-6 w-6 text-teal-400" aria-hidden="true" />,
                message: 'Please try again.'
            });
        }
    };

    const resetForm = () => {
        setShowCode(false);
        setCode('');
    };

    return (
        <>
            <Head>
                <meta name="description" content={Config.urls.terms.description} />
                <meta name="keywords" content={Config.urls.terms.keywords.join(', ')} />
                <link rel="canonical" href={Config.urls.terms.canonical} />
                <title>{user?.email ? 'Update your email address' : 'Complete your registration'}</title>
            </Head>

            <Layouts.Standard>
                <section className="mx-auto mb-10 grid grid-cols-1 gap-4 text-grey-900 transition-colors duration-500 dark:text-white-50 lg:w-8/12">
                    <Components.PageTitle
                        text={user?.email ? 'Update your email address' : 'Complete your registration'}
                    />
                    <form className="flex-column gap-4 space-y-4">
                        <label htmlFor="fullName" className="flex flex-col gap-1">
                            <span className="mb-1 flex items-center gap-1 text-xxs font-bold uppercase tracking-widest text-grey-600 transition-colors duration-500 dark:text-grey-300">
                                <SolidIcons.BadgeCheckIcon className="h-5 w-5 text-green-400" />
                                Your ORCID iD
                            </span>
                            <input
                                id="orcid"
                                disabled
                                type="text"
                                value={user?.orcid}
                                className="block w-full rounded border bg-white-100 text-grey-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-100 lg:w-1/2"
                            />
                        </label>
                        <label htmlFor="fullName" className="flex flex-col gap-1">
                            <span className="mb-1 flex items-center gap-1 text-xxs font-bold uppercase tracking-widest text-grey-700 transition-colors duration-500 dark:text-grey-300">
                                <SolidIcons.BadgeCheckIcon className="h-5 w-5 text-green-400" />
                                Your name
                            </span>
                            <input
                                id="fullName"
                                disabled
                                type="text"
                                value={`${user?.firstName} ${user?.lastName}`}
                                className="block w-full rounded border bg-white-100 text-grey-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:bg-grey-100 lg:w-1/2"
                            />
                        </label>
                        <HeadlessUI.Transition
                            show={!showCode}
                            enter="fade duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="fade duration-50"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <label htmlFor="email" className="flex flex-col gap-1">
                                <span className="mb-1 flex items-center gap-1 text-xxs font-bold uppercase tracking-widest text-grey-700 transition-colors duration-500 dark:text-grey-100">
                                    <SolidIcons.QuestionMarkCircleIcon className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                                    Your email address
                                </span>
                                <input
                                    id="email"
                                    type="email"
                                    className="block w-full rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:disabled:bg-white-100 dark:disabled:text-grey-600 lg:w-1/2"
                                    value={emailAddress}
                                    onChange={(e) => setEmailAddress(e.target.value)}
                                    disabled={loading}
                                />
                                <span className="mt-1 flex items-center gap-1 text-xs font-semibold tracking-widest text-grey-500 transition-colors duration-500 dark:text-grey-300">
                                    Please confirm your email address.
                                </span>
                            </label>
                            <span className="flex items-center gap-2">
                                <Components.Button
                                    onClick={submitEmail}
                                    disabled={!Boolean(emailAddress) || loading}
                                    title="Send code"
                                    className="justify-self-end px-0"
                                />
                                {loading && (
                                    <OutlineIcons.RefreshIcon className="h-5 w-5 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                )}
                            </span>
                        </HeadlessUI.Transition>
                        <HeadlessUI.Transition
                            show={showCode}
                            enter="delay-100 fade duration-500"
                            enterFrom="opacity-0"
                            enterTo="opacity-100"
                            leave="fade duration-60"
                            leaveFrom="opacity-100"
                            leaveTo="opacity-0"
                        >
                            <label htmlFor="code" className="flex flex-col gap-1">
                                <span className="mb-1 flex items-center gap-1 text-xxs font-bold uppercase tracking-widest text-grey-700 transition-colors duration-500 dark:text-grey-100">
                                    <SolidIcons.KeyIcon className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                                    Your verification code
                                </span>
                                <input
                                    id="code"
                                    type="text"
                                    className="block w-full rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:disabled:bg-white-100 dark:disabled:text-grey-600 lg:w-1/2"
                                    maxLength={7}
                                    placeholder="Enter your verification code"
                                    value={code}
                                    onChange={(e) => setCode(e.target.value)}
                                    autoComplete="off"
                                    disabled={loading}
                                />
                            </label>
                            <span className="flex items-center gap-2">
                                <Components.Button
                                    onClick={verifyCode}
                                    disabled={!!!code.length || loading}
                                    title="Verify code"
                                    className="justify-self-end px-0"
                                />
                                {loading && (
                                    <OutlineIcons.RefreshIcon className="h-5 w-5 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                )}
                            </span>
                            <div className="mt-4 text-xs font-medium tracking-wider text-grey-500 transition-colors duration-500 dark:text-grey-300">
                                <div className="mb-2 text-lg text-grey-700 dark:text-grey-100">
                                    Not received your code?
                                </div>
                                <p>
                                    We have sent an email to{' '}
                                    <span className="font-semibold text-grey-900 dark:text-grey-50">
                                        {emailAddress}
                                    </span>
                                    .
                                </p>
                                <p>
                                    Please check your spam folder. Alternatively, you can
                                    <Components.Button
                                        title="request a new code"
                                        onClick={requestCode}
                                        textSize="xs"
                                        padding="py-0"
                                        className="px-1"
                                    />
                                    or
                                    <Components.Button
                                        title="return to update your email address"
                                        onClick={resetForm}
                                        textSize="xs"
                                        padding="py-0"
                                        className="px-1"
                                    />
                                    .
                                </p>
                            </div>
                        </HeadlessUI.Transition>
                    </form>
                </section>
            </Layouts.Standard>
        </>
    );
};

export default Validate;
