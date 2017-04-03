# ack-pug-monitor - Change Log
All notable changes to this project will be documented here.

## [1.3.4] - 2017-04-03
### Added
- option.includeHtmls to allow compile html to js/ts

## [1.3.3] - 2017-03-23
### Fixed
- prevent watch crash from bad template rendering

## [1.3.2] - 2017-03-20
### Fixed
- cli watching

## [1.3.0] - 2017-03-17
### Added
- oneToOne option
- Typescript export support
### Breaking Change
- The value of cli argument outFileExt now must be seperated by a space instead of =

## [1.2.0] - 2017-03-02
## Breaking Changes
- updates packages that had a minor or greater version number change

## [1.1.13] - 2016-08-12
## Fixed
- when error occurs in get method of produced files, the list of templates was an array and not string-list

## [1.1.12] - 2016-08-05
## Fixed
- watcher no longer dies if pug/jade render error is encountered

## [1.1.11] - 2016-08-03
## Added
- asOneFile produces a get(templateName) method

## [1.1.9] - 2016-08-03
### Added
- filter to file watch so only pug||jade files are watched

## [1.1.5] - 2016-08-01
### Added
- asJsonFile

## [1.1.4] - 2016-07-31
### Added
- asOneFile

## [1.1.1] - 2016-07-25
### Fixed
- The watch was not output files with correct directory structure as the build process

## [1.1.0] - 2016-07-19
### Changed
- Replaced ack-node dependency with ack-path

## [1.0.1] - 2016-07-18
### Fixed
- watch deletes had bug
### Enhanced
- crawlPath instead of crawlFolders naming convention

## [1.0.0] - 2016-07-15
### Ensured sub structure is maintained

## [0.0.1] - 2016-07-15
### Created
