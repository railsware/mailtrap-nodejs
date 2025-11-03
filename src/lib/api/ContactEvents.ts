import { AxiosInstance } from "axios";

import ContactEventsApi from "./resources/ContactEvents";

export default class ContactFieldsBaseAPI {
  public create: ContactEventsApi["create"];

  constructor(client: AxiosInstance, accountId: number) {
    const contactEvents = new ContactEventsApi(client, accountId);
    this.create = contactEvents.create.bind(contactEvents);
  }
}
