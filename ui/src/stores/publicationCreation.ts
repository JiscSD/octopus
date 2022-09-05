import create from 'zustand';
import { devtools } from 'zustand/middleware';

import * as Config from '@config';
import * as Interfaces from '@interfaces';
import * as Types from '@types';

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
                licence: Config.values.octopusInformation.licences.CC_BY.value,
                language: Config.values.octopusInformation.languages.find((entry) => entry.code === 'en'),
                references: [],
                conflictOfInterestStatus: undefined,
                conflictOfInterestText: '',
                linkTo: [],
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

    // Licence
    licence: Config.values.octopusInformation.licences.CC_BY.value,
    updateLicence: (licence: Types.LicenceType) => set(() => ({ licence })),

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
    affiliations: [],
    updateAffiliations: (affiliations: Interfaces.Affiliations[]) => set(() => ({ affiliations })),
    affiliationsStatement: '',
    updateAffiliationsStatement: (affiliationsStatement: string) => set(() => ({ affiliationsStatement })),

    // Self declaration
    selfDeclaration: false,
    updateSelfDeclaration: (selfDeclaration: boolean) => set(() => ({ selfDeclaration }))
});

if (process.env.NEXT_PUBLIC_VERCEL_GIT_COMMIT_REF === 'local') store = devtools(store);

const usePublicationCreationStore = create<Types.PublicationCreationStoreType>(store);

export default usePublicationCreationStore;
