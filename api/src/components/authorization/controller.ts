import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';
import * as userService from 'user/service';
import * as authorizationService from 'authorization/service';

export const authorize = async (event: I.APIRequest<I.AuthorizeRequestBody>): Promise<I.JSONResponse> => {
    try {
        const callbackURL = process.env.AUTHORISATION_CALLBACK_URL;
        const clientId = process.env.ORCID_ID;
        const clientSecret = process.env.ORCID_SECRET;
        const orcidAuthUrl = process.env.ORCID_AUTH_URL;
        const orcidMemberApiUrl = process.env.ORCID_MEMBER_API_URL;
        const code = event.body.code;

        const orcidAuthRequest = await axios.post(
            `${orcidAuthUrl}/token`,
            `client_id=${clientId}&client_secret=${clientSecret}&grant_type=authorization_code&code=${code}&redirect_uri=${callbackURL}`
        );

        const orcidUserId = orcidAuthRequest.data.orcid;
        const orcidAccessToken = orcidAuthRequest.data.access_token;

        const orcidUserRequest = await axios.get(`${orcidMemberApiUrl}/${orcidUserId}/record`, {
            headers: {
                Accept: 'application/json',
                Authorization: `Bearer ${orcidAccessToken}`
            }
        });

        const userInformation: I.ORCIDUser = orcidUserRequest.data;

        const employment =
            userInformation?.['activities-summary']?.employments['affiliation-group'].map((employmentItem) => ({
                organisation: employmentItem?.summaries?.[0]?.['employment-summary']?.organization?.name || null,
                role: employmentItem?.summaries?.[0]?.['employment-summary']?.['role-title'] || null,
                department: employmentItem?.summaries?.[0]?.['department-name'] || null,
                startDate: {
                    day: employmentItem?.summaries?.[0]?.['employment-summary']?.['start-date']?.day?.value || null,
                    month: employmentItem?.summaries?.[0]?.['employment-summary']?.['start-date']?.month?.value || null,
                    year: employmentItem?.summaries?.[0]?.['employment-summary']?.['start-date']?.year?.value || null
                },
                endDate: {
                    day: employmentItem?.summaries?.[0]?.['employment-summary']?.['end-date']?.day?.value || null,
                    month: employmentItem?.summaries?.[0]?.['employment-summary']?.['end-date']?.month?.value || null,
                    year: employmentItem?.summaries?.[0]?.['employment-summary']?.['end-date']?.year?.value || null
                }
            })) || null;

        const education =
            userInformation?.['activities-summary']?.educations['affiliation-group'].map((educationItem) => ({
                organisation: educationItem?.summaries?.[0]?.['education-summary']?.organization?.name || null,
                role: educationItem?.summaries?.[0]?.['education-summary']?.['role-title'] || null,
                department: educationItem?.summaries?.[0]?.['department-name'] || null,
                startDate: {
                    day: educationItem?.summaries?.[0]?.['education-summary']?.['start-date']?.day?.value || null,
                    month: educationItem?.summaries?.[0]?.['education-summary']?.['start-date']?.month?.value || null,
                    year: educationItem?.summaries?.[0]?.['education-summary']?.['start-date']?.year?.value || null
                },
                endDate: {
                    day: educationItem?.summaries?.[0]?.['education-summary']?.['end-date']?.day?.value || null,
                    month: educationItem?.summaries?.[0]?.['education-summary']?.['end-date']?.month?.value || null,
                    year: educationItem?.summaries?.[0]?.['education-summary']?.['end-date']?.year?.value || null
                }
            })) || null;

        const works =
            userInformation?.['activities-summary']?.works?.group?.map((work) => ({
                title: work['work-summary']?.[0]?.title?.title?.value || null,
                doi:
                    work['work-summary']?.[0]?.['external-ids']?.['external-id'].find(
                        (externalId) => externalId['external-id-type'] === 'doi'
                    )?.['external-id-value'] || null,
                publishedDate: {
                    day: work['work-summary']?.[0]?.['publication-date']?.day?.value || null,
                    month: work['work-summary']?.[0]?.['publication-date']?.month?.value || null,
                    year: work['work-summary']?.[0]?.['publication-date']?.year?.value || null
                },
                url: work['work-summary']?.[0]?.url?.value || null
            })) || null;

        // always revoke the old access token and keep the new one
        try {
            await authorizationService.revokeOrcidAccess(orcidUserId);
        } catch (error) {
            console.log(error);
        }

        const user = await userService.upsertUser(orcidUserId, {
            firstName: userInformation?.person?.name?.['given-names']?.value || '',
            lastName: userInformation?.person?.name?.['family-name']?.value || '',
            employment,
            education,
            works,
            orcidAccessToken
        });

        const token = authorizationService.createJWT(user);

        return response.json(200, token);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};

export const getDecodedUserToken = async (event: I.AuthenticatedAPIRequest) => {
    return response.json(200, event.user);
};

export const verifyOrcidAccess = async (event: I.AuthenticatedAPIRequest) => {
    try {
        await authorizationService.verifyOrcidAccess(event.user.orcid);
    } catch (error) {
        return response.json(error.response.status, { message: error.response.data.error_description });
    }

    return response.json(200, 'OK');
};

export const revokeOrcidAccess = async (event: I.AuthenticatedAPIRequest) => {
    try {
        await authorizationService.revokeOrcidAccess(event.user.orcid);
    } catch (error) {
        return response.json(error.response.status, { message: error.response.data.error_description });
    }

    return response.json(200, 'Successfully revoked access to ORCID');
};
