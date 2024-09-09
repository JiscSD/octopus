import { Prisma } from '@prisma/client';
import * as client from 'lib/client';
import * as Helpers from 'lib/helpers';
import * as I from 'lib/interface';
import * as email from 'lib/email';
import * as userService from 'user/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as coAuthorService from 'coAuthor/service';

export const getMany = (where: Prisma.EventWhereInput = {}) =>
    client.prisma.event.findMany({
        where
    });

export const deleteEvent = (id: string) =>
    client.prisma.event.delete({
        where: { id }
    });

export const create = <T extends I.EventType>(type: T, data: I.EventDataType[T]) =>
    client.prisma.event.create({
        data: {
            type,
            data: data as unknown as Prisma.InputJsonValue
        }
    });

export const get = (id: string) =>
    client.prisma.event.findUnique({
        where: {
            id
        }
    });

export const deleteMany = (where: Prisma.EventWhereInput) =>
    client.prisma.event.deleteMany({
        where
    });

export const processRequestControlEvents = async (requestControlEvents: I.RequestControlEvent[]) => {
    // if there are multiple control requests for the same publication version, only pick the oldest one and delete the rest
    const uniqueControlRequestEvents: typeof requestControlEvents = [];

    for (const requestControlEvent of requestControlEvents) {
        const {
            publicationVersion: { id: publicationVersionId }
        } = requestControlEvent.data;

        if (!uniqueControlRequestEvents.some((event) => event.data.publicationVersion.id === publicationVersionId)) {
            // get the oldest request control event for this publication version
            const oldestControlRequestEvent = requestControlEvents
                .filter((event) => event.data.publicationVersion.id === publicationVersionId)
                .reduce((previousEvent, currentEvent) =>
                    new Date(previousEvent.createdAt) < new Date(currentEvent.createdAt) ? previousEvent : currentEvent
                );

            uniqueControlRequestEvents.push(oldestControlRequestEvent);
        }
    }

    for (const requestControlEvent of uniqueControlRequestEvents) {
        // check if 14 days passed
        const now = Date.now();
        const createdAt = new Date(requestControlEvent.createdAt).getTime();
        const daysSinceEvent = Math.floor((now - createdAt) / 1000 / 60 / 60 / 24);

        if (daysSinceEvent > 14) {
            try {
                const {
                    publicationVersion: { id: publicationVersionId },
                    requesterId
                } = requestControlEvent.data;

                const publicationVersion = await publicationVersionService.getById(publicationVersionId);
                const requester = await userService.get(requesterId, true);

                if (!publicationVersion) {
                    throw Error(`Publication version not found: ${publicationVersionId}`);
                }

                if (!requester) {
                    throw Error(`Requester not found: ${requesterId}`);
                }

                // transfer ownership
                await publicationVersionService.transferOwnership(
                    publicationVersionId,
                    requester.id,
                    requester.email || ''
                );

                // reset co-authors in order to enforce adding affiliations and confirm their involvement
                await coAuthorService.resetCoAuthors(publicationVersion.id);

                // notify requester that they've been approved to take control over this version
                await email.approveControlRequest(
                    {
                        requesterEmail: requester.email || '',
                        publicationVersion: {
                            authorFullName: Helpers.getUserFullName(publicationVersion.user),
                            title: publicationVersion.title || '',
                            url: Helpers.getPublicationUrl(publicationVersion.versionOf)
                        }
                    },
                    true // is automatically approved
                );

                // notify old corresponding author they've been removed
                await email.removeCorrespondingAuthor({
                    newCorrespondingAuthorFullName: Helpers.getUserFullName(requester),
                    oldCorrespondingAuthorEmail: publicationVersion.user.email || '',
                    publicationVersionTitle: publicationVersion.title || ''
                });

                // notify the rest of requesters that their control request has been dismissed
                const otherRequests = requestControlEvents.filter(
                    (event) =>
                        event.id !== requestControlEvent.id &&
                        event.data.publicationVersion.id === requestControlEvent.data.publicationVersion.id
                );

                if (otherRequests.length) {
                    for (const request of otherRequests) {
                        const supersededRequester = await userService.get(request.data.requesterId, true);

                        if (supersededRequester) {
                            // send email to the superseded requester
                            await email.controlRequestSuperseded({
                                newCorrespondingAuthorFullName: Helpers.getUserFullName(requester),
                                publicationVersionTitle: publicationVersion.title || '',
                                requesterEmail: supersededRequester.email || ''
                            });
                        }
                    }
                }

                // delete all pending requests for this publication version
                await deleteMany({
                    type: 'REQUEST_CONTROL',
                    data: {
                        path: ['publicationVersion', 'id'],
                        equals: publicationVersion.id
                    }
                });
            } catch (error) {
                console.log(error);
            }
        }
    }
};
