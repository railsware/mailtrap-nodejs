import { Transport } from "nodemailer";
import MailMessage from "nodemailer/lib/mailer/mail-message";

import { MailtrapClient } from "./mailtrap-client";
import normalizeCallback from "./normalizer";

import STRINGS from "../config";

import { MailtrapClientConfig } from "../types/mailtrap";
import {
  MailtrapResponse,
  MailtrapTransporter,
  NormalizeCallback,
} from "../types/transporter";

const { TRANSPORT_NAME } = STRINGS;

/**
 * Avoid TypeScript treating project root as dist root.
 */
const packageData = require("../../package.json");

/**
 * Mailtrap transport for NodeMailer.
 */
class MailtrapTransport implements Transport<MailtrapResponse> {
  public name: string;

  public version: string;

  private client: MailtrapClient;

  /**
   * Initialize transport `name`, `version` and `client`.
   */
  constructor(options: MailtrapClientConfig) {
    this.name = TRANSPORT_NAME;
    this.version = packageData.version;
    this.client = new MailtrapClient(options);
  }

  /**
   * Send message via `Mailtrap` client.
   */
  public send(
    nodemailerMessage: MailMessage<MailtrapResponse>,
    callback: NormalizeCallback
  ): void {
    nodemailerMessage.normalize(normalizeCallback(this.client, callback));
  }
}

/**
 * Extends `nodemailer` types to support Mailtrap API params.
 */
declare module "nodemailer" {
  export function createTransport(
    transport: MailtrapTransport
  ): MailtrapTransporter;
}

export default (options: MailtrapClientConfig) =>
  new MailtrapTransport(options);
