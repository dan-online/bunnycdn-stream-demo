import { config } from "dotenv";

export const env = config().parsed || {};