import axios from 'axios';

import * as I from 'interface';
import * as pdfService from 'pdf/service';
import * as publicationService from 'publication/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as response from 'lib/response';
import * as s3 from 'lib/s3';

export const getPublicationPDF = async (
    event: I.APIRequest<undefined, I.GeneratePDFQueryParams, I.GeneratePDFPathParams>
): Promise<I.JSONResponse> => {
    const generateNewPDF = event.queryStringParameters?.generateNewPDF === 'true';
    const redirectToPreview = event.queryStringParameters?.redirectToPreview === 'true';
    const publicationId = event.pathParameters.publicationId;
    const publication = await publicationService.get(publicationId);

    if (!publication) {
        return response.json(404, {
            message: 'This publication does not exist.'
        });
    }

    if (!publication.versions.some((version) => version.isLatestLiveVersion)) {
        return response.json(403, {
            message: 'Publication needs to be LIVE in order to generate a PDF version of it.'
        });
    }

    let pdfUrl: string | null = null;

    if (!generateNewPDF) {
        // check if there's a generated PDF for this publication
        try {
            const currentPdfUrl = `${s3.endpoint}/${s3.buckets.pdfs}/${publicationId}.pdf`;
            const result = await axios.get(currentPdfUrl);

            if (result.status === 200) {
                pdfUrl = currentPdfUrl;
            }
        } catch (error) {
            console.log(error);
        }
    }

    if (!pdfUrl || generateNewPDF) {
        // Generate new PDF (overwrites if there is an existing one).
        try {
            // We know the publication has at least one LIVE version.
            const latestPublishedVersion = await publicationVersionService.get(publication.id, 'latestLive');

            if (!latestPublishedVersion) {
                throw Error('Unable to get latest published version from supplied object');
            }

            const newPDFUrl = await pdfService.generatePublicationVersionPDF(latestPublishedVersion);

            if (!newPDFUrl) {
                throw Error('Failed to generate PDF');
            }

            pdfUrl = newPDFUrl;
        } catch (error) {
            console.log(error);

            return response.json(500, 'The PDF version of this publication has failed to generate');
        }
    }

    return redirectToPreview
        ? {
              statusCode: 302,
              headers: {
                  Location: pdfUrl
              }
          }
        : response.json(200, { pdfUrl });
};
