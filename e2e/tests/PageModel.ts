export const PageModel = {
    header: {
        searchButton: 'header > div > div > div > button:text("Search")',
        loginButton: 'role=button[name="Sign in with ORCID"]',
        usernameButton: 'button[data-testid="username-button"]',
        logoutButton: 'a:text("Log out")',
        browseButton: 'ul a:has-text("Browse")',
        publishButton: 'ul a:has-text("Publish")',
        myBookmarksButton: 'a[href="/my-bookmarks"]',
        myPublicationsButton: 'a[href="/account"]',
        myProfileButton: 'a:has-text("My Account")'
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
        publicationSearchResult: 'a[href="/publications/cl3fz14dr0001es6i5ji51rq4"]',
        darkModeToggle: 'button[role="switch"]'
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
        noPublicationsFound: '_react=Alert[title = "No results found"]',
        firstPublication: 'article div div:nth-child(1) > a.rounded',
        searchTerm: 'evolved',
        dateToInput: 'input#date-to',
        dateFromInput: 'input#date-from',
        dateFrom: '2021-01-01',
        dateTo: '2023-01-01'
    },
    livePublication: {
        visibleSections: [
            // visualisation
            'a:has-text("How has life on earth evolved?")',
            // content
            '#main-text >> text=How has life on earth evolved?',
            // problems above this
            'text=Research problems above this in the hierarchy',
            // problems below this
            'text=Research problems below this in the hierarchy',
            // funders
            'h2:has-text("Funders")',
            // coi
            'h2:has-text("Conflict of interest")'
        ],
        doiLink: 'aside [aria-label="DOI link: https://doi.org/10.82259/cl3fz14dr0001es6i5ji51rq4"]',
        authorLink: 'a[href="/authors/octopus"]:has-text("S. Octopus")',
        signInForMoreButton: 'text=Sign in for more actions',
        verifyEmailForMoreButton: 'text=Verify your email for more actions',
        addBookmark: '[title="Bookmark this publication"]',
        removeBookmark: '[title="Remove bookmark"]',
        writeReview: 'button[aria-label="Write a review"]',
        flagConcern: 'button[aria-label="Flag a concern with this publication"]',
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
        orcid: 'a:has-text("XXXX-XXXX-XXXX-XXXX")',
        orcidData: [
            'section > h2:has-text("Employment")',
            'section > h2:has-text("Education")',
            'section > h2:has-text("Works")'
        ],
        showAll: 'button:has-text("Show More")',
        result: '_react=SearchResult[publication.id="cl3fz14dr0001es6i5ji51rq4"]'
    },
    profilePage: {
        employment: 'h2:has-text("Employment")',
        education: 'h2:has-text("Education")',
        works: 'h2:has-text("Works")',
        octopusPublications: 'h2:has-text("Octopus publications")'
    },
    login: {
        username: '#username',
        password: '#password',
        signInButton: '#signin-button',
        authorizeButton: '#authorize-button'
    },
    confirmEmail: {},
    myProfile: {
        liveAuthorPageButton: 'a:has-text("View my public author page")',
        draftPublicationHeader: 'h2:has-text("Draft publications")'
    },
    myPublications: {
        liveAuthorPageButton: 'a:has-text("View my public author page")'
    },
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
        publishButton: 'button:has-text("Publish") >> nth=0',
        publishButtonTracker: 'button[title="Publish"]',
        requestApprovalButton: 'button:has-text("Request Approval") >> nth=0',
        confirmRequestApproval: 'button:has-text("Finalise Draft and Send Request") >> nth=0',
        confirmPublishButton: 'button[aria-label="Yes, save & publish"]',
        confirmPublishButtonTracker: 'button[title="Yes"]',
        deletePublicationButton: 'button:has-text("Delete Draft") >> nth=0',
        confirmDeletePublicationButton: 'button:has-text("Yes, Delete this draft") >> nth=0',
        fileImportButtonModal: 'button[title="Import from Microsoft Word (.docx)"]',
        fileImportButton: 'input[name="document-import"]',
        insertButton: 'button:has-text("Insert")',
        replaceButton: 'button:has-text("Replace")',
        importModal: 'div[title="Document Import"]',
        draftEditButton: 'a:has-text("Edit draft publication")',
        unlockButton: 'a:has-text("Cancel all authorship requests and unlock for editing")',
        confirmUnlockButton: 'button:has-text("Unlock")',
        keyInformation: {
            licence: 'select#licence',
            rorID: 'input[name=ror]',
            addAffiliationButton: 'button[aria-label="Add affiliation"]:enabled',
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
            editor: '.ProseMirror >> nth=0',
            language: 'select[name="language"]',
            references: '.ProseMirror >> nth=1',
            addReferencesButton: 'button[name="Add references"]',
            deleteAllReferencesButton: 'button[name="Delete all references"]',
            deleteAllReferencesModalButton: 'button[aria-label="Delete all"]',
            continueModalButton: 'button[aria-label="Continue"]',
            saveReferenceModalButton: 'div[role=dialog] button[title="Save"]',
            deleteReferenceModalButton: 'div[role="dialog"] button[title="Delete"]',
            deleteFirstReferenceButton: 'tr:first-of-type button[title="Delete"]',
            addReferenceButton: 'tr:first-of-type button[title="Add below"]',
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
            addAffiliationButton: 'button[aria-label="Add funder"]:enabled',
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
