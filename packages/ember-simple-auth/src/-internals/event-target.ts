import EmberObject from '@ember/object';
import Evented from '@ember/object/evented';

export type EventListener<Events, Event extends keyof Events> = (event: Events[Event]) => void;

type ValueIsEvent<T> = {
  [key in keyof T]: CustomEvent;
};

/**
 * This module exists to act as a 'shim' between Native EventTarget API, which unfortunately can't be used due to Fastboot's node environment not providing it.
 *
 * It more-or-less implements the same API as an EventTarget would have but on top of Evented mixin instead.
 */
export default class EsaEventTarget<Events extends ValueIsEvent<Events>> extends EmberObject.extend(
  Evented
) {
  addEventListener<Event extends keyof Events & string>(
    event: Event,
    cb: EventListener<Events, Event>
  ) {
    (this as any).on(event, cb);
  }

  removeEventListener<Event extends keyof Events & string>(
    event: Event,
    cb: EventListener<Events, Event>
  ) {
    (this as any).off(event, cb);
  }

  dispatchEvent<Event extends keyof Events & string>(event: Event, value: Events[Event]['detail']) {
    // let customEvent: CustomEvent;
    // if (value) {
    //   customEvent = new CustomEvent(event, { detail: value });
    // } else {
    //   customEvent = new CustomEvent(event);
    // }

    (this as any).trigger(event, { detail: value });
  }
}
