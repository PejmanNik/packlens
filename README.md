# PackLens

![logo](https://github.com/PejmanNik/packlens/blob/main/media/icon.png?raw=true)

PackLens is a web application and Visual Studio Code extension designed for decoding and searching within MessagePack binary files. It provides an intuitive interface for exploring and analyzing data efficiently.

## Features

- 📃 **MessagePack Decoding**: Automatically decode and visualize MessagePack (.msgpack) files with ease.
- 🔍 **Advanced Search**: Perform custom searches and map data using JavaScript code.
- 🔄 **Streaming Support**: Efficiently stream and process large MessagePack files without performance bottlenecks.
- 🎯 **Custom Editor**: Seamlessly integrates with VS Code's editor system for a native experience.

## Installation

### From VS Code Marketplace

1. Open Visual Studio Code.
2. Navigate to the Extensions view (`Ctrl+Shift+X`).
3. Search for [PackLens](https://marketplace.visualstudio.com/items?itemName=pejmannikram.packlens).
4. Click **Install**.

### Web Application

1. Visit [PackLens Web](https://packlens.pejmannik.dev) to use the web interface.

## Usage

### Visual Studio Code Extension

1. Open any `.msgpack` file in VS Code.
2. The file will automatically open in the PackLens viewer.
3. Explore the decoded MessagePack data using the interactive interface.

![demo-vsc](https://github.com/PejmanNik/packlens/blob/main/media/vsc-demo.gif?raw=true)

### Web Application

1. Upload your `.msgpack` file to the web interface.
2. Use the search and visualization tools to analyze your data.

![demo-web](https://github.com/PejmanNik/packlens/blob/main/media/web-demo.gif?raw=true)

## Development

This project uses a monorepo structure with three main packages:

### Project Structure

```
packages/
├── common/          # Shared types and utilities for decoding and processing files
├── vsc/             # Visual Studio Code extension
└── web/             # React-based web interface
```

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Changelog

See [CHANGELOG.md](CHANGELOG.md) for release notes and version history.
