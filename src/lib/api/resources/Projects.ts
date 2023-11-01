import { AxiosInstance } from "axios";

import handleSendingError from "../../axios-logger";

import CONFIG from "../../../config";

import { Project } from "../../../types/api/projects";

const { CLIENT_SETTINGS } = CONFIG;
const { GENERAL_ENDPOINT } = CLIENT_SETTINGS;

export default class ProjectsApi {
  private client: AxiosInstance;

  private accountId?: number;

  private projectsURL: string;

  constructor(client: AxiosInstance, accountId?: number) {
    this.client = client;
    this.accountId = accountId;
    this.projectsURL = `${GENERAL_ENDPOINT}/api/accounts/${this.accountId}/projects`;
  }

  /**
   * Creates new project.
   */
  public async create(projectName: string) {
    const data = { project: { name: projectName } };

    try {
      const apiResponse = await this.client.post<Project>(
        this.projectsURL,
        data
      );

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Lists projects and their inboxes to which the API token has access.
   */
  public async getList() {
    try {
      const apiResponse = await this.client.get<Project[]>(this.projectsURL);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Gets the project and it's inboxes.
   */
  public async getById(projectId: number) {
    const url = `${this.projectsURL}/${projectId}`;

    try {
      const apiResponse = await this.client.get<Project>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Updates project name. The project name is min 2 characters and max 100 characters long.
   */
  public async update(projectId: number, updatedName: string) {
    const url = `${this.projectsURL}/${projectId}`;
    const data = { project: { name: updatedName } };

    try {
      const apiResponse = await this.client.patch<Project>(url, data);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }

  /**
   * Deletes a project by its ID.
   */
  public async delete(projectId: number) {
    const url = `${this.projectsURL}/${projectId}`;

    try {
      const apiResponse = await this.client.delete<Project>(url);

      return apiResponse.data;
    } catch (error) {
      return handleSendingError(error);
    }
  }
}
