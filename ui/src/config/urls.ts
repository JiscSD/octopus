let host: string;
let orcidAppiID: string;

switch (process.env.NEXT_PUBLIC_ENV) {
    case 'local':
        host = 'https://localhost:3001';
        orcidAppiID = 'APP-57ZHSJRO55526ROC';
        break;
    case 'prod':
        host = 'https://octopus.ac';
        orcidAppiID = '';
        break;
    default:
        host = `https://${process.env.NEXT_PUBLIC_ENV}.octopus.ac`;
        orcidAppiID = '';
}

const base = {
    title: 'Octopus. Built for Scientists.',
    host
};

const urls = {
    // Search
    search: {
        path: '/search',
        title: `Search publications - ${base.title}`,
        description: 'Find and read open access scientific research relevant to you.',
        keywords: [
            'scientific research',
            'academic research',
            'open access',
            'published research',
            'academic publications',
            'scientific publications'
        ],
        canonical: `${base.host}/search`
    },

    // Publications
    createPublication: {
        path: '/create',
        title: `New Publication - ${base.title}`,
        description: 'Share your scientific research by creating an open access publication on Octopus.',
        keywords: [
            'publish',
            'publishing platform',
            'open access',
            'open research',
            'publishing research',
            'scientific outputs'
        ],
        canonical: `${base.host}/create`
    },
    viewPublication: {
        path: '/publications',
        title: `${base.title}`,
        canonical: `${base.host}/publications`
    },
    browsePublications: {
        path: '/browse',
        title: `Browse all publications - ${base.title}`,
        description: 'Discover open access research across a range of scientific disciplines.',
        keywords: [
            'scientific research',
            'academic research',
            'open access',
            'published research',
            'academic publications',
            'scientific publications'
        ],
        canonical: `${base.host}/browse`
    },
    editPublication: {
        path: '/edit',
        title: `Edit draft publication - ${base.title}`,
        description:
            'Edit your Octopus publications before publishing to this open access platform for scientific outputs.',
        keywords: [
            'publish',
            'publishing platform',
            'open access',
            'open research',
            'publishing research',
            'scientific outputs'
        ],
        canonical: `${base.host}/edit`
    },

    // Users
    viewUser: {
        path: '/authors',
        title: `${base.title}`,
        description: '',
        keywords: [],
        canonical: `${base.host}/authors`
    },
    account: {
        path: '/account',
        title: `${base.title}`,
        description: '',
        keywords: [],
        canonical: `${base.host}/account`
    },

    // Static Pages
    home: {
        path: '/',
        title: `${base.title}`,
        description:
            'Get started with Octopus, an open access platform where researchers can read, review and publish findings at all stages of the scientific process.',
        keywords: [
            'open access',
            'open science',
            'open research',
            'scientific research',
            'publishing research',
            'research culture',
            'publishing platform'
        ],
        canonical: `${base.host}`
    },
    terms: {
        path: '/terms',
        title: `Terms - ${base.title}`,
        description: 'Terms and conditions relevant to the Octopus site, including details on our open-source licence.',
        keywords: ['open access', 'open source', 'open license', 'open licence', 'GPLv3'],
        canonical: `${base.host}/terms`
    },
    privacy: {
        path: '/privacy',
        title: `Privacy - ${base.title}`,
        description:
            'By creating an account on Octopus you agree that you have asked us to process it as described on this page and in the standard privacy notice for Jisc.',
        keywords: ['publishing platform', 'user accounts', 'data protection', 'personal data'],
        canonical: `${base.host}/privacy`
    },
    about: {
        path: '/about',
        title: `About Octopus - ${base.title}`,
        description:
            'Find out more about Octopus, an open access platform where researchers can read, review and publish findings at all stages of the scientific process.  ',
        keywords: [
            'open access',
            'open science',
            'open research',
            'scientific research',
            'publishing research',
            'research culture',
            'publishing platform'
        ],
        canonical: `${base.host}/about`
    },
    faq: {
        path: '/faq',
        title: `Frequently Asked Questions - ${base.title}`,
        description: 'Frequently asked questions to help you get the most out of the Octopus platform.  ',
        keywords: [
            'faq',
            'octopus open access',
            'open science',
            'scientific research',
            'publishing research',
            'research culture'
        ],
        canonical: `${base.host}/faq`
    },
    documentation: {
        path: '/documentation',
        title: `API documentation - ${base.title}`,
        description: 'Find out more about the Octopus API through this documentation page.',
        keywords: ['open source', 'api', 'documentation', 'publishing platform'],
        canonical: `${base.host}/documentation`
    },
    accessibility: {
        path: '/accessibility',
        title: `Accessibility - ${base.title}`,
        description: 'Find out more about the accessibility of the Octopus platform, and how to report issues.',
        keywords: ['open source', 'accessibility', 'publishing platform'],
        canonical: `${base.host}/accessibility`
    },
    404: {
        title: `404 Not Found - ${base.title}`
    },
    500: {
        title: `Something went wrong - ${base.title}`
    },
    orcidLoginCallback: {
        path: '/login',
        title: `Logging in with ORCID - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/login`
    },
    orcidLogin: {
        path: `https://orcid.org/oauth/authorize?client_id=${orcidAppiID}&response_type=code&scope=/authenticate&redirect_uri=${base.host}/login`
    }
};

export default urls;
