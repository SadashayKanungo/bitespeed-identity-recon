import mysql from "mysql2/promise";

import { queries } from "./queries";

class Database {
  private connection: mysql.Connection | null = null;

  public async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });
    await this.connection.query(queries.CREATE_DB, [process.env.DB_NAME]);
    await this.connection.query(queries.USE_DB, [process.env.DB_NAME]);
    await this.connection.query(queries.CREATE_TABLE);
    console.log("Connected to database");
  }

  public async query(sql: string, values?: any[]): Promise<any> {
    if (!this.connection) {
      throw new Error("Database connection not established");
    }
    try {
      const [rows] = await this.connection.query(sql, values);
      return rows;
    } catch (error) {
      console.error("Error executing query:", error);
      throw error;
    }
  }

  public async finalize(): Promise<void> {
    if (this.connection) {
      await this.connection.end();
      console.log("Connection to database closed");
    }
  }
}

const db = new Database();
export default db;
