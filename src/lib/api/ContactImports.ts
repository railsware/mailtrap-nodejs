import { AxiosInstance } from "axios";

import ContactImportsApi from "./resources/ContactImports";

export default class ContactImportsBaseAPI {
  public create: ContactImportsApi["create"];

  public get: ContactImportsApi["get"];

  constructor(client: AxiosInstance, accountId: number) {
    const contactImports = new ContactImportsApi(client, accountId);
    this.create = contactImports.create.bind(contactImports);
    this.get = contactImports.get.bind(contactImports);
  }
}
