export const PageModel = {
    header: {
        searchButton: 'header > div > div > div > button:text("Search")',
        loginButton: 'role=button[name="Sign in with ORCID"]',
        usernameButton: 'button[data-testid="username-button"]',
        logoutButton: 'button:text("Log out")',
        browseButton: 'ul a[role="button"]:has-text("Browse")',
        publishButton: 'ul a[role="button"]:has-text("Publish")',
        myBookmarksButton: 'a[href="/my-bookmarks"]',
        myPublicationsButton: 'a[href="/account"]',
        myProfileButton: 'a[href="/authors/cl6m84wm800007syp9fxsv425"]'
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
    about: {
        faq: 'main > div > div > a[href="/faq"]',
        authorGuide: 'main > div > div > a[href="/author-guide"]',
        aims: 'main > div > div > a[href="/octopus-aims"]',
        cards: [
            '_react=ActionCard[title = "Publish your work"]',
            '_react=ActionCard[title = "Browse publications"]',
            '_react=ActionCard[title = "FAQs"]'
        ],
        infoCards: [
            '_react=CardItem[title = "Free and fast"]',
            '_react=CardItem[title = "Emphasis on quality"]',
            '_react=CardItem[title = "Fair recognition for researchers"]',
            '_react=CardItem[title = "Find relevant work"]'
        ],
        video: 'video',
        pubTypes: [
            'h3:text("Research Problem")',
            'h3:text("Rationale/Hypothesis")',
            'h3:text("Methods")',
            'h3:text("Results")',
            'h3:text("Analysis")',
            'h3:text("Interpretation")',
            'h3:text("Real World Application")'
        ]
    },
    browse: {
        card: '_react=Card',
        viewAllPublications: '[aria-label="View all publications"]',
        viewAllAuthors: '[aria-label="View all authors"]'
    },
    search: {
        searchInput: 'css=[placeholder="Type here and press enter..."]',
        publicationSearchResult: 'a[href="/publications/cl3fz14dr0001es6i5ji51rq4"]',
        noPublicationsFound: '_react=Alert[title = "No results found"]'
    },
    livePublication: {
        visualisationProblem: 'a[role="button"]:has-text("How has life on earth evolved?")',
        content: '#main-text >> text=How has life on earth evolved?',
        linkedProblems: 'text=Research Problem statements branching from this Research Problem',
        funders: 'h2:has-text("Funders")',
        coi: 'h2:has-text("Conflict of interest")',
        licenceLink: 'aside a[role="button"]:has-text("CC BY 4.0")',
        doiLink: 'aside [aria-label="DOI link: https://doi.org/10.82259/cl3fz14dr0001es6i5ji51rq4"]',
        authorLink: 'text=S. Octopus',
        signInForMoreButton: 'text=Sign in for more actions',
        verifyEmailForMoreButton: 'text=Verify your email for more actions',
        addBookmark: '[title="Bookmark this publication"]',
        removeBookmark: '[title="Remove bookmark"]',
        writeReview: '[aria-label="Write review"]',
        flagConcern: '[aria-label="Flag a concern with this publication"]',
        redFlagComment: '#red-flag-comment',
        redFlagSubmit: '[aria-label="Submit"]',
        redFlagAlert: 'text=This publication has active red flags for:',
        redFlagLink: '[aria-label="View red flags"]',
        redFlagPreview: '#red-flags > div > div > div > a[title="View  comment thread"]',
        resolveFlag: 'text=Resolve flag',
        confirmResolve: 'button[aria-label="Resolve"]'
    },
    authorInfo: {
        name: 'text=Science Octopus',
        orcid: 'a[role="button"]:has-text("XXXX-XXXX-XXXX-XXXX")',
        orcidData: ['h2:has-text("Employment")', 'h2:has-text("Education")', 'h2:has-text("Works")'],
        showAll: 'button:has-text("Show all")',
        result: '_react=SearchResult[publication.id="cl3fz14dr0001es6i5ji51rq4"]'
    },
    login: {
        username: '#username',
        password: '#password',
        signInButton: '#signin-button'
    },
    confirmEmail: {},
    myPublications: {},
    myBookmarks: {
        bookmark: 'a[href="/publications/cl3fz14dr0001es6i5ji51rq4"]'
    },
    publish: {
        title: 'input[type="text"]',
        publicationType: 'select#publicationType',
        confirmPublicationType: 'input[type="checkbox"]',
        createThisPublicationButton: 'button[aria-label="Create this publication"]',
        nextButton: 'button:has-text("Next") >> nth=0',
        previewButton: 'button:has-text("Preview") >> nth=0',
        publishButton: 'button:has-text("Publish") >> nth=1',
        confirmPublishButton: 'button[aria-label="Yes, save & publish"]',
        draftEditButton: 'a[role="button"]:has-text("Edit or publish draft publication")',
        keyInformation: {
            licence: 'select#licence',
            rorID: 'input[name="ror"]',
            addAffiliationButton: 'button[aria-label="Add affiliation"]',
            manualAffiliationSelect: 'input#manual',
            manualAffiliationName: 'input[placeholder="Name"]',
            manualAffiliationCity: 'input[placeholder="City"]',
            manualAffiliationLink: 'input[placeholder="Link"]',
            affiliationDetails: 'textarea[placeholder="Enter any details"]'
        },
        linkedPub: {
            input: 'input[placeholder="Search for publications"]',
            addLink: 'button[aria-label="Add link"]'
        },
        text: {
            editor: 'div[contenteditable=true]',
            language: 'select[name="language"]',
            description:
                'text=Short descriptionInclude a short description of your publication to aid discover >> textarea',
            keywords:
                'text=KeywordsInclude up to 10 keywords relating to your content. These can be comma-s >> textarea'
        },
        coi: {
            true: '#coi-true',
            false: '#coi-false',
            TextBox: '#conflictOfInterestStatus'
        },
        funders: {
            rorID: 'input[name="ror"]',
            addAffiliationButton: 'button[aria-label="Add funder"]',
            manualAffiliationSelect: 'input#manual',
            manualAffiliationName: 'input[placeholder="Name"]',
            manualAffiliationCity: 'input[placeholder="City"]',
            manualAffiliationLink: 'input[placeholder="Link"]',
            affiliationDetails: 'textarea[placeholder="Enter any details"]'
        }
    },
    coauthorApprove: {},
    coauthorDeny: {}
};
