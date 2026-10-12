const fs = require("node:fs");
const path = require("node:path");
const Database = require("better-sqlite3");
const { drizzle } = require("drizzle-orm/better-sqlite3");
const schema = require("./schema");

const dataDirectory = path.join(process.cwd(), "data");
const databasePath = path.join(dataDirectory, "pizzeria.db");

if (process.env.NODE_ENV !== "production") {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const sqlite = process.env.NODE_ENV === "production"
  ? new Database(databasePath, { readonly: true, fileMustExist: true })
  : new Database(databasePath);
const db = drizzle(sqlite, { schema });

module.exports = { db };
