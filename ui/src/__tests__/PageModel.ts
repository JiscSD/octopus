export const PageModel = {
    header: {
        searchButton: ':nth-match(:text("Search"), 1)'
    },
    footer: {
        links: [
            'footer > div > div > a[href="/browse"]',
            'footer > div > div > a[href="/create"]',
            'footer > div > div > a[href="/about"]',
            'footer > div > div > a[href="/faq"]',
            'footer > div > div > a[href="/get-involved"]',
            'footer > div > div > a[href="/user-terms"]',
            'footer > div > div > a[href="/privacy"]',
            'footer > div > div > a[href="/accessibility"]'
        ]
    },
    homepage: {
        h1: 'h1',
        loginButton: 'role=button[name="Sign in with ORCID"]',
        cards: [
            '_react=ActionCard[title = "Publish your work"]',
            '_react=ActionCard[title = "Read publications"]',
            '_react=ActionCard[title = "Browse publications"]',
            '_react=ActionCard[title = "Create an account"]',
            '_react=ActionCard[title = "Learn more about Octopus"]',
            '_react=ActionCard[title = "FAQs"]'
        ],
        learnMoreButton: 'a[href="/about"][tabindex="0"].rounded',
        quickSearch: 'button[aria-label="Open search"]',
        quickSearchInput: 'input[placeholder="Search publications"]',
        publicationSearchResult: 'a[href="/publications/cl3fz14dr0001es6i5ji51rq4"]',
        darkModeToggle: '#headlessui-switch-7',
        backToTopButton: ''
    },
    about: {},
    terms: {},
    privacy: {},
    getInvolved: {},
    accessibility: {},
    browse: {},
    search: {},
    livePublication: {},
    authorInfo: {},
    login: {},
    confirmEmail: {},
    publish: {},
    myPublications: {},
    myBookmarks: {},
    coauthorApprove: {},
    coauthorDeny: {}
};
