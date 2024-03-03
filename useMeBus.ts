import { z } from "zod";
import { type EventSchema, MeBus } from "mebus";
import { createEffect, createMemo } from "solid-js";

/**
 * React hook for MeBus. Accepts event schema and event callbacks and returns a publish function.
 *
 * @param {EventSchema} eventSchema - The event schema object.
 * @param {Object} eventCallbacks - The event callbacks object.
 * @returns function to publish events.
 *
 * @example
 * const sendEvent = useMeBus({
 *  eventSchema: {
 *   event1: z.object({
 *    data: z.string(),
 *  }),
 *  eventCallbacks: {
 *    event1: (payload) => console.log("Payload:", payload.data, "and it's type:", typeof payload.data),
 *  },
 * });
 * sendEvent("event1", { payload: "foo" });
 */
export const useMeBus = <T extends EventSchema>({
  eventSchema,
  eventCallbacks,
}: {
  eventSchema: T;
  eventCallbacks?: {
    [K in keyof T]?: (payload: z.infer<T[K]>) => void | Promise<void>;
  };
}) => {
  const bus = createMemo(() => new MeBus(eventSchema), [eventSchema]);

  createEffect(() => {
    if (!eventCallbacks) return;
    const cleanups = Object.keys(eventSchema).map((event) => {
      const callback = eventCallbacks[event];
      if (!callback) return null;
      const unsubscribe = bus().subscribe(event, callback);
      return unsubscribe;
    });

    return () => {
      cleanups.forEach((cleanup) => {
        if (!cleanup) return;
        cleanup();
      });
    };
  });

  const publish = <K extends keyof T & string>(
    event: K,
    payload: z.infer<T[K]>
  ) => {
    bus().publish(event, payload);
  };

  return publish;
};
