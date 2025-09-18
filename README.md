# GuardianEye - Security Camera Monitoring Platform 🎥

A modern, robust security camera monitoring solution that provides real-time surveillance and management. Built with the MERN stack (MongoDB, Express, React, Node.js) and TypeScript.

## ✨ Features

- 🌐 **Public Feeds**: View public camera feeds from around the world via the Windy.com API.
- 📱 **Responsive Design**: A clean and modern UI that works on all devices.

## 🚀 Getting Started

Follow these instructions to get a local copy of the project up and running for development and testing purposes.

### Prerequisites

- Node.js (v16 or higher)
- npm (v7 or higher)

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
    The frontend requires an environment variable for the backend API URL. Create a `.env` file in the root directory:
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

## 📄 License

This project is licensed under the MIT License.