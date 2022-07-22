import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';

import * as userService from 'user/service';
import * as authorizationService from 'authorization/service';

export const authorize = async (event: I.APIRequest<I.AuthorizeRequestBody>): Promise<I.JSONResponse> => {
    try {
        const callbackURL = process.env.AUTHORISATION_CALLBACK_URL;

        const orcidRequest = await axios.post(
            'https://orcid.org/oauth/token',
            `client_id=${process.env.ORCID_ID}&client_secret=${process.env.ORCID_SECRET}&grant_type=authorization_code&redirect_uri=${callbackURL}&code=${event.body.code}`
        );

        const ORCIDRequestPublicUserResponse = await axios.get(
            `https://pub.orcid.org/v3.0/${orcidRequest.data.orcid}/record`,
            {
                headers: {
                    Accept: 'application/json'
                }
            }
        );

        const userInformation: I.ORCIDUser = ORCIDRequestPublicUserResponse.data;

        const employment = userInformation['activities-summary'].employments['affiliation-group'].map(
            (employmentItem) => ({
                organisation: employmentItem.summaries[0]['employment-summary'].organization.name || null,
                role: employmentItem.summaries[0]['employment-summary']['role-title'] || null,
                department: employmentItem.summaries[0]['department-name'] || null,
                startDate: {
                    day: employmentItem.summaries[0]['employment-summary']['start-date']?.day?.value || null,
                    month: employmentItem.summaries[0]['employment-summary']['start-date']?.month?.value || null,
                    year: employmentItem.summaries[0]['employment-summary']['start-date']?.year?.value || null
                },
                endDate: {
                    day: employmentItem.summaries[0]['employment-summary']['end-date']?.day?.value || null,
                    month: employmentItem.summaries[0]['employment-summary']['end-date']?.month?.value || null,
                    year: employmentItem.summaries[0]['employment-summary']['end-date']?.year?.value || null
                }
            })
        );

        const education = userInformation['activities-summary'].educations['affiliation-group'].map(
            (educationItem) => ({
                organisation: educationItem.summaries[0]['education-summary'].organization.name || null,
                role: educationItem.summaries[0]['education-summary']['role-title'] || null,
                department: educationItem.summaries[0]['department-name'] || null,
                startDate: {
                    day: educationItem.summaries[0]['education-summary']['start-date']?.day?.value || null,
                    month: educationItem.summaries[0]['education-summary']['start-date']?.month?.value || null,
                    year: educationItem.summaries[0]['education-summary']['start-date']?.year?.value || null
                },
                endDate: {
                    day: educationItem.summaries[0]['education-summary']['end-date']?.day?.value || null,
                    month: educationItem.summaries[0]['education-summary']['end-date']?.month?.value || null,
                    year: educationItem.summaries[0]['education-summary']['end-date']?.year?.value || null
                }
            })
        );

        // eslint-disable-next-line @typescript-eslint/dot-notation
        const works = userInformation['activities-summary'].works['group'].map((work) => ({
            title: work['work-summary'][0].title.title.value || null,
            doi:
                work['work-summary'][0]['external-ids']['external-id'].find(
                    (externalId) => externalId['external-id-type'] === 'doi'
                )?.['external-id-value'] || null,
            publishedDate: {
                day: work['work-summary'][0]['publication-date']?.day?.value || null,
                month: work['work-summary'][0]['publication-date']?.month?.value || null,
                year: work['work-summary'][0]['publication-date']?.year?.value || null
            },
            url: work['work-summary'][0]?.url?.value || null
        }));

        const user = await userService.upsertUser(orcidRequest.data.orcid, {
            firstName: userInformation.person.name['given-names']?.value || '',
            lastName: userInformation.person.name['family-name']?.value || '',
            employment,
            education,
            works
        });

        const token = authorizationService.createJWT(user);

        return response.json(200, token);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
