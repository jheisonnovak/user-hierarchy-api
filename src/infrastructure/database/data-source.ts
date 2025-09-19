import "dotenv/config";
import { join } from "path";
import { DataSource, DataSourceOptions } from "typeorm";

const dataSourceOptions: DataSourceOptions = {
	type: "postgres",
	host: process.env.DB_HOST,
	port: +process.env.DB_PORT!,
	username: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: process.env.DB_DATABASE,
	entities: [join(__dirname, "../../**/*.entity.{js,ts}")],
	migrations: [join(__dirname, "migrations/*.{js,ts}")],
	synchronize: false,
	logging: false,
};

const dataSource = new DataSource(dataSourceOptions);

export default dataSource;
