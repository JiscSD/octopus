let host: string;

switch (process.env.stage) {
    case 'local':
        host = 'http://localhost:3000';
        break;
    case 'int':
        host = 'https://int.octopus.ac';
        break;
    default:
        host = 'https://octopus.ac';
}

const base = {
    title: 'Octopus. Built for Scientists.',
    host
};

const urls = {
    home: {
        path: '/',
        title: `${base.title}`,
        description: "A new way to publish your scientific work that's fast, free and fair.",
        keywords: 'publish',
        canonical: `${base.host}`
    },
    search: {
        path: '/search',
        title: `Search publications - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/search`
    },
    // Publications
    createPublication: {
        path: '/create',
        title: `New Publication - ${base.title}`,
        description: '',
        keywords: '',
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
        description: '',
        keywords: '',
        canonical: `${base.host}/browse`
    },
    editPublication: {
        path: '/edit',
        title: `Edit draft publication - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/edit`
    },
    // Reviews
    // createReview: {
    //     path: '/review',
    //     title: 'Create publication review',
    //     description: '',
    //     keywords: '',
    //     canonical: `${base.host}/review`
    // },
    // Report
    // createFlag: {
    //     path: '/flag',
    //     title: 'Flag publication',
    //     description: '',
    //     keywords: '',
    //     canonical: `${base.host}/flag`
    // },
    legal: {
        path: '/legal',
        title: `Legal - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/legal`
    },
    privacy: {
        path: '/privacy',
        title: `Privacy - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/privacy`
    },
    feedback: {
        path: '/feedback',
        title: `Leave feedback- ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/feedback`
    },
    about: {
        path: '/about',
        title: `About Octopus- ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/about`
    },
    404: {
        title: `404 Not Found - ${base.title}`
    },
    500: {
        title: `Something wen wrong - ${base.title}`
    }
};

export default urls;
