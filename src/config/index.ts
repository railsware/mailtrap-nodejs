export default {
  ERRORS: {
    FILENAME_REQUIRED: "Filename is required.",
    CONTENT_REQUIRED: "Content is required.",
    SUBJECT_REQUIRED: "Subject is required.",
    FROM_REQUIRED: "From is required.",
    INVALID_MAIL: "Mail is invalid.",
    SENDING_FAILED: "Sending failed.",
    NO_DATA_ERROR: "No Data.",
  },
  CLIENT_SETTINGS: {
    MAILTRAP_ENDPOINT: "https://send.api.mailtrap.io",
    USER_AGENT:
      "mailtrap-nodejs (https://github.com/railsware/mailtrap-nodejs)",
    MAX_REDIRECTS: 0,
    TIMEOUT: 10000,
  },
  TRANSPORT_SETTINGS: {
    NAME: "MailtrapTransport",
  },
};
