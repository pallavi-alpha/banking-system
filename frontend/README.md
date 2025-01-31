# Banking System

This repository contains a banking system project built with a combination of TypeScript, JavaScript, CSS, and HTML. The frontend is developed using React, TypeScript, and Vite to provide a minimal setup with hot module replacement (HMR) and some ESLint rules.

## Table of Contents

- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [UI Components](#ui-components)
- [Contributing](#contributing)
- [License](#license)

## Features

- Minimal setup for React with Vite
- Hot Module Replacement (HMR) for fast development
- ESLint integration with custom configurations
- TypeScript support

## Installation

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/pallavi-alpha/banking-system.git
   ```

2. Navigate to the project directory:

   ```bash
   cd banking-system
   cd frontend
   ```

3. Install the dependencies:

   ```bash
   npm install
   ```

## Usage

To start the development server with Vite:

```bash
npm run dev
```

This command will start the server and enable hot module replacement for a smooth development experience.

## UI Components

### MainMenu

- **File:** `src/components/MainMenu/index.tsx`
- **Description:** Provides the main menu interface for user interaction, allowing users to select actions such as inputting transactions, defining interest rules, printing statements, or quitting.

### TransactionInput

- **File:** `src/components/TransactionInput/index.tsx`
- **Description:** Component for inputting new transactions. Users can enter transaction details such as date, account, type, and amount.

### InterestRules

- **File:** `src/components/InterestRules/index.tsx`
- **Description:** Manages the input and display of interest rules for accounts.

### PrintStatement

- **File:** `src/components/AccountStatement/index.tsx`
- **Description:** Allows users to print account statements based on the entered transactions and interest rules.

### Quit

- **File:** `src/components/Quit/index.tsx`
- **Description:** Provides an interface for quitting the application.

## Contributing

We welcome contributions! Please read our [Contributing Guidelines](CONTRIBUTING.md) for more information.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

---

Feel free to adjust the content as needed and add any additional information specific to your project.
