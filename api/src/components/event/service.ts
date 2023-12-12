import { Prisma } from '@prisma/client';
import * as client from 'lib/client';
import * as I from 'lib/interface';
import * as email from 'lib/email';
import * as userService from 'user/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as coAuthorService from 'coauthor/service';

export const getByTypes = async (types: I.EventType[], additionalFilters: Omit<Prisma.EventWhereInput, 'type'> = {}) =>
    client.prisma.event.findMany({
        where: {
            type: {
                in: types
            },
            ...additionalFilters
        }
    });

export const deleteEvent = async (id: string) =>
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

export const processDummyEvents = async (dummyEvents: I.DummyEvent[]) => {
    // Send an email to an address specified in the event json
    for (const dummyEvent of dummyEvents) {
        if (dummyEvent.data) {
            const eventData = dummyEvent.data;

            try {
                if (!eventData.to) {
                    throw Error(`Unable to process event; no "to" address provided. Event id: ${dummyEvent.id}`);
                }

                // send email to specified address
                await email.dummyEventNotification(eventData.to);

                // Delete event record when done
                await deleteEvent(dummyEvent.id);
            } catch (error) {
                console.log(error);
            }
        }
    }
};

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
                            authorFullName: `${publicationVersion.user.firstName} ${publicationVersion.user.lastName}`,
                            title: publicationVersion.title || '',
                            url: `${process.env.BASE_URL}/publications/${publicationVersion.versionOf}/versions/latest`
                        }
                    },
                    true // is automatically approved
                );

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
