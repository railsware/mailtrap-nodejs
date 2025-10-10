import { AxiosInstance } from "axios";

import TemplatesApi from "./resources/Templates";

export default class TemplatesBaseAPI {
  public get: TemplatesApi["get"];

  public getList: TemplatesApi["getList"];

  public create: TemplatesApi["create"];

  public update: TemplatesApi["update"];

  public delete: TemplatesApi["delete"];

  constructor(client: AxiosInstance, accountId: number) {
    const templates = new TemplatesApi(client, accountId);
    this.get = templates.get.bind(templates);
    this.getList = templates.getList.bind(templates);
    this.create = templates.create.bind(templates);
    this.update = templates.update.bind(templates);
    this.delete = templates.delete.bind(templates);
  }
}
