# Mailtrap Node.js client - Official

![TypeScript](https://img.shields.io/npm/types/mailtrap?logo=typescript&logoColor=white&label=%20)
[![test](https://github.com/railsware/mailtrap-nodejs/actions/workflows/test.yml/badge.svg)](https://github.com/railsware/mailtrap-nodejs/actions/workflows/test.yml)
[![NPM](https://shields.io/npm/v/mailtrap?logo=npm&logoColor=white)](https://www.npmjs.com/package/mailtrap)
[![downloads](https://shields.io/npm/d18m/mailtrap)](https://www.npmjs.com/package/mailtrap)


## Prerequisites

To get the most out of this official Mailtrap.io Node.js SDK:
- [Create a Mailtrap account](https://mailtrap.io/signup)
- [Verify your domain](https://mailtrap.io/sending/domains)

## Supported functionality

This NPM package offers integration with the [official API](https://api-docs.mailtrap.io/) for [Mailtrap](https://mailtrap.io).

Quickly integrate Mailtrap with your Node.js app.

Currently, with this SDK you can:
- Email API/SMTP
  - Send an email (Transactional and Bulk streams)
  - Send an email with a template
  - Send a batch of emails (Transactional and Bulk streams)
- Email Sandbox (Testing)
  - Send an email
  - Send an email with a template
  - Message management
  - Inbox management
  - Project management
- Contact management
  - Contacts CRUD
  - Lists CRUD
- General
  - Templates CRUD
  - Suppressions management (find and delete)
  - Account access management
  - Permissions management
  - List accounts you have access to
 

## Installation

Use yarn or npm to install the package:

```sh
yarn add mailtrap

# or, if you are using NPM:
npm install mailtrap
```


## Usage

### Minimal

```ts
import { MailtrapClient } from "mailtrap"

/**
 * For this example to work, you need to set up a sending domain,
 * and obtain a token that is authorized to send from the domain.
 */

const TOKEN = "<YOUR-TOKEN-HERE>";
const SENDER_EMAIL = "<SENDER@YOURDOMAIN.COM>";
const RECIPIENT_EMAIL = "<RECIPIENT@EMAIL.COM>";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "Hello from Mailtrap!",
    text: "Welcome to Mailtrap Sending!",
  })
  .then(console.log)
  .catch(console.error);
```

## Nodemailer Transport

> NOTE: [Nodemailer](https://www.npmjs.com/package/nodemailer) is needed as a dependency.

```sh
yarn add nodemailer

# or, if you are using NPM:
npm install nodemailer
```

If you're using TypeScript, install `@types/nodemailer` as a `devDependency`.

```sh
yarn add --dev @types/nodemailer

# or, if you are using NPM:
npm install -D @types/nodemailer
```

You can provide Mailtrap-specific keys like `category`, `customVariables`, `templateUuid`, and `templateVariables`.

See transport usage below:

- [Transport](examples/sending/transport.ts)

## Examples

Refer to the [`examples`](examples) folder for the source code of this and other advanced examples.

### Contacts API

- [Contacts](examples/contacts/everything.ts)

### Contact Lists API

- [Contact Lists](examples/contact-lists/everything.ts)

### Sending API

- [Advanced](examples/sending/everything.ts)
- [Minimal](examples/sending/minimal.ts)
- [Send email using template](examples/sending/template.ts)
- [Suppressions management](examples/sending/suppressions.ts)
- [Nodemailer transport](examples/sending/transport.ts)

### Batch Sending API

- [Transactional emails](examples/batch/transactional.ts)
- [Bulk emails](examples/batch/bulk.ts)
- [Sandbox emails](examples/batch/sandbox.ts)
- [Emails from template](examples/batch/template.ts)

### Bulk Sending API

- [Send mail](examples/bulk/send-mail.ts)
- [Nodemailer Transport](examples/bulk/transport.ts)

### Templates API

- [Templates](examples/templates/everything.ts)

### Email Sandbox (Testing) API

- [Attachments](examples/testing/attachments.ts)
- [Inboxes](examples/testing/inboxes.ts)
- [Messages](examples/testing/messages.ts)
- [Projects](examples/testing/projects.ts)
- [Send mail using template](examples/testing/template.ts)

### General API

- [List User & Invite account accesses](examples/general/account-accesses.ts)
- [Remove account access](examples/general/accounts.ts)
- [Permissions](examples/general/permissions.ts)

## Development

This library is developed using [TypeScript](https://www.typescriptlang.org).

Use `yarn lint` to perform linting with [ESLint](https://eslint.org).

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/railsware/mailtrap-nodejs). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Mailtrap project's codebases, issue trackers, chat rooms, and mailing lists is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).

## Compatibility with previous releases

Versions of this package up to 2.0.2 were an [unofficial client](https://github.com/vchin/mailtrap-client) developed by [@vchin](https://github.com/vchin). Package version 3 is a completely new package. 
