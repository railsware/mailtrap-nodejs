![TypeScript](https://badgen.net/badge/icon/TypeScript/?icon=typescript&label) [![test](https://github.com/railsware/mailtrap-nodejs/actions/workflows/test.yml/badge.svg)](https://github.com/railsware/mailtrap-nodejs/actions/workflows/test.yml)

# Official Mailtrap Node.js client

This NPM package offers integration with the [official API](https://api-docs.mailtrap.io/) for [Mailtrap](https://mailtrap.io).

Quickly add email sending functionality to your Node.js application with Mailtrap.

## Compatibility with previous releases

Versions of this package up to 2.0.2 were an [unofficial client](https://github.com/vchin/mailtrap-client) developed by [@vchin](https://github.com/vchin). Package version 3 is a completely new package. It is still under development and does not support the testing API yet. Please continue using version 2 if you need access to the testing API.

## Installation

Use yarn or npm to install the package:

```sh
yarn add mailtrap

# or, if you are using NPM:
npm install mailtrap
```

## Usage

Refer to the [`examples`](examples) folder for the source code of these examples.

### Minimal

```js
const { MailtrapClient } = require("mailtrap");

// For this example to work, you need to set up a sending domain,
// and obtain a token that is authorized to send from the domain
const TOKEN = "your-api-token";
const SENDER_EMAIL = "sender@yourdomain.com";
const RECIPIENT_EMAIL = "recipient@email.com";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "Hello from Mailtrap!",
    text: "Welcome to Mailtrap Sending!",
  })
  .then(console.log, console.error);
```

### Full

```js
const fs = require("fs");
const path = require("path");
const { MailtrapClient } = require("mailtrap");

// For this example to work, you need to set up a sending domain,
// and obtain a token that is authorized to send from the domain
const TOKEN = "your-api-token";
const SENDER_EMAIL = "sender@yourdomain.com";
const RECIPIENT_EMAIL = "recipient@email.com";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

const welcomeImage = fs.readFileSync(path.join(__dirname, "welcome.png"));

client
  .send({
    category: "test",
    custom_variables: {
      hello: "world",
      year: 2022,
      anticipated: true,
    },
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    subject: "Hello from Mailtrap!",
    html: `
    <!doctype html>
    <html>
      <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
      </head>
      <body style="font-family: sans-serif;">
        <div style="display: block; margin: auto; max-width: 600px;" class="main">
          <h1 style="font-size: 18px; font-weight: bold; margin-top: 20px">Congrats for sending test email with Mailtrap!</h1>
          <p>Inspect it using the tabs you see above and learn how this email can be improved.</p>
          <img alt="Inspect with Tabs" src="cid:welcome.png" style="width: 100%;">
          <p>Now send your email using our fake SMTP server and integration of your choice!</p>
          <p>Good luck! Hope it works.</p>
        </div>
        <!-- Example of invalid for email html/css, will be detected by Mailtrap: -->
        <style>
          .main { background-color: white; }
          a:hover { border-left-width: 1em; min-height: 2em; }
        </style>
      </body>
    </html>
  `,
    attachments: [
      {
        filename: "welcome.png",
        content_id: "welcome.png",
        disposition: "inline",
        content: welcomeImage,
      },
    ],
  })
  .then(console.log, console.error);
```

### Mail from template

```js
const { MailtrapClient } = require("mailtrap");

// For this example to work, you need to set up a sending domain,
// and obtain a token that is authorized to send from the domain
const TOKEN = "your-api-token";
const SENDER_EMAIL = "sender@yourdomain.com";
const RECIPIENT_EMAIL = "recipient@email.com";

const client = new MailtrapClient({ token: TOKEN });

const sender = { name: "Mailtrap Test", email: SENDER_EMAIL };

client
  .send({
    from: sender,
    to: [{ email: RECIPIENT_EMAIL }],
    template_uuid: "813e39db-c74a-4830-b037-0e6ba8b1fe88",
    template_variables: {
      user_name: "John Doe",
    },
  })
  .then(console.log, console.error);
```

## Development

This library is developed using [TypeScript](https://www.typescriptlang.org).

Use `yarn lint` to perform linting with [ESLint](https://eslint.org).

## Contributing

Bug reports and pull requests are welcome on [GitHub](https://github.com/railsware/mailtrap-nodejs). This project is intended to be a safe, welcoming space for collaboration, and contributors are expected to adhere to the [code of conduct](CODE_OF_CONDUCT.md).

## License

The package is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).

## Code of Conduct

Everyone interacting in the Mailtrap project's codebases, issue trackers, chat rooms and mailing lists is expected to follow the [code of conduct](CODE_OF_CONDUCT.md).
