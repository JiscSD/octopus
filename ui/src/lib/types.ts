import React from 'react';

import * as Interfaces from '@interfaces';

export type { AppProps } from 'next/app';
export type { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';

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
    createdAt: string;
    email: string | null;
    exp: number;
    firstName: string;
    iat: number;
    id: string;
    lastName: string;
    locked: boolean;
    orcid: string;
    role: string;
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
    conflictOfInterestStatus: boolean;
    updateConflictOfInterestStatus: (conflictOfInterestStatus: boolean) => void;
    conflictOfInterestText: string;
    updateConflictOfInterestText: (conflictOfInterestText: string) => void;
    linkTo: Interfaces.LinkTo[];
    updateLinkTo: (linkTo: Interfaces.LinkTo[]) => void;
};

export type JSONValue = string | number | boolean | { [x: string]: JSONValue } | Array<JSONValue> | null | undefined;

export type SearchType = 'publications' | 'users';

export type PublicationOrderBySearchOption = 'title' | 'publishedDate';

export type UserOrderBySearchOption = 'updatedAt' | 'createdAt';

export type OrderDirectionSearchOption = 'asc' | 'desc';

export type PublicationType =
    | 'PROBLEM'
    | 'PROTOCOL'
    | 'ANALYSIS'
    | 'REAL_WORLD_APPLICATION'
    | 'HYPOTHESIS'
    | 'DATA'
    | 'INTERPRETATION'
    | 'PEER_REVIEW';

export type Severity = 'INFO' | 'SUCCESS' | 'WARNING' | 'ERROR';

export type LicenceType = 'CC_BY' | 'CC_BY_SA' | 'CC_BY_ND' | 'CC_BY_NC' | 'CC_BY_NC_SA' | 'CC_BY_NC_ND';

export type PublicationStatuses = 'DRAFT' | 'LIVE' | 'HIDDEN';

export type Ratings =
    | 'PROBLEM_WELL_DEFINED'
    | 'PROBLEM_ORIGINAL'
    | 'PROBLEM_IMPORTANT'
    | 'HYPOTHESIS_WELL_DEFINED'
    | 'HYPOTHESIS_ORIGINAL'
    | 'HYPOTHESIS_SCIENTIFICALLY_VALID'
    | 'PROTOCOL_CLEAR'
    | 'PROTOCOL_ORIGINAL'
    | 'PROTOCOL_APPROPRIATE_TEST_OF_HYPOTHESIS'
    | 'DATA_WELL_ANNOTATED'
    | 'DATA_SIZE_OF_DATASET'
    | 'DATA_FOLLOWED_PROTOCOL'
    | 'ANALYSIS_CLEAR'
    | 'ANALYSIS_ORIGINAL'
    | 'ANALYSIS_APPROPRIATE_METHODOLOGY'
    | 'INTERPRETATION_CLEAR'
    | 'INTERPRETATION_INSIGHTFUL'
    | 'INTERPRETATION_CONSISTENT_WITH_DATA'
    | 'REAL_WORLD_APPLICATION_CLEAR'
    | 'REAL_WORLD_APPLICATION_APPROPRIATE_TO_IMPLEMENT'
    | 'REAL_WORLD_APPLICATION_IMPACTFUL'
    | 'REVIEW_CLEAR'
    | 'REVIEW_INSIGHTFUL'
    | 'REVIEW_ORIGINAL';
