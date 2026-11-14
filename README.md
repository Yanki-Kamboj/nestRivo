# nestRivo 🏡

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Node.js Version](https://img.shields.io/badge/Node.js-v20%2B-green.svg)](https://nodejs.org/)
[![Express.js](https://img.shields.io/badge/Express.js-5.x-black.svg)](https://expressjs.com/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4.x-38B2AC.svg)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/Database-MongoDB-47A248.svg)](https://www.mongodb.com/)

**nestRivo** is a full-featured, responsive vacation rental and home-stay booking web application. Inspired by platforms like Airbnb, nestRivo enables property hosts to list, manage, and showcase their accommodations, while guests can browse homes, view comprehensive property details, bookmark favorites, and reserve stays.

---

## 🌟 Key Features

- **🏠 Explore & Search Homes**: Browse curated property listings with high-resolution photos, pricing, location, and guest ratings.
- **🔍 Detailed Property Pages**: Inspect individual home details, amenities, pricing per night, and host information.
- **❤️ Favorites & Wishlists**: Save and manage preferred stays for future trips.
- **📅 Booking & Reservations**: Seamless booking workflow for guests reserving properties.
- **🛎️ Host Dashboard**:
  - Add new listings with title, price, location, rating, and image uploads.
  - Edit or update existing property listings.
  - Delete listings with automated database synchronization.
- **📸 Image Uploads**: Secure multipart file handling using `multer` with local static serving.
- **🎨 Modern Tailwind CSS UI**: Clean, responsive layout crafted with modern utility classes and Tailwind CSS v4.
- **🔒 Secure Configuration**: Environment variable management using `dotenv` to protect database credentials and sensitive keys.

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Runtime** | [Node.js](https://nodejs.org/) (v20+) |
| **Backend Framework** | [Express.js](https://expressjs.com/) (v5) |
| **Database** | [MongoDB](https://www.mongodb.com/) (Native MongoDB Driver & Mongoose) |
| **Templating Engine** | [EJS](https://ejs.co/) (Embedded JavaScript) |
| **Styling** | [Tailwind CSS v4](https://tailwindcss.com/) |
| **File Handling** | [Multer](https://github.com/expressjs/multer) |
| **Process Management** | [Nodemon](https://nodemon.io/) & [Concurrently](https://github.com/open-cli-tools/concurrently) |

---

## 📂 Project Structure

```text
nestRivo/
├── controllers/            # Request handlers & application logic
│   ├── error.js            # 404 & error controllers
│   ├── hostController.js   # Host operations (add, edit, delete, upload)
│   └── storeController.js  # Store & guest operations (home listing, booking)
├── models/                 # Database models & data access layer
│   ├── favourites.js       # Favorites model
│   └── home.js             # Property listing model
├── public/                 # Static assets (compiled CSS, client assets)
│   └── output.css          # Tailwind compiled stylesheet
├── routes/                 # Express route definitions
│   ├── hostRouter.js       # Host routes (/host/*)
│   └── storeRouter.js      # Guest store routes (/, /home-list, /favourites)
├── src/                    # Source CSS & styling inputs
│   └── input.css           # Tailwind directives
├── uploads/                # Property uploaded images (git-ignored)
├── utils/                  # Helper utilities & database connection
│   ├── databaseUtils.js    # MongoDB connection pool & client getter
│   └── pathUtils.js        # Root directory path helper
├── views/                  # EJS template views
│   ├── host/               # Host view templates (add-home, editHome, hostHomeList)
│   ├── partials/           # Reusable EJS partials (navigation, cards)
│   ├── store/              # Guest view templates (index, homeList, booking, etc.)
│   └── notFound.ejs        # 404 error page
├── .env.example            # Environment variable template
├── .gitignore              # Files and folders excluded from Git
├── app.js                  # Main server entry point
├── nodemon.json            # Nodemon configuration
└── package.json            # Project manifest & scripts
```

---

## 🚀 Getting Started

### Prerequisites

Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/) (version 18 or higher recommended)
- [npm](https://www.npmjs.com/) (bundled with Node.js)
- A running [MongoDB](https://www.mongodb.com/) instance or a [MongoDB Atlas](https://www.mongodb.com/atlas) cluster connection string.

### 1. Clone the Repository

```bash
git clone https://github.com/Yanki-Kamboj/nestRivo.git
cd nestRivo
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the project root by copying the provided `.env.example`:

```bash
cp .env.example .env
```

Open `.env` and configure your credentials:

```env
PORT=3001
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net
DB_NAME=nestrivo
```

### 4. Run the Application

#### Development Mode (Server + Tailwind CSS Watcher)
```bash
npm start
```
This runs `nodemon app.js` concurrently with the Tailwind CSS builder.

#### Server Only
```bash
npm run dev
```

#### Build Production CSS
```bash
npm run build:css
```

Open your browser and navigate to:
```text
http://localhost:3001
```

---

## 🛣️ Application Endpoints

### Store / Guest Routes
| Method | Route | Description |
|---|---|---|
| `GET` | `/` | Landing page featuring all listed homes |
| `GET` | `/home-list` | Browse catalog of available stays |
| `GET` | `/homes/:homeId` | View detailed information for a specific home |
| `GET` | `/booking` | View active bookings |
| `POST` | `/booking` | Book a property |
| `GET` | `/favourites` | View saved favorite homes |
| `POST` | `/favourites` | Add a property to favorites |
| `POST` | `/favourites/delete/:homeId` | Remove a property from favorites |

### Host Routes
| Method | Route | Description |
|---|---|---|
| `GET` | `/host/add-home` | Render home submission form |
| `POST` | `/host/register` | Submit and save a new home (with photo upload) |
| `GET` | `/host/home-list` | View listings created by host |
| `GET` | `/host/edit-home/:homeId` | Render listing edit form |
| `POST` | `/host/edit-home/:homeId` | Update home details and/or photo |
| `POST` | `/host/delete-home/:homeId` | Delete a home from listings |

---

## 📄 License

This project is open-source and licensed under the [MIT License](LICENSE).

---

## 👨‍💻 Author

**Yanki Kamboj**
- GitHub: [@Yanki-Kamboj](https://github.com/Yanki-Kamboj)
