import type { SubscriberArg, SubscribeHandler } from "./types";

import isntString from "./is-not-string";
import unpackPayload from "./unpack-payload";
import dispatch from "./dispatch";
import broadcastToChildWindows from "./broadcast-to-child-windows";

export default function onmessage(e: MessageEvent): void {
  if (isntString(e.data)) {
    return;
  }

  const payload = unpackPayload(e);
  if (!payload) {
    return;
  }

  const data = payload.eventData as SubscriberArg;
  const reply = payload.reply as SubscribeHandler;

  dispatch("*", payload.event, data, reply, e);
  dispatch(e.origin, payload.event, data, reply, e);
  broadcastToChildWindows(e.data, payload.origin, e.source as Window);
}