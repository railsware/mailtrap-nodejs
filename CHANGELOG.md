## [4.3.0] - 2025-10-02
- feat: add Permissions type to projects API for enhanced access control by @narekhovhannisyan in https://github.com/railsware/mailtrap-nodejs/pull/80
- update readme by @yanchuk in https://github.com/railsware/mailtrap-nodejs/pull/66
- build(deps): bump axios from 1.8.2 to 1.12.0 by @dependabot[bot] in https://github.com/railsware/mailtrap-nodejs/pull/86
- Dynamic user agent by @narekhovhannisyan in https://github.com/railsware/mailtrap-nodejs/pull/85

## [4.2.0] - 2025-07-08
- Add support for [Batch Sending API](https://github.com/railsware/mailtrap-nodejs/pull/63).
- Add support for [Contacts API](https://github.com/railsware/mailtrap-nodejs/pull/64).
- Add support for [Contact Lists API](https://github.com/railsware/mailtrap-nodejs/pull/65).
- Add support for [Templates API](https://github.com/railsware/mailtrap-nodejs/pull/67).
- Add support for [Suppressions API](https://github.com/railsware/mailtrap-nodejs/pull/68).
- Make `testInboxId` optional in the `MailtrapClient` configuration (https://github.com/railsware/mailtrap-nodejs/pull/70).

## [4.1.0] - 2025-04-18
- Add support for `reply_to` in Sending API (in https://github.com/railsware/mailtrap-nodejs/pull/58, thanks to @aolamide).

## [4.0.0] - 2025-02-28
- BREAKING CHANGE: Missing params for the Testing API (here) are treated as errors (throw new Error(...)), not warnings.
- BREAKING CHANGE: Removes send methods from the `BulkSendingAPI` and `TestingAPI` classes. There should be only one send method on the `MailtrapClient`.
- The `general` and `testing` APIs are created lazily, after the first access to the corresponding getters.
- Updated the MailtrapClient to accept two more params: bulk: Boolean and sandbox: Boolean. They are changing the behavior of the send method of the client in the following way:
- Security updates for dependencies

## [3.4.0] - 2024-06-10
- Add support for Bulk product API.
  - Refer to the [`examples/bulk`](examples/bulk) folder for code examples.
- Restructure examples folder.

## [3.3.0] - 2024-01-31
- Add support for Testing product API.
  - All public routes from API V2 are now available in SDK.
  - Refer to the [`examples`](examples) folder for code examples.
- Security updates.

## [3.2.0] - 2023-08-30
- Add `mailtrap-nodemailer-transporter` for sending emails using HTTP API via `nodemailer`.
- Security updates.

## [3.1.1] - 2023-04-06

- Improve error reporting for connection errors.
- Send identifiable user agent to the API.

## [3.1.0] - 2023-03-02

- Add support for Mail Templates.
- Cover main send method with basic tests.

## [3.0.1] - 2022-09-07

- Improve compatibility with the Node.js module system.

## [3.0.0] - 2022-06-14

- Initial release of the official mailtrap.io API client
- This release is a completely new library, incompatible with v2.

## [2.0.2]

- [Simple mailtrap.io client and helper library](https://github.com/vchin/mailtrap-client) by [@vchin](https://github.com/vchin).
