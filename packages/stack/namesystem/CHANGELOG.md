# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [5.3.0-nightly.12](https://github.com/embarklabs/embark/compare/v5.3.0-nightly.11...v5.3.0-nightly.12) (2020-03-21)

**Note:** Version bump only for package embark-namesystem





# [5.3.0-nightly.6](https://github.com/embarklabs/embark/compare/v5.3.0-nightly.5...v5.3.0-nightly.6) (2020-03-07)

**Note:** Version bump only for package embark-namesystem





# [5.3.0-nightly.5](https://github.com/embarklabs/embark/compare/v5.3.0-nightly.4...v5.3.0-nightly.5) (2020-03-06)

**Note:** Version bump only for package embark-namesystem





# [5.3.0-nightly.4](https://github.com/embarklabs/embark/compare/v5.3.0-nightly.3...v5.3.0-nightly.4) (2020-03-05)

**Note:** Version bump only for package embark-namesystem





# [5.3.0-nightly.2](https://github.com/embarklabs/embark/compare/v5.3.0-nightly.1...v5.3.0-nightly.2) (2020-03-03)

**Note:** Version bump only for package embark-namesystem





# [5.3.0-nightly.0](https://github.com/embarklabs/embark/compare/v5.2.4-nightly.0...v5.3.0-nightly.0) (2020-02-27)

**Note:** Version bump only for package embark-namesystem





## [5.2.3](https://github.com/embarklabs/embark/compare/v5.2.3-nightly.1...v5.2.3) (2020-02-25)


### Bug Fixes

* ensure that packages properly specify their dependencies ([3693ebd](https://github.com/embarklabs/embark/commit/3693ebd))





## [5.1.1](https://github.com/embarklabs/embark/compare/v5.1.1-nightly.4...v5.1.1) (2020-02-03)

**Note:** Version bump only for package embark-namesystem





## [5.1.1-nightly.2](https://github.com/embarklabs/embark/compare/v5.1.1-nightly.1...v5.1.1-nightly.2) (2020-01-31)

**Note:** Version bump only for package embark-namesystem





## [5.1.1-nightly.0](https://github.com/embarklabs/embark/compare/v5.1.0...v5.1.1-nightly.0) (2020-01-29)

**Note:** Version bump only for package embark-namesystem





# [5.1.0](https://github.com/embarklabs/embark/compare/v5.1.0-nightly.6...v5.1.0) (2020-01-27)

**Note:** Version bump only for package embark-namesystem





# [5.1.0-nightly.1](https://github.com/embarklabs/embark/compare/v5.1.0-nightly.0...v5.1.0-nightly.1) (2020-01-20)


### Features

* support Node.js v12.x and newer ([c093cf8](https://github.com/embarklabs/embark/commit/c093cf8))





# [5.1.0-nightly.0](https://github.com/embarklabs/embark/compare/v5.0.0...v5.1.0-nightly.0) (2020-01-17)

**Note:** Version bump only for package embark-namesystem





# [5.0.0](https://github.com/embarklabs/embark/compare/v5.0.0-beta.0...v5.0.0) (2020-01-07)

**Note:** Version bump only for package embark-namesystem





# [5.0.0-alpha.5](https://github.com/embarklabs/embark/compare/v5.0.0-alpha.4...v5.0.0-alpha.5) (2019-12-16)

**Note:** Version bump only for package embark-namesystem





# [5.0.0-alpha.2](https://github.com/embarklabs/embark/compare/v5.0.0-alpha.1...v5.0.0-alpha.2) (2019-12-05)


### Features

* **@embark/ens:** enable changing namesystem config per test ([de9e667](https://github.com/embarklabs/embark/commit/de9e667))
* **@embark/tests:** enable comms and storage in tests ([aecb99d](https://github.com/embarklabs/embark/commit/aecb99d))





# [5.0.0-alpha.1](https://github.com/embarklabs/embark/compare/v5.0.0-alpha.0...v5.0.0-alpha.1) (2019-11-05)

**Note:** Version bump only for package embark-namesystem





# [5.0.0-alpha.0](https://github.com/embarklabs/embark/compare/v4.1.1...v5.0.0-alpha.0) (2019-10-28)


### Bug Fixes

* do not start modules if they are disabled ([d6bf5c2](https://github.com/embarklabs/embark/commit/d6bf5c2))
* fix test-app, contracts index file and reload on change ([#1892](https://github.com/embarklabs/embark/issues/1892)) ([ee634c8](https://github.com/embarklabs/embark/commit/ee634c8))


### Build System

* bump all packages' engines settings ([#1985](https://github.com/embarklabs/embark/issues/1985)) ([ed02cc8](https://github.com/embarklabs/embark/commit/ed02cc8))


### BREAKING CHANGES

* node: >=10.17.0 <12.0.0
npm: >=6.11.3
yarn: >=1.19.1

node v10.17.0 is the latest in the 10.x series and is still in the Active LTS
lifecycle. Embark is still not compatible with node's 12.x and 13.x
series (because of some dependencies), otherwise it would probably make sense
to bump our minimum supported node version all the way to the most recent 12.x
release.

npm v6.11.3 is the version that's bundled with node v10.17.0.

yarn v1.19.1 is the most recent version as of the time node v10.17.0 was
released.