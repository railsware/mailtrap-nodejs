export type BillingCycleUsage = {
  billing: {
    cycle_start: string;
    cycle_end: string;
  };
  sending: {
    plan: {
      name: string;
    };
    usage: {
      sent_messages_count: {
        current: number;
        limit: number;
      };
    };
  };
  testing: {
    plan: {
      name: string;
    };
    usage: {
      sent_messages_count: {
        current: number;
        limit: number;
      };
      forwarded_messages_count: {
        current: number;
        limit: number;
      };
    };
  };
};
