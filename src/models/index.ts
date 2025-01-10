import * as fs from "fs";
import * as path from "path";
import { Sequelize, DataTypes, Options } from "sequelize";
import config from "../config/config";
import "express-async-errors";

const basename = path.basename(__filename);
const db: any = {};

//get db config from env
const env = process.env.NODE_ENV || "development";
const databaseConfig = config[env as keyof typeof config];

const sequelize = new Sequelize(
  databaseConfig.database!,
  databaseConfig.username!,
  databaseConfig.password!,
  databaseConfig as Options,
);

//get all file from model folder
const files = fs.readdirSync(__dirname).filter((file: string) => {
  return (
    file.indexOf(".") !== 0 &&
    file !== basename &&
    file.slice(-3) === ".ts" &&
    file.indexOf(".test.ts") === -1
  );
});

//handle model file for using sequelize
files.forEach((file: string) => {
  const modelPath = path.join(__dirname, file);

  const model = require(modelPath).default(sequelize, DataTypes);
  db[model.name] = model;
});

Object.keys(db).forEach((modelName: string) => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

export default db;
