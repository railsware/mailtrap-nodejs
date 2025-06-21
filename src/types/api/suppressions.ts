export type Suppression = {
  id: string;
  type: "hard bounce" | "spam complaint" | "unsubscription" | "manual import";
  created_at: string;
  email: string;
  sending_stream: "transactional" | "bulk";
  domain_name: string | null;
  message_bounce_category: string | null;
  message_category: string | null;
  message_client_ip: string | null;
  message_created_at: string | null;
  message_outgoing_ip: string | null;
  message_recipient_mx_name: string | null;
  message_sender_email: string | null;
  message_subject: string | null;
};
