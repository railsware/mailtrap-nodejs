import { Inbox } from "./inboxes";

type ShareLinks = {
  admin: string;
  viewer: string;
};

export type Project = {
  id: number;
  name: string;
  share_links: ShareLinks;
  inboxes: Inbox[];
  permissions: Permissions;
};
