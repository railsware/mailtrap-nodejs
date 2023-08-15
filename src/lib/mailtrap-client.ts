import * as http from "http";
import * as https from "https";

import axios, { AxiosInstance } from "axios";

import encodeMailBuffers from "./mail-buffer-encoder";
import MailtrapError from "./MailtrapError";

import CONFIG from "../config";

import { Mail, SendResponse, MailtrapClientConfig } from "../types/mailtrap";

const { MAILTRAP_ENDPOINT, USER_AGENT } = CONFIG;

/**
 * Mailtrap client class. Initializes instance with available methods.
 */
export class MailtrapClient {
  private axios: AxiosInstance;

  /**
   * Initalizes axios instance with Mailtrap params.
   */
  constructor({ endpoint = MAILTRAP_ENDPOINT, token }: MailtrapClientConfig) {
    this.axios = axios.create({
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true }),
      baseURL: endpoint,
      headers: {
        Authorization: `Bearer ${token}`,
        Connection: "keep-alive",
        "User-Agent": USER_AGENT,
      },
      maxRedirects: 0,
      timeout: 10000,
    });
  }

  /**
   * Sends mail with given `mail` params. If there is error, rejects with `MailtrapError`.
   */
  public async send(mail: Mail): Promise<SendResponse> {
    const preparedMail = encodeMailBuffers(mail);

    try {
      const axiosResponse = await this.axios.post<SendResponse>(
        "/api/send",
        preparedMail
      );

      return axiosResponse.data;
    } catch (err) {
      if (axios.isAxiosError(err)) {
        const serverErrors =
          err.response?.data &&
          typeof err.response.data === "object" &&
          "errors" in err.response.data &&
          err.response.data.errors instanceof Array
            ? err.response.data.errors
            : undefined;

        const message = serverErrors ? serverErrors.join(", ") : err.message;

        // @ts-expect-error weird typing around Error class, but it's tested to work
        throw new MailtrapError(message, { cause: err });
      }

      // should not happen, but otherwise rethrow error as is
      throw err;
    }
  }
}

export * from "../types/mailtrap";
