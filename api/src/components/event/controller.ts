import * as I from 'interface';
import * as eventService from 'event/service';

export const dailyEventCheck = async (): Promise<void> => {
    const dummyEvents = await eventService.getByTypes(['DUMMY']);

    if (dummyEvents.length) {
        await eventService.processDummyEvents(dummyEvents as I.DummyEvent[]);
    }

    const requestControlEvents = await eventService.getByTypes(['REQUEST_CONTROL']);

    if (requestControlEvents.length) {
        await eventService.processRequestControlEvents(requestControlEvents as I.RequestControlEvent[]);
    }
};
