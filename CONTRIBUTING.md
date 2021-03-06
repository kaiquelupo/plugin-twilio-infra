# Contributing to plugin-twilio-infra

## About the Project

This plugin is a wrapper around other existing tools. When planning to submit a
fix please consider submitting the fix to the respective project. When in doubt,
create an issue and we are happy to point you into the right direction.

- [`twilio-pulumi-provider`](https://github.com/twilio-infra-as-code/twilio-pulumi-provider) - Dynamic Provider to describe Twilio Infrastrucure using Pulumi
- [`pulumi-sdk`](https://github.com/pulumi/pulumi) - Pulumi's Infrastructure as Code SDK project.


## Setup

1. Clone project and install dependencies\_

```bash
git clone https://github.com/twilio-infra-as-code/plugin-twilio-infra
cd plugin-twilio-infra
npm install
```

2. [Install the Twilio CLI](https://github.com/twilio/twilio-cli)
3. Locally link your plugin

```bash
twilio plugins:link <path_to_your_project>
```

## Contributing

1. Perform changes
2. Test changes manually using `twilio infra`
3. Make sure tests pass by running `npm test`
4. Submit a PR

**Working on your first Pull Request?** You can learn how from this _free_ series [How to Contribute to an Open Source Project on GitHub](https://egghead.io/series/how-to-contribute-to-an-open-source-project-on-github)

## Releasing

```bash
npm version <major|minor|patch>
git push origin master --follow-tags
npm publish
```

## Code of Conduct

Please be aware that this project has a [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md). The tldr; is to just be excellent to each other ❤️

## Licensing

All third party contributors acknowledge that any contributions they provide will be made under the same open source license that the open source project is provided under.
