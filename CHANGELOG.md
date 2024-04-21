# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.5] - 2024-04-21

### Added

- This changelog!

## [0.2.4] - 2024-04-13

### Fixed

- Inadvertently merged package-lock.json conflicts in a previous version. This one fixes it.

## [0.2.3] - 2024-04-13

### Added

- `package.json` search keywords.

## [0.2.2] - 2024-04-08

### Added

- `package.json` repository URL.

## [0.2.1] - 2024-04-07

### Changed

- Split the `README.md` file into `README.md` and `CONTIBUTING.md`.

## [0.2.0] - 2024-02-25

### Added

- CJS compatible build output with package exports.

## [0.1.9] - 2023-12-11

### Fixed

- Fixed a CI issue. This might have not needed a release.

## [0.1.8] - 2023-12-09

### Fixed

- Fixed a CI issue. This might have not needed a release.

## [0.1.8] - 2023-12-09

### Fixed

- Testing package release flow on CI.

## [0.1.7] - 2023-12-09

### Fixed

- Testing package release flow on CI.

## [0.1.6] - 2023-12-09

### Fixed

- Testing package release flow on CI.

## [0.1.5] - 2023-12-09

### Fixed

- Testing package release flow on CI.

## [0.1.4] - 2023-12-09

### Fixed

- Testing package release flow on CI.

## [0.1.3] - 2023-12-09

### Changed

- Repo project on Node.js 20. Keep supporting Node.js 18 in CI.
- Use @infra-blocks/test.

## [0.1.2] - 2023-07-10

### Added

- Include source maps in the package.

### Fixed

- Don't use `require` syntax while importing `VError`.

## [0.1.1] - 2023-06-28

### Fixed

- `npm run clean` script and `.gitignore` to use the correct artifacts pattern.

## [0.1.0] - 2023-06-27

### Added

- First iteration of the library. Exported utility functions include:
  - `checkNotNull`
  - `checkNotType`
  - `checkArrayOfType`

[0.2.5]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.2.4...v0.2.5
[0.2.4]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.2.3...v0.2.4
[0.2.3]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.2.2...v0.2.3
[0.2.2]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.2.1...v0.2.2
[0.2.1]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.2.0...v0.2.1
[0.2.0]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.9...v0.2.0
[0.1.9]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.8...v0.1.9
[0.1.8]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.7...v0.1.8
[0.1.7]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.6...v0.1.7
[0.1.6]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.5...v0.1.6
[0.1.5]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.4...v0.1.5
[0.1.4]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.3...v0.1.4
[0.1.3]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.2...v0.1.3
[0.1.2]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.1...v0.1.2
[0.1.1]: https://github.com/infrastructure-blocks/ts-checks/compare/v0.1.0...v0.1.1
[0.1.0]: https://github.com/infrastructure-blocks/ts-checks/releases/tag/v0.1.0
