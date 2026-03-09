# PriceWise LK 🛒📍

**A Crowdsourced Hyperlocal Price Comparison Web Application**

PriceWise LK is a MERN stack web application designed to empower Sri Lankan consumers to combat daily price fluctuations. It utilizes crowdsourced data, gamification, and geospatial algorithms to help users find the best grocery prices within their immediate local radius.

---

## 🚀 Tech Stack

- **Frontend:** React.js, Context API, HTML5 Geolocation API
- **Backend:** Node.js, Express.js
- **Database:** MongoDB Atlas (utilizing GeoJSON indexing)
- **Authentication:** JSON Web Tokens (JWT) & bcrypt.js
- **Storage:** Cloudinary (via Multer middleware for proof-of-price image uploads)

---

## ⚙️ Core Features

1.  **Hyperlocal Radius Search:** Uses the Haversine formula to filter shop prices based on the user's live GPS coordinates (e.g., within a 5km radius).
2.  **Crowdsourced Price Engine:** Consumers can upload real-time prices with photographic proof.
3.  **Gamification System:** Users earn XP points for every verified price submission, encouraging community participation.
4.  **Role-Based Access Control (RBAC):**
    - **Consumers:** Search prices, submit updates, earn XP.
    - **Shop Owners:** Manage digital storefronts, update their own inventory.
    - **Administrators:** Review and approve/reject community-submitted prices via a dedicated moderation queue.

---

## 🛠️ Local Setup & Installation

**Note to Examiner:** The `node_modules` folders have been excluded from this submission to reduce file size. Please follow the steps below to initialize the application.

### Prerequisites

- Node.js installed on your machine.
- A MongoDB connection string (Local or Atlas).

### 1. Backend Setup

Navigate to the backend directory and install the dependencies:

```bash
# cd backend
# npm install



# 👨‍💻 Author
# Mohamed Rimas Final Year Software Engineering Development Project

# Module: CSE6035

# Cardiff Metropolitan University / ICBT
```
