import * as I from 'interface';
import * as email from 'email';
import * as eventService from 'event/service';
import * as userService from 'user/service';
import * as publicationVersionService from 'publicationVersion/service';
import * as coAuthorService from 'coauthor/service';

export const dailyEventCheck = async (): Promise<void> => {
    // 'DUMMY' events - for testing purpose
    const dummyEvents = await eventService.getByTypes(['DUMMY']);

    if (dummyEvents.length) {
        // Send an email to an address specified in the event json
        for (const dummyEvent of dummyEvents) {
            if (dummyEvent.data) {
                const eventData = dummyEvent.data as unknown as I.DummyEventData;

                try {
                    if (!eventData.to) {
                        throw Error(`Unable to process event; no "to" address provided. Event id: ${dummyEvent.id}`);
                    }

                    // send email to specified address
                    await email.dummyEventNotification(eventData.to);

                    // Delete event record when done
                    await eventService.deleteEvent(dummyEvent.id);
                } catch (error) {
                    console.log(error);
                }
            }
        }
    }

    // 'REQUEST_CONTROL' events
    const requestControlEvents = await eventService.getByTypes(['REQUEST_CONTROL']);

    // if there are multiple control requests for the same publication version, only pick the oldest one and delete the rest
    const uniqueControlRequestEvents: typeof requestControlEvents = [];

    for (const requestControlEvent of requestControlEvents) {
        const {
            publicationVersion: { id: publicationVersionId }
        } = requestControlEvent.data as I.RequestControlData;

        if (
            !uniqueControlRequestEvents.some(
                (event) => (event.data as I.RequestControlData).publicationVersion.id === publicationVersionId
            )
        ) {
            // get the oldest request control event for this publication version
            const oldestControlRequestEvent = requestControlEvents
                .filter((event) => (event.data as I.RequestControlData).publicationVersion.id === publicationVersionId)
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
                } = requestControlEvent.data as I.RequestControlData;

                const publicationVersion = await publicationVersionService.getById(publicationVersionId);
                const requester = await userService.get(requesterId, true);

                if (!publicationVersion) {
                    throw Error(`Publication version not found: ${publicationVersionId}`);
                }

                if (!requester) {
                    throw Error(`Requester not found: ${requesterId}`);
                }

                // transfer ownership
                await publicationVersionService.update(publicationVersionId, {
                    user: {
                        connect: {
                            id: requester.id
                        }
                    },
                    coAuthors: {
                        // create/update the new corresponding author
                        upsert: {
                            create: {
                                email: requester.email || '',
                                confirmedCoAuthor: true,
                                linkedUser: requester.id
                            },
                            update: {
                                confirmedCoAuthor: true,
                                linkedUser: requester.id
                            },
                            where: {
                                publicationVersionId_email: {
                                    email: requester.email || '',
                                    publicationVersionId: publicationVersion.id
                                }
                            }
                        }
                    }
                });

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
                await eventService.deleteMany({
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
