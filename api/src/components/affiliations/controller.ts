import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';
import * as publicationVersionService from 'publicationVersion/service';
import * as userService from 'user/service';
import * as coAuthorService from 'coAuthor/service';
import { Prisma } from '@prisma/client';

export const updateAffiliations = async (
    event: I.AuthenticatedAPIRequest<I.UpdateAffiliationsBody, undefined, I.UpdateAffiliationsPathParams>
): Promise<I.JSONResponse> => {
    try {
        const isIndependent = event.body.isIndependent;
        const affiliations = event.body.affiliations;
        const publicationVersionId = event.pathParameters.publicationVersionId;
        // Get publication version
        const version = await publicationVersionService.getById(publicationVersionId);

        // Check that the version exists
        if (!version) {
            return response.json(404, {
                message: 'This publication does not exist.'
            });
        }

        // Check if version is LIVE
        if (version.currentStatus === 'LIVE') {
            return response.json(400, {
                message: 'You cannot add affiliations to a LIVE publication.'
            });
        }

        const coAuthor = version.coAuthors.find((author) => author.linkedUser === event.user.id);

        // Check if this user is an author on the version
        if (!coAuthor) {
            return response.json(403, {
                message: 'You do not have permissions to add an affiliation to this publication.'
            });
        }

        // While the publication status is DRAFT, only the corresponding author can update his/her affiliations
        if (version.currentStatus === 'DRAFT' && coAuthor.linkedUser !== version.createdBy) {
            return response.json(403, {
                message: 'You cannot add affiliations while the publication is being edited.'
            });
        }

        // enforce adding affiliations if co-author is not independent
        if (version.currentStatus === 'LOCKED' && !isIndependent && !affiliations.length) {
            return response.json(403, {
                message: 'Please fill out your affiliation information.'
            });
        }

        // check duplicate affiliations
        const hasDuplicates = new Set(affiliations.map((affiliation) => affiliation.id)).size !== affiliations.length;

        if (hasDuplicates) {
            return response.json(403, { message: 'Duplicate affiliations found.' });
        }

        // Check if coauthor (beside the corresponding one) has already approved this version
        if (coAuthor.linkedUser !== version.createdBy && coAuthor.confirmedCoAuthor) {
            return response.json(403, {
                message: 'You cannot change your affiliation information while the publication has been approved.'
            });
        }

        // update affiliations for this author
        await coAuthorService.update(coAuthor.id, {
            affiliations: isIndependent ? [] : (affiliations as unknown[] as Prisma.InputJsonValue[]), // we can safely remove author affiliations if they declared they are independent
            isIndependent
        });

        return response.json(200, { message: 'Successfully updated affiliations.' });
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};

const mapOrcidAffiliationSummary = (
    summary: I.OrcidAffiliationSummary,
    affiliationType: I.MappedOrcidAffiliation['affiliationType']
): I.MappedOrcidAffiliation => ({
    id: summary['put-code'],
    affiliationType,
    title: summary['role-title'],
    departmentName: summary['department-name'],
    startDate: summary['start-date']
        ? {
              year: summary['start-date'].year?.value || null,
              month: summary['start-date'].month?.value || null,
              day: summary['start-date'].day?.value || null
          }
        : undefined,
    endDate: summary['end-date']
        ? {
              year: summary['end-date'].year?.value || null,
              month: summary['end-date'].month?.value || null,
              day: summary['end-date'].day?.value || null
          }
        : undefined,
    organization: summary.organization,
    createdAt: summary['created-date'].value,
    updatedAt: summary['last-modified-date'].value,
    source: {
        name: summary.source['source-name'].value,
        orcid: summary.source['source-orcid']?.path || summary.source['source-client-id']?.path || ''
    },
    url: summary.url ? summary.url.value : undefined
});

export const getOrcidAffiliations = async (
    event: I.AuthenticatedAPIRequest<undefined, undefined, undefined>
): Promise<I.JSONResponse> => {
    try {
        const user = await userService.get(event.user.id, true);

        const orcidMemberApiUrl = process.env.ORCID_MEMBER_API_URL;

        const orcidRecordResponse = await axios.get(`${orcidMemberApiUrl}/${user?.orcid}/record`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${user?.orcidAccessToken}`
            }
        });

        const activitiesSummary = orcidRecordResponse.data['activities-summary'];

        const memberships: I.MappedOrcidAffiliation[] = activitiesSummary?.memberships?.['affiliation-group'].map(
            (item) => mapOrcidAffiliationSummary(item?.summaries?.[0]?.['membership-summary'], 'membership')
        );

        const services: I.MappedOrcidAffiliation[] = activitiesSummary?.services?.['affiliation-group'].map((item) =>
            mapOrcidAffiliationSummary(item?.summaries?.[0]?.['service-summary'], 'service')
        );

        const invitedPositions: I.MappedOrcidAffiliation[] = activitiesSummary?.['invited-positions']?.[
            'affiliation-group'
        ].map((item) =>
            mapOrcidAffiliationSummary(item?.summaries?.[0]?.['invited-position-summary'], 'invited-position')
        );

        const distinctions: I.MappedOrcidAffiliation[] = activitiesSummary?.distinctions?.['affiliation-group'].map(
            (item) => mapOrcidAffiliationSummary(item?.summaries?.[0]?.['distinction-summary'], 'distinction')
        );

        const employments: I.MappedOrcidAffiliation[] = activitiesSummary?.employments?.['affiliation-group'].map(
            (item) => mapOrcidAffiliationSummary(item?.summaries?.[0]?.['employment-summary'], 'employment')
        );

        const educations: I.MappedOrcidAffiliation[] = activitiesSummary?.educations?.['affiliation-group'].map(
            (item) => mapOrcidAffiliationSummary(item?.summaries?.[0]?.['education-summary'], 'education')
        );

        const qualifications: I.MappedOrcidAffiliation[] = activitiesSummary?.qualifications?.['affiliation-group'].map(
            (item) => mapOrcidAffiliationSummary(item?.summaries?.[0]?.['qualification-summary'], 'qualification')
        );

        return response.json(200, [
            ...memberships,
            ...services,
            ...invitedPositions,
            ...distinctions,
            ...employments,
            ...educations,
            ...qualifications
        ]);
    } catch (err) {
        console.log(err);

        return response.json(500, { message: 'Unknown server error.' });
    }
};
