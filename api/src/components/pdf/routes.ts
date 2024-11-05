import middy from '@middy/core';

import * as middleware from 'middleware';
import * as pdfController from 'pdf/controller';
import * as pdfSchema from 'pdf/schema';

export const getPublicationPDF = middy(pdfController.getPublicationPDF)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.validator(pdfSchema.getPublicationPDF, 'pathParameters'));
