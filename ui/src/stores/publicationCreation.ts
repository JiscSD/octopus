import { StateCreator, create } from 'zustand';

import * as Types from '@types';
import * as Interfaces from '@interfaces';

const initialPublicationVersion: Interfaces.PublicationVersion = {
    id: '',
    versionOf: '',
    versionNumber: 1,
    isLatestVersion: false,
    isLatestLiveVersion: false,
    createdBy: '',
    createdAt: '',
    updatedAt: '',
    currentStatus: 'DRAFT',
    publishedDate: null,
    title: '',
    licence: 'CC_BY',
    conflictOfInterestStatus: null,
    conflictOfInterestText: null,
    ethicalStatement: null,
    ethicalStatementFreeText: null,
    dataPermissionsStatement: null,
    dataPermissionsStatementProvidedBy: null,
    dataAccessStatement: null,
    selfDeclaration: false,
    description: null,
    keywords: [],
    content: null,
    language: 'en',
    fundersStatement: null,
    publication: {
        id: '',
        type: 'PROBLEM',
        doi: '',
        topics: [],
        publicationFlags: [],
        url_slug: ''
    },
    publicationStatus: [],
    funders: [],
    coAuthors: [],
    user: {
        id: '',
        orcid: '',
        firstName: '',
        lastName: '',
        email: '',
        createdAt: '',
        updatedAt: ''
    }
};

const createPublicationVersionSlice: StateCreator<Types.PublicationVersionSlice> = (set) => ({
    publicationVersion: initialPublicationVersion,
    updatePublicationVersion: (publicationVersion) => set({ publicationVersion }),
    updatePublicationTopics: (topics) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                publication: { ...state.publicationVersion.publication, topics }
            }
        })),
    updateAuthorAffiliations: (affiliations: Interfaces.MappedOrcidAffiliation[]) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                coAuthors: state.publicationVersion.coAuthors.map((author) =>
                    author.linkedUser === state.publicationVersion.createdBy ? { ...author, affiliations } : author
                )
            }
        })),
    updateIsIndependentAuthor: (isIndependent) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                coAuthors: state.publicationVersion.coAuthors.map((author) =>
                    author.linkedUser === state.publicationVersion.createdBy ? { ...author, isIndependent } : author
                )
            }
        })),
    updateCoAuthors: (coAuthors) =>
        set((state) => ({
            publicationVersion: {
                ...state.publicationVersion,
                coAuthors
            }
        })),
    resetPublicationVersion: () => set({ publicationVersion: initialPublicationVersion })
});

const createLinkedToSlice: StateCreator<Types.LinkedToSlice> = (set) => ({
    linkedTo: [],
    updateLinkedTo: (linkedTo) => set({ linkedTo }),
    resetLinkedTo: () => set({ linkedTo: [] })
});

const createReferencesSlice: StateCreator<Types.ReferencesSlice> = (set) => ({
    references: [],
    updateReferences: (references) => set({ references }),
    resetReferences: () => set({ references: [] })
});

const createErrorSlice: StateCreator<Types.ErrorSlice> = (set) => ({
    error: null,
    setError: (error) => set({ error })
});

const usePublicationCreationStore = create<
    Types.PublicationVersionSlice & Types.LinkedToSlice & Types.ReferencesSlice & Types.ErrorSlice
>()((...args) => ({
    ...createPublicationVersionSlice(...args),
    ...createLinkedToSlice(...args),
    ...createReferencesSlice(...args),
    ...createErrorSlice(...args)
}));

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

// let store: any = (set: (params: any) => void) => ({
//     // Errors whilst editing
//     error: null,
//     setError: (error: string | null) => set(() => ({ error })),

//     reset: () =>
//         set(() => {
//             return {
//                 id: '',
//                 versionOf: '',
//                 title: '',
//                 type: Config.values.octopusInformation.publications.PROBLEM.id,
//                 content: '',
//                 description: '',
//                 funderStatement: '',
//                 funders: [],
//                 affiliationsStatement: '',
//                 affiliations: [],
//                 keywords: [],
//                 language: Config.values.octopusInformation.languages.find((entry) => entry.code === 'en'),
//                 references: [],
//                 conflictOfInterestStatus: undefined,
//                 conflictOfInterestText: '',
//                 linkedTo: [],
//                 topics: [],
//                 ethicalStatement: null,
//                 ethicalStatementFreeText: null,
//                 dataAccessStatement: null,
//                 dataPermissionsStatement: null,
//                 selfDeclaration: false,
//                 publication: null
//             };
//         }),

//     // Version ID
//     id: '',
//     updateId: (id: string) => set(() => ({ id })),

//     // Publication ID
//     versionOf: '',
//     updateVersionOf: (versionOf: string) => set(() => ({ versionOf })),

//     // Title
//     title: '',
//     updateTitle: (title: string) => set(() => ({ title })),

//     // Type
//     type: Config.values.octopusInformation.publications.PROBLEM.id,
//     updateType: (type: Types.PublicationType) => set(() => ({ type })),

//     // Content
//     content: '',
//     updateContent: (content: string) => set(() => ({ content })),

//     // References
//     references: [],
//     updateReferences: (references: Interfaces.Reference[]) => set(() => ({ references })),

//     // Description
//     description: '',
//     updateDescription: (description: string) => set(() => ({ description })),

//     // Keywords
//     keywords: [],
//     updateKeywords: (keywords: string[]) => set(() => ({ keywords })),

//     language: Config.values.octopusInformation.languages.find((entry) => entry.code === 'en'),
//     updateLanguage: (language: Types.Languages) => set(() => ({ language })),

//     // COI
//     conflictOfInterestStatus: undefined,
//     updateConflictOfInterestStatus: (conflictOfInterestStatus: boolean) => set(() => ({ conflictOfInterestStatus })),
//     conflictOfInterestText: '',
//     updateConflictOfInterestText: (conflictOfInterestText: string) => set(() => ({ conflictOfInterestText })),

//     // Links
//     linkedTo: [],
//     updateLinkedTo: (linkedTo: Interfaces.LinkTo[]) => set(() => ({ linkedTo })),

//     // Topics
//     topics: [],
//     updateTopics: (topics: Interfaces.BaseTopic[]) => set(() => ({ topics })),

//     // Ethical statement
//     ethicalStatement: null,
//     ethicalStatementFreeText: null,
//     updateEthicalStatement: (ethicalStatement: string) => set(() => ({ ethicalStatement })),
//     updateEthicalStatementFreeText: (ethicalStatementFreeText: string) => set(() => ({ ethicalStatementFreeText })),

//     dataAccessStatement: null,
//     updateDataAccessStatement: (dataAccessStatement: string) => set(() => ({ dataAccessStatement })),

//     dataPermissionsStatement: null,
//     updateDataPermissionsStatemnt: (dataPermissionsStatement: string) => set(() => ({ dataPermissionsStatement })),

//     dataPermissionsStatementProvidedBy: null,
//     updateDataPermissionsStatementProvidedBy: (dataPermissionsStatementProvidedBy: string) =>
//         set(() => ({ dataPermissionsStatementProvidedBy })),

//     // Co-authors
//     coAuthors: [],
//     updateCoAuthors: (coAuthors: Interfaces.CoAuthor[]) => set(() => ({ coAuthors })),

//     // Funders
//     funderStatement: '',
//     updateFunderStatement: (funderStatement: string) => set(() => ({ funderStatement })),
//     funders: [],
//     updateFunders: (funders: Interfaces.Funder[]) => set(() => ({ funders })),

//     // Affiliations
//     authorAffiliations: [],
//     updateAuthorAffiliations: (authorAffiliations: Interfaces.MappedOrcidAffiliation[]) =>
//         set(() => ({ authorAffiliations })),

//     isIndependentAuthor: false,
//     updateIsIndependentAuthor: (isIndependentAuthor: boolean) => set(() => ({ isIndependentAuthor })),

//     affiliationsStatement: '',
//     updateAffiliationsStatement: (affiliationsStatement: string) => set(() => ({ affiliationsStatement })),

//     // Self declaration
//     selfDeclaration: false,
//     updateSelfDeclaration: (selfDeclaration: boolean) => set(() => ({ selfDeclaration })),

//     // Publication
//     publication: null,
//     updatePublication: (publication: Interfaces.CorePublication) => set(() => ({ publication }))
// });

// if (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'local') store = devtools(store);

// const usePublicationCreationStore = create<Types.PublicationCreationStoreType>(store);

export default usePublicationCreationStore;
