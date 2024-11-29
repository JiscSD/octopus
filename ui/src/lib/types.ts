import * as Interfaces from '@/interfaces';
import * as Contentful from 'contentful';

export type {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
    NextPage,
    GetStaticProps,
    GetStaticPaths
} from 'next';

export type { AppProps } from 'next/app';
export type { AxiosError } from 'axios';

export type PreferencesStoreTypes = {
    darkMode: boolean;
    toggleDarkMode: () => void;
    feedback: boolean;
    toggleFeedback: () => void;
};

export type UserRole = 'USER' | 'ORGANISATION' | 'SUPER_USER';

export type UserType = {
    id: string;
    firstName: string;
    lastName: string;
    email: string | null;
    role: UserRole;
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

export type PublicationVersionSlice = {
    publicationVersion: Interfaces.PublicationVersion;
    updatePublicationVersion: (publicationVersion: Interfaces.PublicationVersion) => void;
    updateAuthorAffiliations: (affiliations: Interfaces.MappedOrcidAffiliation[]) => void;
    updateIsIndependentAuthor: (isIndependent: boolean) => void;
    updateCoAuthors: (coAuthors: Interfaces.CoAuthor[]) => void;
    updateTopics: (topics: Interfaces.BaseTopic[]) => void;
    resetPublicationVersion: () => void;
};

export type LinkedToSlice = {
    linkedTo: Interfaces.LinkedToPublication[];
    updateLinkedTo: (linkedTo: Interfaces.LinkedToPublication[]) => void;
    resetLinkedTo: () => void;
};

export type ReferencesSlice = {
    references: Interfaces.Reference[];
    updateReferences: (references: Interfaces.Reference[]) => void;
    resetReferences: () => void;
};

export type ErrorSlice = {
    error: string | null;
    setError: (message: string | null) => void;
};

export type PublicationCreationStoreType = PublicationVersionSlice & LinkedToSlice & ReferencesSlice & ErrorSlice;

export type JSONValue = unknown;

export type SearchType = 'publication-versions' | 'authors' | 'topics';

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

export type PublicationStatuses = 'DRAFT' | 'LIVE' | 'HIDDEN' | 'LOCKED';

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

export type PublicationCreationStep =
    | 'KEY_INFORMATION'
    | 'AFFILIATIONS'
    | 'LINKED_ITEMS'
    | 'MAIN_TEXT'
    | 'CONFLICT_OF_INTEREST'
    | 'CO_AUTHORS'
    | 'FUNDERS'
    | 'DATA_STATEMENT'
    | 'RESEARCH_PROCESS';

export type CreationSteps = {
    [key in PublicationCreationStep]: Interfaces.CreationStep;
};

export type TabCompletionStatus = 'COMPLETE' | 'INCOMPLETE';

export type LinkedEntityType = 'PUBLICATION' | 'TOPIC';

export type BookmarkType = 'PUBLICATION' | 'TOPIC';

export type BlogFields = {
    title: Contentful.EntryFields.Text;
    author: Contentful.EntryFields.Text;
    content: Contentful.EntryFields.RichText;
    slug: Contentful.EntryFields.Text;
    publishedDate: Contentful.EntryFields.Date;
};

export type PartialPublicationVersion = Pick<
    Interfaces.PublicationVersion,
    | 'id'
    | 'doi'
    | 'versionOf'
    | 'versionNumber'
    | 'createdBy'
    | 'publishedDate'
    | 'isLatestLiveVersion'
    | 'isLatestVersion'
    | 'coAuthors'
    | 'currentStatus'
>;

export type PublicationImportSource = 'ARI';
