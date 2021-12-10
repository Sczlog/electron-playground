export const on = <TEmitter extends NodeJS.EventEmitter>(
  channel: string,
  emitter: TEmitter,
  listener: (
    event: Parameters<Parameters<TEmitter['on']>[1]>[0],
    ...args: any[]
  ) => void
) => {
  emitter.on(channel, listener);
  return () => emitter.off(channel, listener);
};
