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
        path: '/#search',
        title: `Search - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/search`
    },
    // Publications
    createPublication: {
        path: '/new-publication',
        title: `New Publication - ${base.title}`,
        description: '',
        keywords: '',
        canonical: `${base.host}/new-publication`
    },
    viewPublication: {
        path: '/publications',
        title: `${base.title}`,
        canonical: `${base.host}/publications`
    },
    // Reviews
    createReview: {
        path: '/review',
        title: 'Create publication review',
        description: '',
        keywords: '',
        canonical: `${base.host}/review`
    },
    // Report
    createFlag: {
        path: '/flag',
        title: 'Flag publication',
        description: '',
        keywords: '',
        canonical: `${base.host}/flag`
    }
};

export default urls;
