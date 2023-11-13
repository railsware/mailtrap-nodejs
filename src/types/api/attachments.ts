export type Attachment = {
  id: number;
  message_id: number;
  filename: string;
  attachment_type: string;
  content_type: string;
  content_id: string;
  transfer_encoding: string;
  attachment_size: number;
  created_at: string;
  updated_at: string;
  attachment_human_size: string;
  download_path: string;
};
