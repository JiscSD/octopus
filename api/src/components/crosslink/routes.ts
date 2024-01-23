import middy from '@middy/core';

import * as crosslinkController from 'crosslink/controller';
import * as crosslinkSchema from 'crosslink/schema';
import * as middleware from 'middleware';

export const create = middy(crosslinkController.create)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(crosslinkSchema.createCrosslink, 'body'));

export const deleteCrosslink = middy(crosslinkController.deleteCrosslink)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());

export const setVote = middy(crosslinkController.setVote)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication())
    .use(middleware.validator(crosslinkSchema.setVote, 'body'));

export const resetVote = middy(crosslinkController.resetVote)
    .use(middleware.doNotWaitForEmptyEventLoop({ runOnError: true, runOnBefore: true, runOnAfter: true }))
    .use(middleware.httpJsonBodyParser())
    .use(middleware.authentication());
