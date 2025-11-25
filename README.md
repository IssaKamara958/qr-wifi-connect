# Chackor Qr Code Wifi

![Chackor Organisation Logo](/public/logo.png)

This is a React application from Chackor Organisation that allows users to connect to a WiFi network by scanning a QR code.

## Live Application

You can access the live application here: [https://qr-wifi-connect-91748750-9ece3.web.app/](https://qr-wifi-connect-91748750-9ece3.web.app/)

## Project Description

This application simplifies the process of connecting to a WiFi network. Instead of manually entering the network name (SSID) and password, users can simply scan a QR code that contains the WiFi credentials. The application will then automatically attempt to connect to the network.

## Key Features:

*   **QR Code Scanning:**  Uses the device's camera to scan for WiFi QR codes.
*   **Automatic Connection:**  Parses the QR code and attempts to connect to the WiFi network.
*   **User-Friendly Interface:**  Simple and intuitive interface for a seamless user experience.

## Getting Started

### Prerequisites

*   Node.js and npm installed
*   Android Studio or Xcode for mobile development

### Installation and Setup

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/IssaKamara958/qr-wifi-connect.git
    ```
2.  **Navigate to the project directory:**
    ```bash
    cd qr-wifi-connect
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Build the project:**
    ```bash
    npm run build
    ```
5.  **Sync with mobile platforms:**
    ```bash
    npx cap sync
    ```

### Running the Application

*   **Web Browser:**
    ```bash
    npm run dev
    ```
*   **Android:**
    1.  Open the `android` directory in Android Studio.
    2.  Run the application on an emulator or a physical device.
*   **iOS:**
    1.  Open the `ios` directory in Xcode.
    2.  Run the application on an emulator or a physical device.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue if you have any suggestions or find any bugs.

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.
