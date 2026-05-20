export function createSyncQueue() {
  const entries = [];

  return {
    enqueue: (entry) => {
      entries.push({
        ...entry,
        queuedAt: new Date().toISOString()
      });
      return entries.length;
    },
    dequeue: () => entries.shift(),
    peek: () => entries[0],
    clear: () => {
      entries.length = 0;
    },
    size: () => entries.length,
    toArray: () => [...entries]
  };
}

export function createSyncController({ push, pull } = {}) {
  return {
    push: (payload, context) => push?.(payload, context),
    pull: (context) => pull?.(context)
  };
}
