const db_name = "identity_recon";
const table_name = "contacts";

export const queries = {
  CREATE_DB: `CREATE DATABASE IF NOT EXISTS ${db_name};`,

  USE_DB: `USE ${db_name};`,

  CREATE_TABLE: `CREATE TABLE IF NOT EXISTS ${table_name}(
    id              int NOT NULL AUTO_INCREMENT,
    phoneNumber     varchar(25) NOT NULL,
    email           varchar(25) NOT NULL,
    linkedId        int,
    linkPrecedence  ENUM('primary','secondary'),
    created_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at      TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (id)
    );`,

  ALL_CONTACTS: `SELECT * FROM ${table_name};`,
};
