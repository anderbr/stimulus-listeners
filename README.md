# Stimulus Listeners 🎧

Welcome to the **Stimulus Listeners** repository! This project provides a zero-build Stimulus plugin that allows you to declaratively or imperatively wire up DOM event listeners. With this tool, you can enhance your web applications efficiently and effectively.

![GitHub release](https://img.shields.io/github/release/anderbr/stimulus-listeners.svg) ![License](https://img.shields.io/github/license/anderbr/stimulus-listeners.svg)

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Contributing](#contributing)
- [License](#license)
- [Releases](#releases)
- [Contact](#contact)

## Introduction

**Stimulus Listeners** is designed for developers who want a simple way to manage event listeners in their Stimulus controllers. By leveraging this plugin, you can easily attach and detach event listeners based on your application's needs.

## Features

- **Declarative and Imperative Wiring**: Use HTML attributes or JavaScript code to set up event listeners.
- **Mixins**: Create reusable event listener configurations.
- **Compatibility**: Works seamlessly with Stimulus and Symfony UX.
- **Lightweight**: No build step required; just include the plugin in your project.

## Installation

To get started, you can install the plugin via npm or yarn. Run one of the following commands in your terminal:

```bash
npm install stimulus-listeners
```

or 

```bash
yarn add stimulus-listeners
```

You can also download the latest release from [Releases](https://github.com/anderbr/stimulus-listeners/releases). Make sure to execute the necessary files after downloading.

## Usage

To use **Stimulus Listeners**, you need to import it into your Stimulus controller. Here’s a simple example:

```javascript
import { Controller } from "stimulus";
import StimulusListeners from "stimulus-listeners";

export default class extends Controller {
  static mixins = [StimulusListeners];

  connect() {
    this.addEventListener("click", this.handleClick);
  }

  handleClick(event) {
    console.log("Element clicked!", event);
  }
}
```

### Declarative Usage

You can also declare event listeners directly in your HTML:

```html
<div data-controller="example" data-example-listeners='{"click": "handleClick"}'>
  Click me!
</div>
```

## Examples

### Basic Example

Here’s a simple example of how to set up a click listener:

```html
<div data-controller="example" data-example-listeners='{"click": "handleClick"}'>
  Click me!
</div>
```

```javascript
import { Controller } from "stimulus";
import StimulusListeners from "stimulus-listeners";

export default class extends Controller {
  static mixins = [StimulusListeners];

  handleClick(event) {
    alert("You clicked the element!");
  }
}
```

### Multiple Listeners

You can add multiple event listeners as well:

```html
<div data-controller="example" data-example-listeners='{"click": "handleClick", "mouseover": "handleMouseOver"}'>
  Hover or click me!
</div>
```

```javascript
import { Controller } from "stimulus";
import StimulusListeners from "stimulus-listeners";

export default class extends Controller {
  static mixins = [StimulusListeners];

  handleClick(event) {
    console.log("Clicked!");
  }

  handleMouseOver(event) {
    console.log("Mouse over!");
  }
}
```

## Contributing

We welcome contributions! If you want to help improve **Stimulus Listeners**, please follow these steps:

1. Fork the repository.
2. Create a new branch for your feature or bug fix.
3. Make your changes and commit them.
4. Push to your branch.
5. Open a pull request.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Releases

For the latest releases, please visit the [Releases](https://github.com/anderbr/stimulus-listeners/releases) section. Make sure to download the necessary files and execute them to get started.

## Contact

For questions or suggestions, feel free to reach out:

- GitHub: [anderbr](https://github.com/anderbr)
- Email: your-email@example.com

---

Thank you for checking out **Stimulus Listeners**! We hope you find it useful for your web development projects.