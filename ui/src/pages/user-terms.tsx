import React from 'react';
import { NextPage } from 'next';
import Head from 'next/head';
import * as OutlineIcons from '@heroicons/react/outline';
import * as Framer from 'framer-motion';

import * as Components from '@components';
import * as Layouts from '@layouts';
import * as Config from '@config';

type PageSectionProps = {
    children: React.ReactChildren | React.ReactChild | React.ReactElement;
};

type TextProps = {
    children: React.ReactChildren | React.ReactChild | React.ReactElement;
};

const PageSection: React.FC<PageSectionProps> = (props): React.ReactElement => {
    return (
        <Framer.motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ type: 'spring' }}
            className="container mx-auto my-16 mt-10 px-8 transition-all duration-500 lg:mx-auto lg:pt-10 2xl:my-36"
        >
            {props.children}
        </Framer.motion.div>
    );
};

const StandardText: React.FC<TextProps> = (props): React.ReactElement => {
    return (
        <p className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
            {props.children}
        </p>
    );
};

const UserTerms: NextPage = (): React.ReactElement => (
    <>
        <Head>
            <meta name="description" content={Config.urls.userTerms.description} />
            <meta name="keywords" content={Config.urls.userTerms.keywords.join(', ')} />
            <link rel="canonical" href={Config.urls.userTerms.canonical} />
            <title>{Config.urls.userTerms.title}</title>
        </Head>

        <Layouts.Standard fixedHeader={false}>
            <PageSection>
                <>
                    <div className="mx-auto block lg:w-9/12 xl:w-10/12 2xl:w-7/12">
                        <h1 className="mb-10 mt-5 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-5xl">
                            Octopus platform user terms
                        </h1>
                        <StandardText>
                            <>
                                Please read these Octopus Platform User Terms (<span className="font-bold">Terms</span>)
                                carefully before you access and use the resources and tools on the Octopus Service (
                                <span className="font-bold">the Service</span>).
                                <br />
                                <br /> These Terms form a legal agreement between the User, as applicable (
                                <span className="font-bold">you and your</span>), and Jisc (
                                <span className="font-bold">Jisc, us, we and our</span>) as the provider of the Service.
                                <br />
                                <br />
                                By using the Service in any way, you agree to be bound by these Terms. Use of the
                                Service includes browsing the Service website, accessing the guidance, resources and
                                tools provided on it or registering for a Registered User account.
                                <br />
                                <br />
                                <span className="font-bold">
                                    If you do not agree to these Terms, please do not use the guidance and resources
                                    provided on the Service.
                                </span>
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 1: GENERAL" className="mt-8" />
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    <span className="font-bold">About the service:</span> To see more information on the
                                    Jisc&apos;s Octopus service and what it offers see our service information page at:
                                    <Components.Link
                                        href={Config.urls.about.path}
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        https://www.octopus.ac/about.
                                    </Components.Link>
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">About Jisc:</span> The Service is operated by{' '}
                                    <Components.Link
                                        href="https://www.jisc.ac.uk/"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        Jisc
                                    </Components.Link>
                                    , a registered charity and company limited by guarantee registered in England with
                                    company number 05747339 and having its registered address at 4 Portwall lane,
                                    Bristol, BS1 6NB (Jisc).
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">To contact us</span> Please email:
                                    <Components.Link
                                        href="mailto:help@jisc.ac.uk"
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        help@jisc.ac.uk
                                    </Components.Link>
                                    <br />
                                    <br />
                                    <span className="font-bold">How these Terms apply:</span> These Terms apply to your
                                    access to and use of the Service
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Privacy Policy:</span> Our Privacy Policy also applies
                                    to your use of the Service:
                                    <Components.Link
                                        href={Config.urls.privacy.path}
                                        openNew={true}
                                        className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                    >
                                        https://www.octopus.ac/privacy
                                    </Components.Link>
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Changes to terms:</span> We may update these Terms and
                                    the Privacy Policy. Changes will have immediate effect from the date of posting on
                                    the Service website. All Service users should therefore review these Terms
                                    regularly. Your continued use of the Service after changes have been made will be
                                    taken to indicate that you have accepted and are bound by the updated terms. We
                                    reserve the right to revoke, withdraw or amend these Terms without notice.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Changes to the Service:</span> We may update and change
                                    our Service from time to time, for example, to reflect changes to our products or
                                    our users&apos; needs. We will try to give you reasonable notice of any major
                                    changes. Jisc does not guarantee that the Service website, or any content on it
                                    (including any guidance and resources), will be free from errors or omissions.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">We may suspend or withdraw the Service: </span> We do
                                    not guarantee that the Service website, or any content on it, will always be
                                    available or be uninterrupted. Use of the Service and access to the Service website
                                    is permitted on a temporary basis. We may suspend or withdraw or restrict the
                                    availability of all or any part of the Service website for business and operational
                                    reasons. We will try to give you reasonable notice of any suspension or withdrawal.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Viruses: </span> We have designed the Service following
                                    best practice in secure design and development however we cannot guarantee that the
                                    Service is virus / bug free and advises that you use up-to-date browsers and virus
                                    protection software.
                                </li>
                            </ul>
                        </div>
                        <Components.PageSubTitle text="SECTION 2: USERS" className="mt-8" />
                        <StandardText>
                            <>
                                Access to the Service is made available free of charge. Any individual who accesses the
                                Service is a Service user (<span className="font-bold">a User</span>). There are two
                                types of Users:
                            </>
                        </StandardText>
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <ul className="ml-8 mt-6 list-disc">
                                <li className="mb-6">
                                    An <span className="font-bold">Ordinary User </span> is a user anywhere in the world
                                    who accesses the Service via an internet device (and who has not logged into the
                                    Service as a Registered User). An Ordinary Users can search, browse, and view
                                    content published to the Service website, and use a limited set of resources and
                                    tools, in accordance with these Terms.
                                </li>
                                <li className="mb-6">
                                    A <span className="font-bold">Registered User </span> is an individual who has
                                    created an Octopus user account affiliated with an ORCID® iD by following the steps
                                    set out in Section 3. A Registered User can search, browse, and view content
                                    published to the site, but can also publish their own research as well as review,
                                    rate, create links between, and red flag others&apos; publications. Registered Users
                                    can use all of the resources on the Service website in accordance with these Terms.
                                </li>
                            </ul>
                        </div>
                        <Components.PageSubTitle text="SECTION 3: BECOMING A REGISTERED USER" className="mt-8" />
                        <StandardText>
                            <>
                                You agree that Jisc may access, store and use any personal information that you provide
                                to us in accordance with (i) these Terms, and (ii) the Service Privacy Policy as set out
                                above. You should read the Privacy Policy before registering, and you should not provide
                                us with any of your personal information if you do not agree to these Terms or the
                                Privacy Policy.
                                <br />
                                <br />
                                You will continue to have access to the Service as a Registered User until we are
                                otherwise notified. Should you wish to terminate access to the Service the Lead User
                                must notify us at{' '}
                                <Components.Link
                                    href="mailto:help@jisc.ac.uk"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    help@jisc.ac.uk.
                                </Components.Link>
                                <br />
                                <br />
                                If you know or suspect that anyone other than you knows your login details, you should
                                promptly tell us and change your login details.
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 4: INTELLECTUAL PROPERTY" className="mt-8" />
                        <StandardText>
                            <>
                                All content on the Service website is the copyright of Jisc or licensed to Jisc. If
                                anything on the Service is found to infringe the intellectual property rights of any
                                third party we will remove this as soon as possible after it is made aware of such
                                infringement. If you think this is the case then please get in touch at{' '}
                                <Components.Link
                                    href="mailto:help@jisc.ac.uk"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    help@jisc.ac.uk.
                                </Components.Link>
                                <br />
                                <br />
                                Subject to Section 9 and the paragraph below and in consideration of the mutual
                                obligations and promises as set out in these Terms (the sufficiency of which is
                                acknowledged by you and us) we hereby grant you a licence under these Terms to use the
                                Service and under the terms set out at:{' '}
                                <Components.Link
                                    href="https://creativecommons.org/licenses/by-nc/4.0/"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    https://creativecommons.org/licenses/by-nc/4.0/
                                </Components.Link>{' '}
                                to use the content on the Service website.
                                <br />
                                <br />
                                We are not responsible for the content of any website (whether under the control of Jisc
                                or not) that is linked to by the Service or within a resource. Any link is not intended
                                to be, nor should be construed as, an endorsement of any kind by us.
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 5: USER CONTENT" className="mt-8" />
                        <StandardText>
                            <>
                                Registered Users can create publications on the Service website, place red flags against
                                content or add links between other&apos;s content (
                                <span className="font-bold">User Content</span>).
                                <br />
                                <br />
                                When you create a publication on the Service website as a Registered User, you will be
                                required to provide us with a licence to use your content as part of the Service under
                                the following licence terms:{' '}
                                <Components.Link
                                    href="https://creativecommons.org/licenses/by-nc/4.0/."
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    https://creativecommons.org/licenses/by-nc/4.0/.
                                </Components.Link>
                                <br />
                                <br />
                                Other User Content created as a Registered User, will be publicly viewable on the
                                Service website including your public user profile.
                            </>
                        </StandardText>
                        <Components.PageSubTitle
                            text="SECTION 6: USER CONTENT - DATA PROCESSING ARRANGEMENTS"
                            className="mt-8"
                        />
                        <StandardText>
                            <>
                                In this Section 6 all capitalised terms are as defined in Schedule 1.
                                <br /> Both you and we acknowledge that the factual arrangements in respect of the
                                processing of Personal Data dictates the classification of each party in respect of the
                                Data Protection Legislation. Notwithstanding the foregoing, it is anticipated and agreed
                                that you shall act as a Controller and Jisc shall act as a Processor in respect of
                                Processing of any Personal Data in your User Content that you make available in
                                connection with your use of the Service and Schedule 1 sets out the relevant obligations
                                of each party in that respect.
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 7: CONDITIONS OF USE OF THE SERVICE" className="mt-8" />
                        <StandardText>
                            <span className="font-bold">All Users shall:</span>
                        </StandardText>
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">only access and use the Service on these Terms</li>
                            </ul>
                        </div>
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <span className="font-bold">Users shall not:</span>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    copy and content on the Service Website, other than in accordance with these Terms
                                    or the licence terms applicable to any User Content;
                                </li>
                                <li className="mb-6">
                                    do anything which may cause (whether on purpose or not) the introduction or spread
                                    of a virus, Trojan horse, logic bombs spyware or any other programs designed to
                                    affect the operation of any computer software or hardware;
                                </li>
                                <li className="mb-6">
                                    attempt to gain unauthorised access to the Service website, the server on which the
                                    Service website is stored or any server or computer or database connected to the
                                    Service website;
                                </li>
                                <li className="mb-6">
                                    attack the Service website via a denial-of-service attack or a distributed denial-of
                                    service attack;
                                </li>
                                <li className="mb-6">act dishonestly or unprofessionally</li>
                                <li className="mb-6">create a false identity on the Service website</li>
                                <li className="mb-6">
                                    misrepresent your current or previous positions, professional qualifications
                                    employment for, affiliation with any organisation or other accreditations;
                                </li>
                                <li className="mb-6">use (or attempt to use) any other Users log-in details;</li>
                                <li className="mb-6">link to the Service website:</li>
                            </ul>
                            <ul className="ml-16 list-disc">
                                <li className="mb-6">
                                    in a way that damages Jisc&apos;s reputation or takes advantage of it;
                                </li>
                                <li className="mb-6">
                                    in a way that suggests any form of association, approval or endorsement on
                                    Jisc&aposs;s part where none exists;
                                </li>
                                <li className="mb-6">
                                    where Jisc has withdrawn permission to link to the Service website;
                                </li>
                            </ul>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    sell, rent, lease, redistribute, broadcast, publicly display, transmit, communicate,
                                    modify, sub-license or transfer or assign any part of the Service website, or your
                                    rights to use the Service website (under these Terms) to any third party
                                </li>
                                <li className="mb-6">infringe the rights of Jisc or of any other User; or</li>
                                <li className="mb-6">
                                    use the Service or the Service website unlawfully or fraudulently at any time.
                                </li>
                            </ul>
                        </div>
                        <Components.PageSubTitle text="SECTION 8: BREACH OF THESE TERMS" className="mt-8" />
                        <StandardText>
                            Where Jisc reasonably believes or suspects that a User is in breach of these Terms (or any
                            other terms reference herein), Jisc may take such action as it deems appropriate (at its
                            discretion), including:
                        </StandardText>
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">issuing a warning;</li>
                                <li className="mb-6">
                                    removing users from accessing the Service at any time, without warning
                                </li>
                                <li className="mb-6">closing or suspending your account at any time without notice;</li>
                                <li className="mb-6">
                                    taking legal proceedings against you for reimbursement of all costs on an indemnity
                                    basis (including, but not limited to, reasonable administrative and legal costs)
                                    resulting from the breach;
                                </li>
                                <li className="mb-6">taking any further legal action against you; and/ or</li>
                                <li className="mb-6">
                                    disclosing such information to law enforcement authorities as we reasonably feel is
                                    necessary.
                                </li>
                            </ul>
                        </div>
                        <Components.PageSubTitle text="SECTION 9: OTHER JISC MATERIAL" className="mt-8" />
                        <StandardText>
                            <>
                                The Service website contains materials which are owned by or licensed to Jisc and which
                                are not subject to the licensing arrangements described in Section 4 above.
                                <br /> <br />
                                Any content not explicitly licensed under these Terms or any Creative Commons licence
                                should be assumed to be the property of Jisc. Such content will include (but is not
                                limited to) logos and trading names (including but not limited to the Jisc trade mark),
                                certain text, photographic and video images, sound recordings and the design, layout and
                                appearance of and graphics contained within the Service (
                                <span className="font-bold">Jisc Materials</span>
                                ). Jisc Materials are protected by applicable intellectual property and other laws. You
                                agree that you will not use Jisc Materials for any purpose whatsoever, except for the
                                use of the Service or Service as permitted under these Terms.
                            </>
                        </StandardText>
                        <Components.PageSubTitle
                            text="SECTION 10: ACCURACY OF USER CONTENT AND JISC MATERIALS"
                            className="mt-8"
                        />
                        <StandardText>
                            <>
                                We may (without notice) update the Service from time to time and may change or update
                                the guidance and resources available on the Service website at any time.
                                <br />
                                <br />
                                The User Content and any guidance and resources made available on the on the Service
                                website may be out of date at any given time, and Jisc is under no obligation to update
                                it. Jisc does not guarantee that the Service website, or any User Content or any
                                guidance and resources, will be free from errors or omissions
                                <br />
                                <br />
                                If you have an issue or concern with any of the content on the Service website then
                                please get in touch at{' '}
                                <Components.Link
                                    href="mailto:help@jisc.ac.uk."
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    help@jisc.ac.uk.
                                </Components.Link>
                                <br />
                                <br />
                                Jisc is not responsible for the content of any website (whether under the control of
                                Jisc or not) that is linked to on Service or within a resource. Any link is not intended
                                to be, nor should be construed as, an endorsement of any kind by us
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 11: CONTINUITY OF SERVICE" className="mt-8" />
                        <StandardText>
                            <>
                                Jisc does not guarantee that the Service or the Service website, or any content on it,
                                will always be available or be uninterrupted. Access to the Service and use of the User
                                Content and guidance and resources is permitted on a temporary basis. Jisc will not be
                                liable to you or to any third party if for any reason the Service or the Service website
                                is unavailable at any time or for any period.
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 12: LIABILITY" className="mt-8" />
                        <StandardText>
                            To the extent permitted by law, Jisc excludes all conditions, warranties, representations or
                            other terms which may apply to the Service, the Service website or any User Content or
                            guidance and resources made available on it, whether express or implied. In particular, Jisc
                            excludes all conditions, warranties, representations or other terms:
                        </StandardText>
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    that any User Content, guidance or resource will be of satisfactory quality or fit
                                    for purpose;
                                </li>
                                <li className="mb-6">
                                    in respect of the suitability of any User Content, guidance or resource, or
                                    information and services contained on, or accessed via the Service website
                                </li>
                                <li className="mb-6">
                                    in respect of the content of websites linked on the Service website;
                                </li>
                                <li className="mb-6">
                                    that any User Content, guidance or resource complies with applicable laws and
                                    regulation (including local laws which a resource may be subject to);
                                </li>
                                <li className="mb-6">
                                    that use of the Service website or any resource will be compatible with all hardware
                                    and software
                                </li>
                                <li className="mb-6">
                                    that the Service or Service website will be bug or virus free, or that access to the
                                    Service website will be uninterrupted;
                                </li>
                                <li className="mb-6">
                                    that the use of Service or Service website or any content on it, will deliver a
                                    specific outcome for Users; or
                                </li>
                                <li className="mb-6">that defects in Service or Service website will be corrected</li>
                            </ul>
                        </div>
                        <StandardText>
                            <>
                                If Jisc is liable to you in relation to your use of the Service for any cause whatever,
                                and regardless of the form of the action then, unless the law says otherwise, we will
                                only be responsible to you for loss or damage you suffer (i) that is a foreseeable
                                result of our breach of these Terms; and (ii) up to a maximum of five hundred pounds
                                Sterling (<span className="font-bold">£500</span>).
                                <br />
                                <br />
                                Nothing in these Terms excludes or limits Jisc&apos;s liability for death or personal
                                injury arising from our negligence, or our fraud or fraudulent misrepresentation, or any
                                other liability that cannot be excluded or limited by law.
                                <br />
                                <br />
                                By using the Service or Service website, each User agrees that, if Jisc suffer any
                                losses, damages or expenses as a result of that User&apos;s use of the Service or
                                Service website, that User will reimburse Jisc for any such losses that are incurred as
                                a result of that User&apos;s breach of (or failure to comply with) these Terms or any
                                User Content licensing arrangements.
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 13: ACCESSIBILITY" className="mt-8" />
                        <StandardText>
                            <>
                                <span className="font-bold">
                                    The Service&apos;s accessibility statement is set out at{' '}
                                </span>
                                <Components.Link
                                    href={Config.urls.accessibility.path}
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    https://www.octopus.ac/accessibility
                                </Components.Link>
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 14: COMPLAINTS" className="mt-8" />
                        <StandardText>
                            <>
                                Jisc has an internal complaints procedure. We aim to handle all complaints efficiently
                                and quickly. If you have complaints regarding the Service please visit{' '}
                                <Components.Link
                                    href="https://www.jisc.ac.uk/contact/complaints-and-escalations"
                                    openNew={true}
                                    className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                >
                                    https://www.jisc.ac.uk/contact/complaints-and-escalations
                                </Components.Link>{' '}
                                and follow the instructions on that page
                            </>
                        </StandardText>
                        <Components.PageSubTitle text="SECTION 15: MISCELLANEOUS" className="mt-8" />
                        <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                            <ul className="ml-8 list-disc">
                                <li className="mb-6">
                                    <span className="font-bold">No partnership: </span> Users acknowledge that these
                                    Terms do not create or imply any partnership, joint venture or trust relationship
                                    between Jisc and any User.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Entire agreement: </span> These Terms (including the
                                    Privacy Policy and any relevant User Content licence terms) contain all the terms
                                    applicable to the use of the Service and Service website by you, and form the entire
                                    agreement between you and Jisc.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Invalidity/ enforceability: </span>Each of the terms of
                                    these Terms operates separately. If any court or competent authority decides that
                                    any of them are unlawful or unenforceable, the remaining conditions will remain in
                                    full force and effect.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">No waiver: </span>If Jisc fails to insist that you
                                    perform any of your obligations, or if Jisc does not enforce its rights against you,
                                    or if Jisc delays in doing so, that will not mean that Jisc has waived its rights
                                    against you and will not mean that you do not have to comply with those obligations.
                                    Any waiver would need to be given by Jisc in writing.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Matters outside of Jisc&apos;s control: </span>Jisc will
                                    not be liable or responsible for any failure to perform, or delay in performance of,
                                    any of its obligations under these Terms if that is caused by events outside
                                    Jisc&apos;s reasonable control, including any act, event, non-happening, omission or
                                    accident beyond our reasonable control. Some examples of such an event are:
                                </li>
                            </ul>
                            <ul className="ml-16 list-disc">
                                <li className="mb-6">Strikes, lock-outs or other industrial action;</li>
                                <li className="mb-6">
                                    Civil commotion, riot, invasion, terrorist attack or threat of terrorist attack, war
                                    (whether declared or not) or threat or preparation for war;
                                </li>
                                <li className="mb-6">
                                    Fire, explosion, storm, flood, earthquake, subsidence, epidemic or other natural
                                    disaster;
                                </li>
                                <li className="mb-6">
                                    Impossibility of the use of railways, shipping, aircraft, motor transport or other
                                    means of public or private transport;
                                </li>
                                <li className="mb-6">
                                    Impossibility of the use of public or private telecommunications networks; or
                                </li>
                                <li className="mb-6">
                                    The acts, decrees, legislation, regulations or restrictions of any government.
                                </li>
                                Jisc&apos;s performance under these Terms will be suspended for the period that such
                                events set out above continues, and Jisc will have an extension of time to carry out
                                their obligations under any contract for the duration of that period. Where possible,
                                Jisc will use reasonable efforts to bring such event detailed above to a close or to
                                find a solution.
                            </ul>
                            <ul className="ml-8 list-disc">
                                <li className="mb-6 mt-6">
                                    <span className="font-bold">Notices to you: </span> These Terms and the Privacy
                                    Policy are drawn up in the English language. All written communications between you
                                    and us relating to these Terms and the Privacy Policy will be given in English. We
                                    will send any notices relating to any of the matters set out in these Terms to the
                                    email address you use to access the Service or the Service.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Governing law: </span> These Terms and any dispute in
                                    relation to the materials available from the Service will be governed by laws of
                                    England and Wales.
                                </li>
                                <li className="mb-6">
                                    <span className="font-bold">Jurisdiction: </span> The English courts have exclusive
                                    jurisdiction to settle any disputes which may arise out of or in connection with
                                    these Terms or use of the Service and/or Service website
                                </li>
                            </ul>
                        </div>
                        <h1 className="my-12 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-4xl">
                            OCTOPUS PLATFORM USER TERMS: SCHEDULE 1 - DATA PROCESSING
                        </h1>
                        <Components.PageSubTitle text="1. DEFINITIONS AND INTERPRETATION" />
                        <StandardText>
                            <div className="grid grid-cols-12">
                                <div className="col-span-1">1.1</div>{' '}
                                <div className="col-span-11">
                                    In this schedule, unless the context otherwise requires, the following words shall
                                    have the following meanings:
                                </div>
                                <div className="col-span-1"></div>
                                <div className="col-span-11">
                                    <br />
                                    <br />
                                    <span className="font-bold">Applicable Law</span>
                                    <br />
                                    means all applicable laws, statutes, regulations, decree directives, legislative
                                    enactments, orders, binding decisions of a competent Court or Tribunal, rule,
                                    regulatory policies, guidelines, codes, other binding restriction, regulatory
                                    permits and licences applicable under law which are in force from time to time
                                    during the provision of the Service to which a party and/or any Processing of
                                    Personal Data is subject from time to time;
                                    <br />
                                    <br />
                                    <span className="font-bold">Appointed Sub-contractors</span>
                                    <br />
                                    means a sub-contractor appointed in accordance with Clause 4.1.7. For the purposes
                                    of this schedule, the sub-contractors described in Annex B shall be deemed to have
                                    been appointed in accordance with that Clause;
                                    <br />
                                    <br />
                                    <span className="font-bold">Controller</span>
                                    <br />
                                    has the meaning set out in the UK GDPR;
                                    <br />
                                    <br />
                                    <span className="font-bold">Data Protection Legislation</span>
                                    <br />
                                    means (a) any law, statute, declaration, decree, directive, legislative enactment,
                                    order, ordinance, regulation, rule or other binding restriction which relates to the
                                    protection of individuals with regards to the Processing of Personal Data to which a
                                    Party is subject for the purposes of these Terms, including the Data Protection Act
                                    2018 and the General Data Protection Regulation 2016/679 (
                                    <span className="font-bold">EU GDPR</span>) as each is amended in accordance with
                                    the Data Protection, Privacy and Electronic Communications (Amendments etc) (EU
                                    Exit) Regulations 2019 (as amended by SI 2020 no. 1586) and incorporated into UK law
                                    under the UK European Union (Withdrawal) Act 2018, as amended to be referred to as{' '}
                                    <span className="font-bold">DPA 2018</span> and the{' '}
                                    <span className="font-bold">UK GDPR </span>respectively; and (b) any code of
                                    practice or guidance published by the ICO or European Data Protection Board from
                                    time to time;
                                    <br />
                                    <br />
                                    <span className="font-bold">Data Protection Particulars</span>
                                    <br />
                                    means, in relation to any Processing under these Terms:
                                    <br />
                                    <div className="mx-auto mb-5 block font-montserrat text-lg font-medium leading-relaxed text-grey-700 transition-colors duration-500 dark:text-grey-100">
                                        <ol className="list-none">
                                            <li className="ml-6">
                                                (a) the subject matter and duration of the Processing;
                                            </li>
                                            <li className="ml-6">(b) the nature and purpose of the Processing;</li>
                                            <li className="ml-6">(c) the type of Personal Data being Processed;</li>
                                            <li className="ml-6">(d) the categories of Data Subjects; and</li>
                                            <li className="ml-6">
                                                (e) as applicable, the permitted recipients of the Personal Data;
                                            </li>
                                        </ol>
                                        <br />
                                        <span className="font-bold">Data Quality Requirements</span>
                                        <br />
                                        means those requirements set out in Article 5(1)(c) to (e) (inclusive) of the UK
                                        GDPR;
                                        <br />
                                        <br />
                                        <span className="font-bold">Data Subject Request</span>
                                        <br />
                                        means an actual or purported subject access request or notice or complaint from
                                        (or on behalf of) a Data Subject exercising their rights under the Data
                                        Protection Legislation;
                                        <br />
                                        <br />
                                        <span className="font-bold">Data Subject</span>
                                        <br />
                                        has the meaning set out in the UK GDPR;
                                        <br />
                                        <br />
                                        <span className="font-bold">Freedom of Information Laws</span>
                                        <br />
                                        means the Freedom of Information Act 2000 (and any Scottish equivalent), the
                                        Environmental Information Regulations 2004 (and any Scottish equivalent) and any
                                        subordinate legislation made under this Act from time to time together with any
                                        guidance and/or codes of practice issued by the UK Information Commissioner or
                                        relevant Government Department in relation to such legislation;
                                        <br />
                                        <br />
                                        <span className="font-bold">ICO</span>
                                        <br />
                                        means the UK Information Commissioner (including any successor or replacement);
                                        <br />
                                        <br />
                                        <span className="font-bold">Permitted Country</span>
                                        <br />
                                        means a country, territory or jurisdiction that is either: (a) within the UK or
                                        the European Economic Area; or (b) outside of the UK or European Economic Area
                                        but which is the subject of an adequacy determination by the UK Secretary of
                                        State or the European Commission (as applicable);
                                        <br />
                                        <br />
                                        <span className="font-bold">Permitted Purpose</span>
                                        <br />
                                        for Jisc to provide the Service;
                                        <br />
                                        <br />
                                        <span className="font-bold">Personal Data</span>
                                        <br />
                                        has the meaning set out in the UK GDPR;
                                        <br />
                                        <br />
                                        <span className="font-bold">Personal Data Breach</span>
                                        <br />
                                        has the meaning set out in the UK GDPR (where the Personal Data directly
                                        affected by the breach of security is that described in the Data Protection
                                        Particulars) and, for the avoidance of doubt, includes a breach of Clause 4.1.3;
                                        <br />
                                        <br />
                                        <span className="font-bold">Personnel</span>
                                        <br />
                                        means all persons engaged or employed from time to time by Jisc in connection
                                        with these Terms, including employees, consultants, contractors and permitted
                                        agents;
                                        <br />
                                        <br />
                                        <span className="font-bold">Processing</span>
                                        <br />
                                        has the meaning set out in the UK GDPR (and{' '}
                                        <span className="font-bold">Process and Processed</span> shall be construed
                                        accordingly);
                                        <br />
                                        <br />
                                        <span className="font-bold">Processor</span>
                                        <br />
                                        has the meaning set out in the UK GDPR;
                                        <br />
                                        <br />
                                        <span className="font-bold">Regulator</span>
                                        <br />
                                        means the ICO and any other independent public authority which has jurisdiction
                                        over a Party, including any regulator or supervisory authority which is
                                        responsible for the monitoring and application of the Data Protection
                                        Legislation
                                        <br />
                                        <br />
                                        <span className="font-bold">Regulator Correspondence</span>
                                        <br />
                                        means any correspondence from a Regulator in relation to the Processing of the
                                        Personal Data in the User Content under or in connection with these Terms;
                                        <br />
                                        <br />
                                        <span className="font-bold">Security Requirements</span>
                                        <br />
                                        means the requirements regarding the security of the Personal Data, as set out
                                        in the Data Protection Legislation (including, in particular, the measures set
                                        out in Article 32(1) of the UK GDPR (taking due account of the matters described
                                        in Article 32(2) of the UK GDPR)) as applicable;
                                        <br />
                                        <br />
                                        <span className="font-bold">Third Party Request</span>
                                        <br />
                                        means a written request from any third party for disclosure of the Personal Data
                                        where compliance with such request is required or purported to be required by
                                        law or regulation; and
                                        <br />
                                        <br />
                                        <span className="font-bold">User Content</span>
                                        <br />
                                        has the meaning as set out in Section 5 of the Terms;
                                        <br />
                                        <br />
                                    </div>
                                </div>
                            </div>
                        </StandardText>
                        <StandardText>
                            <>
                                <Components.PageSubTitle text="2. DATA PROTECTION ARRANGEMENTS" className="my-8" />
                                <div className="grid grid-cols-12">
                                    <div className="col-span-1">2.1</div>
                                    <div className="col-span-11 mb-6">
                                        Both you and we acknowledge that the factual arrangements in respect of the
                                        processing of Personal Data dictates the classification of each party in respect
                                        of the Data Protection Legislation. Notwithstanding the foregoing, it is
                                        anticipated and agreed that you shall act as a Controller and Jisc shall act as
                                        a Processor in respect of Processing of any Personal Data in your User Content
                                        that you make available in connection with your use of the Service.
                                    </div>
                                    <div className="col-span-1">2.2</div>
                                    <div className="col-span-11 mb-6">
                                        Both you and we acknowledge and agree that Annex A contains an accurate
                                        description of the Data Protection Particulars.
                                    </div>
                                    <div className="col-span-1">3</div>
                                    <div className="col-span-11 mb-6 font-bold">CONTROLLER OBLIGATIONS</div>
                                    <div className="col-span-1">3.1</div>
                                    <div className="col-span-11 mb-6 ">
                                        You, in your capacity as Controller in respect of the Processing of the Personal
                                        Data in your User Content, shall:
                                    </div>
                                    <div className="col-span-2"> </div>
                                    <div className="col-span-10 mb-6 ">
                                        <ul>
                                            <li className="mb-6">
                                                (a) comply with your obligations as Controller under the Data Protection
                                                Legislation;
                                            </li>
                                            <li className="mb-6">
                                                (b) ensure that you are not subject to any prohibition or restriction
                                                which would:
                                                <ul className="ml-6 mt-6">
                                                    <li className="mb-6">
                                                        (i) prevent or restrict you from disclosing or transferring the
                                                        Personal Data to Jisc, as required under these Terms or
                                                    </li>
                                                    <li>
                                                        (ii) prevent or restrict you from granting Jisc access to the
                                                        Personal Data, as required under these Terms;
                                                    </li>
                                                </ul>
                                            </li>
                                            <li className="mb-8">
                                                (c) ensure that all fair processing notices have been given (and/or, as
                                                applicable, consents obtained) and are sufficient in scope to enable
                                                each Jisc to Process the Personal Data as required in order to obtain
                                                the benefit of its rights and to fulfil its obligations under these
                                                Terms accordance with the Data Protection Legislation; and
                                            </li>
                                            <li>
                                                (d) notify Jisc promptly (and in any event within forty-eight (48)
                                                hours) following its receipt of any Regulator Correspondence.
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="col-span-1">4.</div>
                                    <div className="col-span-11 mb-6 font-bold"> PROCESSOR OBLIGATIONS</div>
                                    <div className="col-span-1">4.1</div>
                                    <div className="col-span-11 mb-6">
                                        Jisc, as a Processor in relation to any Personal Data Processed on your behalf
                                        pursuant to these Terms undertakes that it shall:
                                    </div>
                                    <div className="col-span-2">4.1.1</div>
                                    <div className="col-span-10 mb-6 ">
                                        process the Personal Data for and on your behalf in connection with the
                                        Permitted Purpose only and for no other purpose in accordance with these Terms,
                                        and any instructions from you;
                                    </div>
                                    <div className="col-span-2">4.1.2</div>
                                    <div className="col-span-10 mb-6 ">
                                        unless prohibited by law, promptly notify you (and in any event within
                                        forty-eight (48) hours of becoming aware of the same) if it considers, in its
                                        opinion (acting reasonably) that it is required by Applicable Law to act other
                                        than in accordance with your instructions, including where it believes that any
                                        of your instructions under Clause 4.1.1 infringes any of the Data Protection
                                        Legislation;
                                    </div>
                                    <div className="col-span-2">4.1.3</div>
                                    <div className="col-span-10 mb-6 ">
                                        implement and maintain appropriate technical and organisational security
                                        measures to comply with at least the obligations imposed on a Controller by the
                                        Security Requirements;
                                    </div>
                                    <div className="col-span-2">4.1.4</div>
                                    <div className="col-span-10 mb-6 ">
                                        take all reasonable steps to ensure the reliability and integrity of any of the
                                        Personnel who shall have access to the Personal Data, and ensure that each
                                        member of Personnel shall have entered into appropriate contractually-binding
                                        confidentiality undertakings;
                                    </div>
                                    <div className="col-span-2">4.1.5</div>
                                    <div className="col-span-10 mb-6 ">
                                        notify you promptly, and in any event within forty-eight (48) hours, upon
                                        becoming aware of any actual or suspected, threatened or &apos;near miss&apos;
                                        Personal Data Breach, and:
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (a) implement any measures necessary to restore the security of compromised
                                        Personal Data
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (b) assist you to make any notifications to the ICO and affected Data Subjects
                                    </div>
                                    <div className="col-span-2">4.1.6</div>
                                    <div className="col-span-10 mb-6 ">
                                        notify you promptly (and in any event within forty-eight (48) hours) following
                                        its receipt of any Data Subject Request or Regulator Correspondence and shall:
                                    </div>

                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (a) not disclose any of the Personal Data in response to any Data Subject
                                        Request or Regulator Correspondence without your prior written consent; and
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (b) provide you with all reasonable co-operation and assistance you require in
                                        relation to any such Data Subject Request or Regulator Correspondence;
                                    </div>

                                    <div className="col-span-2">4.1.7</div>
                                    <div className="col-span-10 mb-6 ">
                                        not disclose the Personal Data to a third party in any circumstances without
                                        your prior written consent, other than:
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (a) in relation to Third Party Requests where Jisc is required by law to make
                                        such a disclosure, in which case it shall use reasonable endeavours to advise
                                        you in advance of such disclosure and in any event as soon as practicable
                                        thereafter, unless prohibited by law or regulation from notifying you;
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (b) to Jisc&apos;s employees, officers, representatives and advisers who need to
                                        know such information for the purposes of Jisc performing its obligations under
                                        these Terms and in this respect Jisc shall ensure that its employees, officers,
                                        representatives and advisers to whom it discloses the Personal Data are made
                                        aware of their obligations with regard to the use and security of Personal Data
                                        under these Terms; and
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">(c) to an Appointed Sub-contractor;</div>
                                    <div className="col-span-2">4.1.8</div>
                                    <div className="col-span-10 mb-6 ">
                                        not Process or transfer the Personal Data outside of a Permitted Country without
                                        putting in place measures to ensure compliance with Data Protection Legislation;
                                    </div>
                                    <div className="col-span-2">4.1.9</div>
                                    <div className="col-span-10 mb-6 ">
                                        on the written request from you, allow you or your representatives to audit Jisc
                                        in order to ascertain compliance with the terms of this Clause 4.1 and/ or to
                                        provide the you with reasonable information to demonstrate compliance with the
                                        requirements of this Clause 4.1, provided that:
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (a) you shall only be permitted to exercise your rights under this Clause 4.1.9
                                        no more frequently than once in any 12 month period (other than where an audit
                                        is being undertaken in connection with an actual or &apos;near miss&apos;
                                        Personal Data Breach, in which case, an additional audit may be undertaken
                                        within thirty (30) days of us having notified you of actual or &apos;near
                                        miss&apos; Personal Data Breach);
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (b) each such audit shall be performed at your sole expense;
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (c) you shall not, in your performance of each such audit, unreasonably disrupt
                                        the business operations of Jisc;
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (d) you shall comply with Jisc&apos;s health and safety, security, conduct and
                                        other rules, procedures and requirements in relation to Jisc&apos;s property and
                                        systems which have been notified by Jisc to you in advance; and
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (e) in no case shall you be permitted to access any data, information or records
                                        relating to any other customer of Jisc;
                                    </div>
                                    <div className="col-span-2">4.1.10</div>
                                    <div className="col-span-10 mb-6 ">
                                        except to the extent required by Applicable Law, on the earlier of:
                                    </div>
                                    <div className="col-span-3"></div>
                                    <div className="col-span-9 mb-6 ">
                                        (a) the date of termination or expiry of these Terms (as applicable); and/or
                                    </div>
                                    <div className="col-span-2"></div>
                                    <div className="col-span-10 mb-6 ">
                                        cease Processing any of the Personal Data and, within sixty (60) days of the
                                        date being applicable under this Clause 4.1.10, return or destroy (as directed,
                                        in writing, by you) the Personal Data belonging to, or under your control and
                                        ensure that all such data is securely and permanently deleted from its systems,
                                        provided that Jisc shall be entitled to retain copies of the Personal Data for
                                        evidential purposes and to comply with legal and/or regulatory requirements;
                                    </div>
                                    <div className="col-span-2">4.1.11</div>
                                    <div className="col-span-10 mb-6 ">
                                        comply with the obligations imposed upon a Processor under the Data Protection
                                        Legislation; and
                                    </div>
                                    <div className="col-span-1">4.2</div>
                                    <div className="col-span-11 mb-6 ">
                                        Notwithstanding anything in these Terms to the contrary, this Clause 4 shall
                                        continue in full force and effect for so long as Jisc Processes the Personal
                                        Data in your User Content.
                                    </div>
                                </div>
                            </>
                        </StandardText>
                        <h1 className="my-12 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-4xl">
                            OCTOPUS PLATFORM USER TERMS SCHEDULE 1: ANNEX A
                        </h1>
                        <StandardText>
                            <>
                                <span className="font-bold">Purpose of Processing</span>
                                <br /> To provide the Service <br />
                                <br />
                                <Components.PageSubTitle text="Data Protection Particulars" />
                                <span className="font-bold">The subject matter and duration of the Processing</span>
                                <br />
                                The Octopus platform provides a primary research record for recording and appraising
                                research &apos;as it happens&apos;. It breaks down the publication of scientific
                                research into eight elements.
                                <br />
                                <br />
                                The eight elements are:
                                <ul className="ml-8 mt-2 list-disc">
                                    <li className="mb-2">Research Problem</li>
                                    <li className="mb-2">Rationale/Hypothesis</li>
                                    <li className="mb-2">Method</li>
                                    <li className="mb-2">Results</li>
                                    <li className="mb-2">Analysis</li>
                                    <li className="mb-2">Interpretation</li>
                                    <li className="mb-2">Real World Application</li>
                                    <li className="mb-2">Peer Review</li>
                                </ul>
                                <span className="font-bold">The nature and purpose of the Processing</span>
                                <br />
                                To provide the Octopus Service.
                                <br />
                                <br />
                                <span className="font-bold">The type of Personal Data being Processed</span>
                                <br />
                                Any Personal Data that the Registered Users includes in their User Content
                                <br />
                                <br />
                                <span className="font-bold">The categories of Data Subjects</span>
                                <br />
                                We expect this to be academics (staff and students)
                                <br />
                                <br />
                            </>
                        </StandardText>
                        <h1 className="my-12 block text-center font-montserrat text-3xl font-black !leading-tight tracking-tight text-grey-700 transition-colors duration-500 dark:text-white-50 lg:text-4xl">
                            OCTOPUS PLATFORM USER TERMS SCHEDULE 1: ANNEX B
                        </h1>
                        <Components.PageSubTitle text="Appointed Sub-contractors" />
                        <StandardText>
                            <>
                                <span className="font-bold">Current list of Jisc Appointed Sub-contractors</span>
                                <ul className="ml-8 mt-3 list-disc">
                                    <li className="mb-3">Amazon Web Services</li>
                                    <li className="mb-3">Octopus Publishing CIC</li>
                                    <li className="mb-3">
                                        DataCite:{' '}
                                        <Components.Link
                                            href="https://datacite.org/"
                                            openNew={true}
                                            className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                        >
                                            https://datacite.org/
                                        </Components.Link>
                                    </li>
                                    <li className="mb-3">
                                        ORCID:{' '}
                                        <Components.Link
                                            href="https://orcid.org/"
                                            openNew={true}
                                            className="rounded text-teal-600 outline-0 transition-colors duration-500 focus:ring-2 focus:ring-yellow-400 dark:text-teal-300"
                                        >
                                            https://orcid.org/
                                        </Components.Link>
                                    </li>
                                </ul>
                            </>
                        </StandardText>
                    </div>
                </>
            </PageSection>
        </Layouts.Standard>
    </>
);

export default UserTerms;
