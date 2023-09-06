import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

import * as Config from '@config';
import * as Interfaces from '@interfaces';
import * as Types from '@types';

/**
 *
 * @TODO
 * - refactor this store as per Zustand docs `store = { publication, updatePublication, etc...}`
 * - remove "error" and "setError" from the store and use component state to display errors
 * - remove redundant actions like: reset, updateId, updateType, etc...
 * - Also update Publication Interfaces to reflect the actual data coming from "/publication/[id]" endpoint, not just partial data
 * - Replace any type with well defined types
 * - use proper types within the store
 */

let store: any = (set: (params: any) => void) => ({
    // Errors whilst editing
    error: null,
    setError: (error: string | null) => set(() => ({ error })),

    reset: () =>
        set(() => {
            return {
                id: '',
                title: '',
                type: Config.values.octopusInformation.publications.PROBLEM.id,
                content: '',
                description: '',
                funderStatement: '',
                funders: [],
                affiliationsStatement: '',
                affiliations: [],
                keywords: [],
                language: Config.values.octopusInformation.languages.find((entry) => entry.code === 'en'),
                references: [],
                conflictOfInterestStatus: undefined,
                conflictOfInterestText: '',
                linkTo: [],
                topics: [],
                ethicalStatement: null,
                ethicalStatementFreeText: null,
                dataAccessStatement: null,
                dataPermissionsStatement: null,
                selfDeclaration: false
            };
        }),

    // ID
    id: '',
    updateId: (id: string) => set(() => ({ id })),

    // Title
    title: '',
    updateTitle: (title: string) => set(() => ({ title })),

    // Type
    type: Config.values.octopusInformation.publications.PROBLEM.id,
    updateType: (type: Types.PublicationType) => set(() => ({ type })),

    // Content
    content: '',
    updateContent: (content: string) => set(() => ({ content })),

    // References
    references: [],
    updateReferences: (references: Interfaces.Reference[]) => set(() => ({ references })),

    // Description
    description: '',
    updateDescription: (description: string) => set(() => ({ description })),

    // Keywords
    keywords: [],
    updateKeywords: (keywords: string[]) => set(() => ({ keywords })),

    language: Config.values.octopusInformation.languages.find((entry) => entry.code === 'en'),
    updateLanguage: (language: Types.Languages) => set(() => ({ language })),

    // COI
    conflictOfInterestStatus: undefined,
    updateConflictOfInterestStatus: (conflictOfInterestStatus: boolean) => set(() => ({ conflictOfInterestStatus })),
    conflictOfInterestText: '',
    updateConflictOfInterestText: (conflictOfInterestText: string) => set(() => ({ conflictOfInterestText })),

    // Links
    linkTo: [],
    updateLinkTo: (linkTo: Interfaces.LinkTo[]) => set(() => ({ linkTo })),

    // Topics
    topics: [],
    updateTopics: (topics: Interfaces.BaseTopic[]) => set(() => ({ topics })),

    // Ethical statement
    ethicalStatement: null,
    ethicalStatementFreeText: null,
    updateEthicalStatement: (ethicalStatement: string) => set(() => ({ ethicalStatement })),
    updateEthicalStatementFreeText: (ethicalStatementFreeText: string) => set(() => ({ ethicalStatementFreeText })),

    dataAccessStatement: null,
    updateDataAccessStatement: (dataAccessStatement: string) => set(() => ({ dataAccessStatement })),

    dataPermissionsStatement: null,
    updateDataPermissionsStatemnt: (dataPermissionsStatement: string) => set(() => ({ dataPermissionsStatement })),

    dataPermissionsStatementProvidedBy: null,
    updateDataPermissionsStatementProvidedBy: (dataPermissionsStatementProvidedBy: string) =>
        set(() => ({ dataPermissionsStatementProvidedBy })),

    // Co-authors
    coAuthors: [],
    updateCoAuthors: (coAuthors: Interfaces.CoAuthor[]) => set(() => ({ coAuthors })),

    // Funders
    funderStatement: '',
    updateFunderStatement: (funderStatement: string) => set(() => ({ funderStatement })),
    funders: [],
    updateFunders: (funders: Interfaces.Funder[]) => set(() => ({ funders })),

    // Affiliations
    authorAffiliations: [],
    updateAuthorAffiliations: (authorAffiliations: Interfaces.MappedOrcidAffiliation[]) =>
        set(() => ({ authorAffiliations })),
    isIndependentAuthor: false,
    updateIsIndependentAuthor: (isIndependentAuthor: boolean) => set(() => ({ isIndependentAuthor })),
    affiliationsStatement: '',
    updateAffiliationsStatement: (affiliationsStatement: string) => set(() => ({ affiliationsStatement })),

    // Self declaration
    selfDeclaration: false,
    updateSelfDeclaration: (selfDeclaration: boolean) => set(() => ({ selfDeclaration }))
});

if (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'local') store = devtools(store);

const usePublicationCreationStore = create<Types.PublicationCreationStoreType>(store);

export default usePublicationCreationStore;
