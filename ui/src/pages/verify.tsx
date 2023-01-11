import * as React from 'react';

import { AxiosError } from 'axios';
import Head from 'next/head';
import Router from 'next/router';

import * as api from '@api';
import * as Components from '@components';
import * as Config from '@config';
import * as HeadlessUI from '@headlessui/react';
import * as Helpers from '@helpers';
import * as OutlineIcons from '@heroicons/react/outline';
import * as SolidIcons from '@heroicons/react/solid';
import * as Layouts from '@layouts';
import * as Stores from '@stores';
import * as Types from '@types';

export const getServerSideProps: Types.GetServerSideProps = async (context) => {
    // prevent unauthenticated users to access this page
    const decodedToken = await Helpers.guardPrivateRoute(context);
    const homeUrl = encodeURIComponent(Config.urls.home.path);
    const { state: redirectTo = homeUrl } = context.query;

    return {
        props: {
            redirectTo,
            newUser: !decodedToken.email, // new users don't have an email yet
            protectedPage: true
        }
    };
};

type Props = {
    redirectTo: string;
    newUser: boolean;
};

const Verify: Types.NextPage<Props> = (props): React.ReactElement => {
    const user = Stores.useAuthStore((state: Types.AuthStoreType) => state.user);
    const setUser = Stores.useAuthStore((state) => state.setUser);
    const setToast = Stores.useToastStore((state) => state.setToast);
    const [email, setEmail] = React.useState('');
    const [showCode, setShowCode] = React.useState(false);
    const [code, setCode] = React.useState('');
    const [loading, setLoading] = React.useState(false);
    const [error, setError] = React.useState('');
    const [success, setSuccess] = React.useState(false);
    const [emailValidated, setEmailValidated] = React.useState(true);

    const handleEmailChange = (event: React.ChangeEvent<HTMLInputElement>): void => {
        setEmailValidated(true);
        setEmail(event.target.value);
    };

    const submitEmail = () => {
        setLoading(true);

        const validEmail = Helpers.validateEmail(email);

        if (!validEmail) {
            setEmailValidated(false);
            setLoading(false);
            return;
        }

        requestCode();
    };

    const requestCode = async () => {
        try {
            setError('');
            setCode('');

            await api.get(`${Config.endpoints.verification}/${user?.orcid}?email=${email}`, user?.token);

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
            setError('');
            setLoading(true);

            // verify the supplied code, and if successful,
            const getToken = await api.post<{ token: string }>(
                `${Config.endpoints.verification}/${user?.orcid}`,
                { code },
                user?.token
            );

            // If success, decode the JWT, set the updated user, and redirect to state
            if (getToken.status == 200) {
                const decodedJWT = Helpers.setAndReturnJWT(getToken.data.token) as Types.UserType;
                if (decodedJWT && user) setUser({ ...decodedJWT, token: getToken.data.token });
                setSuccess(true);
                setTimeout(() => Router.push(decodeURIComponent(props.redirectTo)), 1000);
            } else {
                throw new Error();
            }
        } catch (err) {
            setLoading(false);
            const axiosError = err as AxiosError;

            // If not found, return to email entry step
            if (axiosError.response?.status === 404) {
                resetForm();
                setError('Too many failed attempts. Please enter your email address to request a new code.');
            } else {
                setError('Incorrect code. Please check your email and try again.');
            }
        }
    };

    const resetForm = () => {
        setError('');
        setShowCode(false);
        setCode('');
    };

    return (
        <>
            <Head>
                <meta name="robots" content="noindex, nofollow" />
                <link rel="canonical" href={Config.urls.terms.canonical} />
                <title>{props.newUser ? 'Complete your registration' : 'Update your email address'}</title>
            </Head>

            <Layouts.Standard>
                <section className="container mx-auto mb-10 grid grid-cols-1 gap-4 px-8 text-grey-900 transition-colors duration-500 dark:text-white-50 lg:pt-16">
                    <Components.PageTitle
                        text={props.newUser ? 'Complete your registration' : 'Update your email address'}
                    />
                    <p className="mb-6 block text-grey-700 transition-colors duration-500 dark:text-grey-50 lg:w-3/4">
                        {props.newUser && (
                            <>
                                Your Octopus account has been created, and is linked to your ORCID® iD. To complete your
                                account setup, please verify your email address.
                                <br />
                                <br />
                            </>
                        )}
                        A verified email is required for essential service notifications. We’ll use it as described in
                        our privacy notice (at{' '}
                        <Components.Link
                            href={Config.urls.privacy.canonical}
                            className="rounded border-transparent underline decoration-teal-500 underline-offset-2 outline-0 focus:overflow-hidden focus:ring-2 focus:ring-yellow-400"
                            openNew={true}
                        >
                            {Config.urls.privacy.canonical}
                        </Components.Link>
                        ) only to provide the Octopus service. We’ll store your email address until we are told that you
                        no longer wish to hold an account. You can update your email address at any time from your user
                        account page.
                    </p>
                    <form className="flex-column gap-4 space-y-6" data-testid="update-email-form">
                        {!!error && <Components.Alert severity="ERROR" title={error} />}
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
                            <label htmlFor="email" className="mb-4 flex flex-col gap-1">
                                <span className="mb-1 flex items-center gap-1 text-xxs font-bold uppercase tracking-widest text-grey-700 transition-colors duration-500 dark:text-grey-100">
                                    <SolidIcons.QuestionMarkCircleIcon className="h-5 w-5 text-teal-700 dark:text-teal-400" />
                                    Your{!props.newUser && ' new'} email address
                                </span>
                                <input
                                    data-testid="verify-email-input"
                                    id="email"
                                    type="email"
                                    className="block w-full rounded border bg-white-50 text-grey-800 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:disabled:bg-white-100 dark:disabled:text-grey-600 lg:w-1/2"
                                    value={email}
                                    onChange={handleEmailChange}
                                    disabled={loading}
                                />
                                <span className="mt-1 flex items-center gap-1 text-xs font-semibold tracking-widest text-grey-500 transition-colors duration-500 dark:text-grey-300">
                                    Please confirm your{!props.newUser && ' new'} email address.
                                </span>
                                {!emailValidated && (
                                    <Components.Alert
                                        severity="ERROR"
                                        title="Please enter a valid email address"
                                        className="mt-3 w-1/2"
                                    />
                                )}
                            </label>
                            <span className="flex items-center gap-2">
                                <Components.Button
                                    onClick={submitEmail}
                                    disabled={!Boolean(email) || loading}
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
                            <span className="mt-4 flex items-center gap-2">
                                <Components.Button
                                    onClick={verifyCode}
                                    disabled={!!!code.length || loading}
                                    title="Verify code"
                                    className="justify-self-end px-0"
                                />
                                <HeadlessUI.Transition
                                    show={loading && !success}
                                    enter="fade duration-500"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="fade duration-50"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <OutlineIcons.RefreshIcon className="h-5 w-5 animate-reverse-spin text-teal-600 transition-colors duration-500 dark:text-teal-400" />
                                </HeadlessUI.Transition>
                                <HeadlessUI.Transition
                                    show={success}
                                    enter="delay-100 fade duration-500"
                                    enterFrom="opacity-0"
                                    enterTo="opacity-100"
                                    leave="fade duration-60"
                                    leaveFrom="opacity-100"
                                    leaveTo="opacity-0"
                                >
                                    <OutlineIcons.BadgeCheckIcon className="h-5 w-5 text-green-400 transition-colors duration-500" />
                                </HeadlessUI.Transition>
                            </span>
                            <div className="mt-4 text-xs font-medium leading-relaxed text-grey-500 transition-colors duration-500 dark:text-grey-300">
                                <div className="mb-2 text-lg text-grey-700 dark:text-grey-100">
                                    Not received your code?
                                </div>
                                <p>
                                    We have sent an email to{' '}
                                    <span className="font-semibold text-grey-900 dark:text-grey-50">{email}</span>.
                                </p>
                                <p>
                                    Please check your spam folder. Alternatively, you can{' '}
                                    <Components.Button
                                        title="request a new code"
                                        onClick={requestCode}
                                        textSize="xs"
                                        padding="py-0"
                                        className="p-0"
                                    />{' '}
                                    or{' '}
                                    <Components.Button
                                        title="return to update your email address"
                                        onClick={resetForm}
                                        textSize="xs"
                                        padding="py-0"
                                        className="p-0"
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

export default Verify;
