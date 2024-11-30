# PakZone Backend

PakZone is a backend application for an e-commerce web app designed for Business-to-Consumer (B2C) interactions. Built with **Node.js** and **Express**, this API serves as the backbone for managing products, orders, users, and other essential e-commerce functionalities.

---

## Features

- **User Authentication**: Secure login and registration with JWT-based authentication.
- **Product Management**: Add, update, delete, and view products.
- **Order Management**: Handle customer orders, payments, and order history.
- **Category & Inventory Management**: Organize and track products efficiently.
- **RESTful API Design**: Well-structured endpoints for seamless front-end integration.

---

## Tech Stack

- **Node.js**: Runtime environment for server-side scripting.
- **Express.js**: Web framework for building robust APIs.
- **MongoDB**: Database for storing e-commerce data.
- **JWT**: Secure user authentication.
- **Bcrypt**: Password hashing for enhanced security.

---

## Installation

### Prerequisites

- **Node.js** (v14 or later)
- **npm** installed
- **MongoDB** instance running locally or in the cloud

### Steps

1. Clone the repository:

   ```bash
   git clone https://github.com/yourusername/pakzone-backend.git
   cd pakzone-backend```

2. Install the dependencies:

   ```bash
   npm install```

3. Configure environment variables:
   
   ```bash
   PORT=5000
   DATABASE_URL= your_url
   JWT_SECRET=your_secret_key```

5. Run the server:

   ```bash
   npm start
