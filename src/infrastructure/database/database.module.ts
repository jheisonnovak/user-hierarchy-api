import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "../../config/database.config.service";

@Module({
	imports: [
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
			inject: [DatabaseConfigService],
		}),
	],
})
export class DatabaseModule {}
