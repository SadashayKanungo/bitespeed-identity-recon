import mysql, { ResultSetHeader } from "mysql2/promise";

import { queries } from "./queries";
import {
  AggNumResult,
  AggStrResult,
  ContactGroup,
  ContactIdentity,
  MatchResult,
} from "./interfaces";

class Database {
  private connection: mysql.Connection | null = null;

  public async connect(): Promise<void> {
    this.connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME,
    });
    // await this.connection.query(queries.CREATE_DB, [process.env.DB_NAME]);
    // await this.connection.query(queries.USE_DB, [process.env.DB_NAME]);
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

  public async matchPhone(phone: number): Promise<number> {
    const result: MatchResult[] = await this.query(queries.MATCH_PHONE, [
      phone,
    ]);
    return result.length == 0 ? 0 : result[0].result;
  }

  public async matchEmail(email: string): Promise<number> {
    const result: MatchResult[] = await this.query(queries.MATCH_EMAIL, [
      email,
    ]);
    return result.length == 0 ? 0 : result[0].result;
  }

  public async insertPrimary(identity: ContactIdentity): Promise<number> {
    const result: ResultSetHeader = await this.query(queries.INSERT_PRIMARY, [
      identity.phoneNumber,
      identity.email,
    ]);
    return result.insertId;
  }

  public async insertSecondary(
    identity: ContactIdentity,
    linkId: number
  ): Promise<void> {
    const result = await this.query(queries.INSERT_SECONDARY, [
      identity.phoneNumber,
      identity.email,
      linkId,
    ]);
  }

  public async combineGroups(
    groupId: number,
    secondaryId: number
  ): Promise<void> {
    const result = await this.query(queries.MAKE_SECONDARY, [
      groupId,
      secondaryId,
      secondaryId,
    ]);
  }

  public async getGroup(id: number): Promise<ContactGroup> {
    const phoneResult: AggStrResult[] = await this.query(queries.GET_PHONES, [
      id,
    ]);
    const emailResult: AggStrResult[] = await this.query(queries.GET_EMAILS, [
      id,
    ]);
    const secIdResult: AggNumResult[] = await this.query(
      queries.GET_SECONDARY,
      [id]
    );

    return {
      contact: {
        primaryContatctId: id,
        emails: Database.getListFromResult(emailResult),
        phoneNumbers: Database.getListFromResult(phoneResult),
        secondaryContactIds: Database.getNumListFromResult(secIdResult),
      },
    };
  }

  private static getListFromResult = (aggResult: AggStrResult[]) =>
    aggResult.flatMap((i) => i.result);
  private static getNumListFromResult = (aggResult: AggNumResult[]) =>
    aggResult.flatMap((i) => i.result);
}

const db = new Database();
export default db;
