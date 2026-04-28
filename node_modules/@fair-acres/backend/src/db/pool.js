import pg from "pg";
import { config } from "../config.js";
import { jsonPool } from "./jsonStore.js";

export const pool = config.useJsonDb
  ? jsonPool
  : new pg.Pool({
      connectionString: config.databaseUrl
    });
