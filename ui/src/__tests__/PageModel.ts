export const PageModel = {
    header: {
        searchButton: 'header > div > div > div > button:text("Search")',
        loginButton: 'role=button[name="Sign in with ORCID"]',
        usernameButton: 'button[data-testid="username-button"]',
        logoutButton: 'button:text("Log out")'
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
        darkModeToggle: '#headlessui-switch-7'
    },
    about: {},
    terms: {},
    privacy: {},
    getInvolved: {},
    accessibility: {},
    browse: {},
    search: {
        searchInput: 'css=[placeholder="Type here and press enter..."]',
        publicationSearchResult: 'a[href="/publications/cl3fz14dr0001es6i5ji51rq4"]',
        noPublicationsFound: '_react=Alert[title = "No results found"]'
    },
    livePublication: {},
    authorInfo: {},
    login: {
        username: '#username',
        password: '#password',
        signInButton: '#signin-button'
    },
    confirmEmail: {},
    publish: {},
    myPublications: {},
    myBookmarks: {},
    coauthorApprove: {},
    coauthorDeny: {}
};
