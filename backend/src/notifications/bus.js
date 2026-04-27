const subscribers = new Set();

export function publish(event) {
  for (const fn of subscribers) fn(event);
}

export function subscribe(fn) {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

