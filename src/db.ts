import mysql, { ResultSetHeader } from "mysql2/promise";

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

  private async query(sql: string, values?: any[]): Promise<any> {
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

  public async show() {
    const result = await this.query(queries.ALL_CONTACTS);
    return result;
  }

  public async matchPhone(phone: string): Promise<Number | null> {
    const result = await this.query(queries.MATCH_PHONE, [phone]);
    return result.length == 0 ? null : result[0].matchId;
  }

  public async matchEmail(email: string): Promise<Number | null> {
    const result = await this.query(queries.MATCH_EMAIL, [email]);
    return result.length == 0 ? null : result[0].matchId;
  }

  public async insertPrimary(phone: string, email: string): Promise<Number> {
    const result: ResultSetHeader = await this.query(queries.INSERT_PRIMARY, [
      phone,
      email,
    ]);
    return result.insertId;
  }

  public async insertSecondary(
    phone: string,
    email: string,
    linkId: Number
  ): Promise<void> {
    const result = await this.query(queries.INSERT_SECONDARY, [
      phone,
      email,
      linkId,
    ]);
  }

  public async combineGroups(
    groupId: Number,
    secondaryId: Number
  ): Promise<void> {
    const result = await this.query(queries.MAKE_SECONDARY, [
      groupId,
      secondaryId,
      secondaryId,
    ]);
  }

  //   public async getGroup(id: number){}
}

const db = new Database();
export default db;
