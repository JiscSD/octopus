function checkEnvVariable(variable: string | undefined): string {
    if (variable === undefined) {
        throw new Error('Environment Variable is undefined.');
    } else {
        return variable!;
    }
}

const host = checkEnvVariable(process.env.NEXT_PUBLIC_BASE_URL);
const mediaBucket = checkEnvVariable(process.env.NEXT_PUBLIC_MEDIA_BUCKET);
const sitemapBucket = checkEnvVariable(process.env.NEXT_PUBLIC_SITEMAP_BUCKET);
const orcidAppId = checkEnvVariable(process.env.NEXT_PUBLIC_ORCID_APP_ID);
const orcidAuthUrl = checkEnvVariable(process.env.NEXT_PUBLIC_ORCID_AUTH_URL);

const base = {
    title: 'Octopus | Built for Researchers',
    host
};

const urls = {
    base,
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
    verify: {
        path: '/verify',
        title: `${base.title}`,
        description: '',
        keywords: [],
        canonical: `${base.host}/verify`
    },
    myBookmarks: {
        path: '/my-bookmarks',
        title: `${base.title}`,
        description: '',
        keywords: [],
        canonical: `${base.host}/my-bookmarks`
    },

    // RedFlags
    viewFlagThread: {
        path: '/publications', // append `/{publication_id}/flag/{flag_id}`
        title: `${base.title}`,
        description: '',
        canonical: `${base.host}/publications` // append `/{publication_id}/flag/{flag_id}`
    },

    // Topics
    viewTopic: {
        path: '/topics',
        title: `${base.title}`,
        canonical: `${base.host}/topics`
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
        path: '/user-terms',
        title: `Terms - ${base.title}`,
        description: 'Terms and conditions relevant to the Octopus site, including details on our open-source licence.',
        keywords: ['open access', 'open source', 'open license', 'open licence', 'GPLv3'],
        canonical: `${base.host}/user-terms`
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
    accessibility: {
        path: '/accessibility',
        title: `Accessibility - ${base.title}`,
        description: 'Find out more about the accessibility of the Octopus platform, and how to report issues.',
        keywords: ['open source', 'accessibility', 'publishing platform'],
        canonical: `${base.host}/accessibility`
    },
    authorGuide: {
        path: '/author-guide',
        title: 'Octopus Author Guide',
        description: 'Step-by-step guide on how to create a new publication on Octopus.',
        keywords: ['Open access', 'publishing', 'open science', 'publishing science', 'publishing research'],
        canonical: `${base.host}/author-guide`
    },
    userTerms: {
        path: '/user-terms',
        title: 'Octopus User Terms',
        description: "Octopus's user terms and conditions.",
        keywords: ['Open access', 'publishing', 'open science', 'publishing science', 'publishing research'],
        canonical: `${base.host}/user-terms`
    },
    getInvolved: {
        path: '/get-involved',
        title: 'Get involved with Octopus',
        description: 'Find out how to participate directly in the Octopus project, and view our development roadmap.',
        keywords: ['User community', 'platform development', 'user participation', 'Octopus publishing'],
        canonical: `${base.host}/get-involved`
    },
    octopusAims: {
        path: '/octopus-aims',
        title: 'Octopus: aims and priorities',
        description:
            'Learn more about the aims and priorities of the Octopus platform, which is designed to positively disrupt research culture.',
        keywords: [
            'Octopus publishing',
            'research culture',
            'research assessment',
            'open access publishing',
            'open science'
        ],
        canonical: `${base.host}/octopus-aims`
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
    orcidAccountPage: {
        path: 'https://orcid.org/my-orcid'
    },
    orcidLogin: {
        path: `${orcidAuthUrl}/authorize?client_id=${orcidAppId}&response_type=code&scope=openid%20/read-limited&prompt=login&redirect_uri=${base.host}/login`
    },
    mediaBucket,
    sitemapBucket,
    baseUrl: base.host,
    blog: {
        path: '/blog',
        title: 'The Octopus Blog',
        description: 'Stay up to date with the latest from the Octopus team',
        documentTitle: `The Octopus Blog - ${base.title}`,
        keywords: ['blog', 'Octopus blog'],
        canonical: `${base.host}/blog`
    },
    researchCultureReport: {
        path: '/research-culture-report',
        title: 'Research Culture Report',
        description:
            'Explore Octopus: Transforming Academic Research Culture. Discover how the University of Bristol report highlights challenges in academia and how Octopus is reshaping research incentives to foster collaboration and quality.',
        documentTitle: `Research Culture Report - ${base.title}`,
        keywords: ['research', 'culture', 'report'],
        canonical: `${base.host}/research-culture-report`
    }
};

export default urls;
