# MongoDB Messages Dashboard

A simple Node.js + Express app with a web UI to create, read, update, and delete records stored in MongoDB. Records include full name, email, phone, message, address, and gender.

## Prerequisites

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) running locally (default: `mongodb://localhost:27017`)

## Setup

```bash
npm install
```

Ensure MongoDB is running (e.g. start the MongoDB service or run `mongod`).

## Run

```bash
npm start
```

The app listens on **http://localhost:3000**. Open this URL in a browser to use the dashboard.

## Project structure

```
nginx-node-app/
├── server.js          # Express server + MongoDB + API routes
├── public/
│   ├── index.html     # Dashboard UI
│   └── style.css      # Styles
├── package.json
└── README.md
```

## API

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/record` | Create a new record. Body: `{ name, email, phone, message, address, gender }` |
| `GET`  | `/api/records` | Return all records |
| `PUT`  | `/api/record/:id` | Update record by `_id`. Body: same as POST |
| `DELETE` | `/api/record/:id` | Delete record by `_id` |

- **Database:** `myDatabase`
- **Collection:** `messages`
- All fields are optional; empty or missing values are stored as empty strings.
