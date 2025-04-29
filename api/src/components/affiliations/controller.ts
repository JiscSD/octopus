import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';
import * as userService from 'user/service';

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
