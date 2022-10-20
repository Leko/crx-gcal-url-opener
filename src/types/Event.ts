export type PortableEvent = {
  id: string;
  title: string;
  startsAt: string;
  endsAt: string;
  url: string;
};

export type ParsedEvent = Omit<PortableEvent, "startsAt" | "endsAt"> & {
  startsAt: Date;
  endsAt: Date;
  startsIn: number;
  duration: number;
};
