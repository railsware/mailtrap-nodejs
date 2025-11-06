import { AxiosInstance } from "axios";

import ContactExportsApi from "./resources/ContactExports";

export default class ContactExportsBaseAPI {
  public create: ContactExportsApi["create"];

  public get: ContactExportsApi["get"];

  constructor(client: AxiosInstance, accountId: number) {
    const contactExports = new ContactExportsApi(client, accountId);
    this.create = contactExports.create.bind(contactExports);
    this.get = contactExports.get.bind(contactExports);
  }
}
