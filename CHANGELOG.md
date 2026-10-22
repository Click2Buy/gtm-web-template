# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

## [1.1.0] - 2026-10-22

### Added
* New "Tag type" parameter: "Page view" loads the Click2Buy script on every page (first-party attribution with the `c2bm` parameter), "Conversion" sends the order data. Defaults to "Conversion", so existing tags keep working.
* Installation guides: two tags setup (page view and conversion), consent settings (`analytics_storage`) and new tests.

### Fixed
* The tag no longer overwrites `window.C2B`: order data is pushed with `createQueue('C2B.q')`, so the validation is sent when the Click2Buy script is already loaded.

### Changed
* The `access_globals` permission is restricted to `C2B.q` (read, write) and `C2B` (read, write: `setInWindow` creates it when the script is not loaded yet, never overwriting it). Execute is no longer granted.

## [1.0.0] - 2026-02-13

### Added
* Initial version of the Click2Buy web tag template.
* Loads the Click2Buy script on purchase events and sends transaction data to Click2Buy for conversion tracking.