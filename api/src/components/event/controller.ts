import * as I from 'interface';
import * as email from 'email';
import * as response from 'lib/response';
import * as eventService from 'event/service';
import { Prisma } from '@prisma/client';

/**
 * @todo: Remove code related to dummy events once functionality has been tested.
 */
export const dailyEventCheck = async (): Promise<I.JSONResponse> => {
    // Collect all pending dummy events
    const events = await eventService.getByTypes(['dummy']);

    let successCount = 0;
    let failureCount = 0;

    // Send an email to an address specified in the event json
    for (const dummyEvent of events) {
        if (dummyEvent.data) {
            const eventData = dummyEvent.data as Prisma.JsonObject;

            if (eventData.to) {
                await email.dummyEventNotification(eventData.to as string);
                // Delete event record when done
                await eventService.deleteEvent(dummyEvent.id);
                successCount++;
            } else {
                console.log('Unable to process event; no to address provided', dummyEvent.id);
                failureCount++;
            }
        }
    }

    if (failureCount) {
        return response.json(200, {
            message: `Finished with ${failureCount} error${failureCount !== 1 ? 's' : ''}`
        });
    }

    return response.json(200, {
        message: `Processed ${successCount} event${successCount !== 1 ? 's' : ''}`
    });
};
