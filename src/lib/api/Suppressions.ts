import { AxiosInstance } from "axios";

import SuppressionsApi from "./resources/Suppressions";

export default class SuppressionsBaseAPI {
  private client: AxiosInstance;

  private accountId?: number;

  public getList: SuppressionsApi["getList"];

  public delete: SuppressionsApi["delete"];

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    const suppressions = new SuppressionsApi(this.client, this.accountId);
    this.getList = suppressions.getList.bind(suppressions);
    this.delete = suppressions.delete.bind(suppressions);
  }
}
