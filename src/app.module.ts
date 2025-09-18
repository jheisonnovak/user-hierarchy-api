import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { LoggerModule } from "nestjs-pino";
import { DatabaseConfigService } from "./config/database.config.service";
import { GroupModule } from "./modules/group/group.module";
import { HierarchyModule } from "./modules/hierarchy/hierarchy.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
			inject: [DatabaseConfigService],
		}),
		LoggerModule.forRoot(),
		HierarchyModule,
		UserModule,
		GroupModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
