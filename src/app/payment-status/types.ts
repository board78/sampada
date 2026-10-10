export type Status = "checking" | "success" | "failed" | "timeout";
export type LoopKey = number;

export type DrawInfo = {
  name: string;
  tickets: number;
  numbers: string[];
};

export type QpcStatusResponse = {
  status?: string;
  draws?: DrawInfo[];
  amount?: number;
  error?: string;
};
