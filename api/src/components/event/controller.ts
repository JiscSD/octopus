import * as I from 'interface';
import * as eventService from 'event/service';

export const dailyEventCheck = async (): Promise<void> => {
    const requestControlEvents = await eventService.getMany({ type: 'REQUEST_CONTROL' });

    if (requestControlEvents.length) {
        await eventService.processRequestControlEvents(requestControlEvents as I.RequestControlEvent[]);
    }
};
