# TradeTrack - The Ultimate Trading Journal & Community Hub 📈

📖 **Project Overview**

TradeTrack is a powerful, open-source trading journal designed to help you track, analyze, and optimize your trading performance. But it's more than just a journal; it's a vibrant community hub where traders can connect, share insights, and learn from each other. With AI-powered analytics and a suite of modern community features, TradeTrack is the ultimate tool for serious traders who want to level up their game.

---

🚀 **Features**

**Core Journaling Features:**
*   **Comprehensive Trade Logging:** Record every detail of your trades, including entry/exit points, position sizes, strategies, and personal notes.
*   **Advanced Analytics:** Visualize your performance with in-depth charts and metrics. Track your P/L, win rate, risk/reward ratio, and more.
*   **Customizable Dashboards:** Tailor your dashboard to see the data that matters most to you.

**Community Forum & Social Features:**
*   **Interactive Community Forum:** A dedicated space to discuss strategies, share trade ideas, and ask questions. The forum is seamlessly integrated with the journaling system, allowing you to link directly to your trade logs for context.
*   **Real-Time Notifications:** Get instant alerts for replies, mentions, and other important community activities.
*   **Reactions & Gamification:** Engage with posts using reactions, and climb the leaderboards by contributing valuable content.
*   **AI-Assisted Trade Summaries:** Automatically generate concise, AI-powered summaries of your trades to share with the community for feedback.
*   **Leaderboards:** See how you stack up against other traders in the community based on verified performance metrics.

---

🛠 **Tech Stack**

This project is built with a modern, robust, and scalable tech stack:

*   **Frontend:** React, Vite, TypeScript, Tailwind CSS
*   **Backend:** Node.js, Express, MongoDB (with Mongoose)
*   **Authentication:** Firebase, JSON Web Tokens (JWT)
*   **Real-Time Communication:** (To be implemented - e.g., Socket.IO)

---

⚙️ **Installation & Setup**

Get a local copy of TradeTrack up and running for development and testing.

### Prerequisites

*   Node.js (v16 or higher)
*   npm (v7 or higher)
*   MongoDB instance (local or cloud-based)

### Setup Instructions

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/tradetrack.git
    cd tradetrack
    ```

2.  **Configure Backend Environment Variables:**
    In the `server/` directory, create a `.env` file and add your MongoDB connection string and a JWT secret:
    ```bash
    # server/.env
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

3.  **Configure Frontend Environment Variables:**
    In the root directory, create a `.env` file to specify the backend API URL:
    ```bash
    # .env
    VITE_API_URL=http://localhost:5000/api
    ```

4.  **Install Dependencies:**
    Open two terminal windows. In the first, install the frontend dependencies. In the second, install the backend dependencies.
    ```bash
    # Terminal 1: Root directory
    npm install
    ```
    ```bash
    # Terminal 2: server/ directory
    cd server
    npm install
    ```

5.  **Run the Application:**
    Start both the frontend and backend servers concurrently from their respective terminals.
    ```bash
    # Terminal 1: Root directory (starts the frontend)
    npm run dev
    ```
    ```bash
    # Terminal 2: server/ directory (starts the backend)
    npm run dev
    ```

    *   The React frontend will be available at `http://localhost:5173`.
    *   The Node.js backend will be available at `http://localhost:5000`.

---

📸 **Screenshots**

Here's a glimpse of the TradeTrack platform.

| Dashboard Overview | Trade Analysis |
| :---: | :---: |
| <img src="public/assets/1.png" width="400"> | <img src="public/assets/2.png" width="400"> |

| Community Forum | Leaderboard |
| :---: | :---: |
| <img src="public/assets/3.png" width="400"> | <img src="public/assets/4.png" width="400"> |

| Mobile Responsive | Dark Mode |
| :---: | :---: |
| <img src="public/assets/5.png" width="400"> | <img src="public/assets/6.png" width="400"> |

---

📅 **Roadmap**

Our vision for TradeTrack is just getting started. Here's what we're planning:

*   **MVP (Current):** Core trade journaling, community forum, and basic analytics.
*   **Phase 2:** Advanced charting, real-time notifications (WebSockets), and more gamification elements.
*   **Phase 3:** Brokerage integration for automated trade importing.
*   **Phase 4:** Mobile app (React Native).

---

🤝 **Contributing**

Contributions are welcome! If you have ideas for new features or improvements, please open an issue to discuss it first. Pull requests are greatly appreciated.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

---

📜 **License**

This project is licensed under the MIT License. See the `LICENSE` file for details.
