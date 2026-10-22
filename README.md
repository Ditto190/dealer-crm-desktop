# Dealerflow Desk

An original, local-first dealer and account management CRM desktop starter for Windows, built with React, TypeScript, Vite, and Tauri v2.

> **Starter status:** This scaffold has not yet been built or validated in a Windows workspace. Treat it as a starting point, not a production-ready or security-reviewed CRM.

## What is included

- A dealer-network dashboard with account totals, pipeline indicators, task checklist, and recent activity.
- Dealer search, status filtering, account profiles, and a create-dealer form. These interactions use sample data in React memory and reset when the app reloads.
- An offline reference library containing original quick-start notes about this starter.
- A minimal Tauri v2 Rust shell configured to package a Windows NSIS installer.

There is no backend, authentication, database, sync, or durable local storage. All included dealer names and contact details are fictional. Do not put real customer information into this demo.

## Windows prerequisites

1. Install Node.js LTS and npm.
2. Install Rust with the stable MSVC toolchain. From PowerShell, `rustup default stable-msvc` selects it after installing Rust via [rustup](https://rustup.rs/).
3. Install [Visual Studio Build Tools](https://visualstudio.microsoft.com/visual-cpp-build-tools/) with the **Desktop development with C++** workload (MSVC and the Windows SDK).
4. Ensure the Microsoft Edge WebView2 Runtime is installed. It is included with supported current Windows versions; [download the runtime](https://developer.microsoft.com/microsoft-edge/webview2/) if needed.

## Run in development

From the repository root in PowerShell:

```powershell
npm install
npm run tauri dev
```

The first Rust build can take several minutes. To run only the web interface in a browser, use `npm run dev`.

## Build the Windows installer

```powershell
npm run tauri build
```

The Tauri bundle is written under `src-tauri/target/release/bundle/`. Validate the installer on a clean Windows machine before sharing it.

## Reference library and DevDocs

The in-app Reference library is an offline panel with a few original notes shipped with this app. It is DevDocs-inspired in purpose, but **it is not the DevDocs app and does not bundle the DevDocs documentation database**. The link to [DevDocs](https://devdocs.io/) opens the website and therefore requires internet access. To add a full offline docs corpus, select documentation sets and verify their licenses, size, update process, and attribution requirements first.

## Inspiration

This is a fresh project, not a clone of another repository. The Microsoft [Amplifier](https://github.com/microsoft/amplifier), [Amplifier App CLI](https://github.com/microsoft/amplifier-app-cli), and [Amplifier Unified](https://github.com/microsoft/amplifier-unified/tree/main) repositories may be useful references for future architecture decisions; no code or documentation is copied from them here.

## License

No license has been selected yet. Add a license before accepting outside contributions or redistributing the project.
