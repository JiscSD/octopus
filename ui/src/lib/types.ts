import React from 'react';

import * as Interfaces from '@interfaces';

export type { AppProps } from 'next/app';
export type { GetServerSideProps, NextPage, GetServerSidePropsContext } from 'next';

export type PreferencesStoreTypes = {
    darkMode: boolean;
    toggle: (e: React.FormEvent<HTMLButtonElement>) => void;
};

export type GlobalsStoreType = {
    showCmdPalette: boolean;
    toggleCmdPalette: () => void;
};

export type AuthStoreType = {
    user: null | {};
    setUser: (user: any) => void;
};

export type PublicationCreationStoreType = {
    title: string;
    updateTitle: () => void;
    type: PublicationType;
    updateType: () => void;
    content: string;
    updateContent: () => void;
    licence: LicenceType;
    updateLicence: () => void;
    conflictOfInterestStatus: boolean;
    updateConflictOfInterestStatus: () => void;
    conflictOfInterestText: string;
    updateConflictOfInterestText: () => void;
    linkedFromPublication: Interfaces.Publication | null;
    updateLinkedFromPublication: () => void;
    forPublicationsID: string | null;
    updateForPublicationsID: () => void;
    draftedPublication: Interfaces.Publication | null;
    updateDraftedPublication: () => void;
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
