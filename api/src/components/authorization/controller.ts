import axios from 'axios';

import * as I from 'interface';
import * as response from 'lib/response';

import * as userService from 'user/service';
import * as authorizationService from 'authorization/service';

export const authorize = async (event: I.APIRequest<I.AuthorizeRequestBody>): Promise<I.JSONResponse> => {
    try {
        let callbackURL = '';
        switch (process.env.STAGE) {
            case 'local':
                callbackURL = 'https://localhost:3001/login';
                break;
            case 'prod':
                callbackURL = 'https://octopus.ac/login';
                break;
            default:
                callbackURL = `https://${process.env.STAGE}.octopus.ac/login`;
        }

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

        const user = await userService.upsertUser(orcidRequest.data.orcid, {
            firstName: userInformation.person.name['given-names']?.value || '',
            lastName: userInformation.person.name['family-name']?.value || '',
            employment,
            education
        });

        const token = authorizationService.createJWT(user);

        return response.json(200, token);
    } catch (err) {
        console.log(err);
        return response.json(500, { message: 'Unknown server error.' });
    }
};
