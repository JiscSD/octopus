import * as Interfaces from '@interfaces';

export type { GetServerSideProps, GetServerSidePropsContext, NextPage } from 'next';
export type { AppProps } from 'next/app';
export type { AxiosError } from 'axios';

export type PreferencesStoreTypes = {
    darkMode: boolean;
    toggleDarkMode: () => void;
    feedback: boolean;
    toggleFeedback: () => void;
};

export type GlobalsStoreType = {
    showCmdPalette: boolean;
    toggleCmdPalette: () => void;
};

export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    role: string;
    createdAt: string;
    updatedAt: string;
    orcid: string;

    exp: number;
    iat: number;
    locked: boolean;
    token: string;
};

export type AuthStoreType = {
    user: null | UserType;
    setUser: (user: null | UserType) => void;
};

export type ToastStoreType = {
    toast: Interfaces.ToastState;
    setToast: (toast: Interfaces.ToastState) => void;
    clearToast: () => void;
};

export type PublicationCreationStoreType = {
    error: null | string;
    setError: (error: string | null) => void;
    id: string;
    updateId: (id: string) => void;
    title: string;
    updateTitle: (title: string) => void;
    type: PublicationType;
    updateType: (type: PublicationType) => void;
    content: string;
    updateContent: (content: string) => void;
    description: string;
    updateDescription: (description: string) => void;
    keywords: string;
    updateKeywords: (keywords: string) => void;
    licence: LicenceType;
    updateLicence: (licence: LicenceType) => void;
    language: Languages;
    updateLanguage: (language: Languages) => void;
    conflictOfInterestStatus: boolean | undefined;
    updateConflictOfInterestStatus: (conflictOfInterestStatus: boolean | undefined) => void;
    conflictOfInterestText: string;
    updateConflictOfInterestText: (conflictOfInterestText: string) => void;
    linkTo: Interfaces.LinkTo[];
    updateLinkTo: (linkTo: Interfaces.LinkTo[]) => void;
    ethicalStatement: string | null;
    ethicalStatementFreeText: string | null;
    updateEthicalStatementFreeText: (ethicalStatementFreeText: string | null) => void;
    updateEthicalStatement: (ethicalStatement: string) => void;
    dataAccessStatement: string;
    updateDataAccessStatement: (dataAccessStatement: string | null) => void;
    dataPermissionsStatement: string | null;
    updateDataPermissionsStatemnt: (dataPermissionsStatement: string) => void;
    dataPermissionsStatementProvidedBy: string | null;
    updateDataPermissionsStatementProvidedBy: (dataPermissionsStatementProvidedBy: string | null) => void;
    reset: () => void;
    coAuthors: Interfaces.CoAuthor[];
    updateCoAuthors: (coAuthors: Interfaces.CoAuthor[]) => void;
    funderStatement: string | null;
    updateFunderStatement: (funderStatement: string | null) => void;
    funders: Interfaces.Funder[];
    updateFunders: (funders: Interfaces.Funder[]) => void;
    affiliations: Interfaces.Affiliations[];
    updateAffiliations: (affiliations: Interfaces.Affiliations[]) => void;
    affiliationsStatement: string | null;
    updateAffiliationsStatement: (affiliationsStatement: string | null) => void;
    selfDeclaration: boolean;
    updateSelfDeclaration: (selfDeclaration: boolean) => void;
    references: Interfaces.Reference[];
    updateReferences: (references: Interfaces.Reference[]) => void;
};

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue> | null | undefined;

export type SearchType = 'publications' | 'authors';

export type SearchParameter = Interfaces.Publication | Interfaces.User;

export type PublicationOrderBySearchOption = 'title' | 'publishedDate';

export type UserOrderBySearchOption = 'updatedAt' | 'createdAt';

export type OrderDirectionSearchOption = 'asc' | 'desc';

export type PublicationType =
    | 'PROBLEM'
    | 'PROTOCOL' // method
    | 'ANALYSIS'
    | 'REAL_WORLD_APPLICATION'
    | 'HYPOTHESIS'
    | 'DATA' // results
    | 'INTERPRETATION'
    | 'PEER_REVIEW';

export type Severity = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR' | 'RED_FLAG';

export type LicenceType = 'CC_BY' | 'CC_BY_SA' | 'CC_BY_NC' | 'CC_BY_NC_SA';

export type PublicationStatuses = 'DRAFT' | 'LIVE' | 'HIDDEN';

export type ImageUploadTypes = 'FILE_UPLOAD' | 'URL_SOURCE' | 'IMAGE_LIBRARY';

export type RedFlagTypes =
    | 'PLAGIARISM'
    | 'ETHICAL_ISSUES'
    | 'MISREPRESENTATION'
    | 'UNDECLARED_IMAGE_MANIPULATION'
    | 'COPYRIGHT'
    | 'INAPPROPRIATE';

export type Languages =
    | 'ab'
    | 'aa'
    | 'af'
    | 'ak'
    | 'sq'
    | 'am'
    | 'ar'
    | 'an'
    | 'hy'
    | 'as'
    | 'av'
    | 'ae'
    | 'ay'
    | 'az'
    | 'bm'
    | 'ba'
    | 'eu'
    | 'be'
    | 'bn'
    | 'bi'
    | 'bs'
    | 'br'
    | 'bg'
    | 'bh'
    | 'my'
    | 'ca'
    | 'km'
    | 'ch'
    | 'ce'
    | 'ny'
    | 'zh'
    | 'cu'
    | 'cv'
    | 'kw'
    | 'co'
    | 'cr'
    | 'hr'
    | 'cs'
    | 'da'
    | 'dv'
    | 'nl'
    | 'dz'
    | 'en'
    | 'eo'
    | 'et'
    | 'ee'
    | 'fo'
    | 'fj'
    | 'fi'
    | 'fr'
    | 'ff'
    | 'gd'
    | 'gl'
    | 'lg'
    | 'ka'
    | 'de'
    | 'el'
    | 'gn'
    | 'gu'
    | 'ht'
    | 'ha'
    | 'he'
    | 'hz'
    | 'hi'
    | 'ho'
    | 'hu'
    | 'is'
    | 'io'
    | 'ig'
    | 'id'
    | 'ia'
    | 'ie'
    | 'iu'
    | 'ik'
    | 'ga'
    | 'it'
    | 'ja'
    | 'jv'
    | 'kl'
    | 'kn'
    | 'kr'
    | 'ks'
    | 'kk'
    | 'ki'
    | 'rw'
    | 'ky'
    | 'kv'
    | 'kg'
    | 'ko'
    | 'kj'
    | 'ku'
    | 'lo'
    | 'la'
    | 'lv'
    | 'li'
    | 'ln'
    | 'lt'
    | 'lu'
    | 'lb'
    | 'mk'
    | 'mg'
    | 'ms'
    | 'ml'
    | 'mt'
    | 'gv'
    | 'mi'
    | 'mr'
    | 'mh'
    | 'mn'
    | 'na'
    | 'nv'
    | 'ng'
    | 'ne'
    | 'nd'
    | 'se'
    | 'no'
    | 'nb'
    | 'nn'
    | 'oc'
    | 'oj'
    | 'or'
    | 'om'
    | 'os'
    | 'pi'
    | 'ps'
    | 'fa'
    | 'pl'
    | 'pt'
    | 'pa'
    | 'qu'
    | 'ro'
    | 'rm'
    | 'rn'
    | 'ru'
    | 'sm'
    | 'sg'
    | 'sa'
    | 'sc'
    | 'sr'
    | 'sn'
    | 'ii'
    | 'sd'
    | 'si'
    | 'sk'
    | 'sl'
    | 'so'
    | 'nr'
    | 'st'
    | 'es'
    | 'su'
    | 'sw'
    | 'ss'
    | 'sv'
    | 'tl'
    | 'ty'
    | 'tg'
    | 'ta'
    | 'tt'
    | 'te'
    | 'th'
    | 'bo'
    | 'ti'
    | 'to'
    | 'ts'
    | 'tn'
    | 'tr'
    | 'tk'
    | 'tw'
    | 'ug'
    | 'uk'
    | 'ur'
    | 'uz'
    | 've'
    | 'vi'
    | 'vo'
    | 'wa'
    | 'cy'
    | 'fy'
    | 'wo'
    | 'xh'
    | 'yi'
    | 'yo'
    | 'za'
    | 'zu';

export type PublicationCreationSteps =
    | 'KEY_INFORMATION'
    | 'LINKED_PUBLICATIONS'
    | 'MAIN_TEXT'
    | 'CONFLICT_OF_INTEREST'
    | 'CO_AUTHORS'
    | 'FUNDERS'
    | 'DATA_STATEMENT'
    | 'RESEARCH_PROCESS'
    | 'REVIEW';

export type CreationSteps = {
    [key in PublicationCreationSteps]: Interfaces.CreationStep;
};
