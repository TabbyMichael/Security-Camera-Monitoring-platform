# GuardianEye - Security Camera Monitoring Platform 🎥

A modern, robust security camera monitoring solution that provides real-time surveillance and management. Built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## ✨ Features

- 🔐 **Secure Authentication**: JWT-based user registration and login.
- 📷 **User-Managed Cameras**: Add and view your own private camera streams.
- 🌐 **Public Feeds**: View public camera feeds from around the world via the Windy.com API.
- 🎞️ **Recording Management**: A functional UI to view the history of recordings.
- ⚠️ **Alerts System**: A functional UI to view and resolve alerts.
- 🧪 **Comprehensive Testing**: Includes unit, integration, and end-to-end tests.
- 📱 **Responsive Design**: A clean and modern UI that works on all devices.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)
- MongoDB

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/security-camera-platform.git
    cd security-camera-platform
    ```

2.  **Install Frontend Dependencies:**
    ```bash
    npm install
    ```

3.  **Install Backend Dependencies:**
    ```bash
    npm install --prefix server
    ```

4.  **Configure Environment Variables:**
    The backend requires a `.env` file for configuration. Create a file named `.env` inside the `server/` directory.

    ```bash
    # server/.env
    PORT=5000
    MONGODB_URI=mongodb://localhost:27017/guardianeye-db
    JWT_SECRET=your_super_secret_jwt_key_here
    WINDY_API_KEY=your_windy_api_key_here
    ```
    *   `MONGODB_URI`: Your MongoDB connection string.
    *   `JWT_SECRET`: A long, random string used to sign authentication tokens.
    *   `WINDY_API_KEY`: An API key from [Windy.com Webcams API](https://api.windy.com/webcams) if you wish to use the public feeds feature.

    The frontend also requires an environment variable for the backend API URL. Create a `.env` file in the root directory:
    ```bash
    # .env
    VITE_API_URL=http://localhost:5000/api
    ```
    For production, set the `VITE_API_URL` environment variable in your deployment platform's settings.


### Running the Application

This project uses `npm-run-all` to start both the frontend and backend servers concurrently with a single command.

```bash
# From the root directory
npm run dev
```

-   The React frontend will be available at `http://localhost:5173`.
-   The Node.js backend will be available at `http://localhost:5000`.

## 🛠️ Running Tests

The project has a comprehensive test suite.

-   **Run Frontend Unit & Component Tests:**
    ```bash
    npm test
    ```

-   **Run Backend Integration Tests:**
    ```bash
    npm test --prefix server
    ```

-   **Run End-to-End Tests:**
    ```bash
    npx playwright test
    ```

## 📄 License

This project is licensed under the MIT License.