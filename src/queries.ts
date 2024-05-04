const db_name = "identity_recon";
const table_name = "contacts";

export const queries = {
  CREATE_DB: `CREATE DATABASE IF NOT EXISTS ${db_name};`,

  USE_DB: `USE ${db_name};`,

  CREATE_TABLE: `CREATE TABLE IF NOT EXISTS ${table_name}(
    id              int NOT NULL AUTO_INCREMENT,
    phoneNumber     varchar(25),
    email           varchar(25),
    linkedId        int,
    linkPrecedence  ENUM('primary','secondary'),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );`,

  ALL_CONTACTS: `SELECT * FROM ${table_name};`,

  MATCH_PHONE: `SELECT distinct coalesce(linkedId,id) as matchId from ${table_name} where phoneNumber=?;`,

  MATCH_EMAIL: `SELECT distinct coalesce(linkedId,id) as matchId from ${table_name} where email=?;`,

  INSERT_PRIMARY: `INSERT INTO 
    ${table_name} (phonenumber,email,linkedId,linkPrecedence) 
    VALUES (?,?,null,"primary");`,

  INSERT_SECONDARY: `INSERT INTO 
    ${table_name} (phonenumber,email,linkedId,linkPrecedence) 
    VALUES (?,?,?,"secondary");`,

  MAKE_SECONDARY: `UPDATE ${table_name} SET linkedId=?, linkPrecedence='secondary' WHERE id=? OR linkedId=?;`,

  GET_PHONES: `SELECT DISTINCT phonenumber FROM ${table_name} WHERE COALESCE(linkedId,id)=?;`,

  GET_EMAILS: `SELECT DISTINCT email FROM ${table_name} WHERE COALESCE(linkedId,id)=?;`,

  GET_SECONDARY: `SELECT id FROM ${table_name} WHERE linkedId=?;`,
};
