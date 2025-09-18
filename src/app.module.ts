import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { LoggerModule } from "nestjs-pino";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HealthModule } from "./infrastructure/health/health.module";
import { GroupModule } from "./modules/group/group.module";
import { HierarchyModule } from "./modules/hierarchy/hierarchy.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DatabaseModule,
		HealthModule,
		LoggerModule.forRoot({ pinoHttp: { autoLogging: false } }),
		HierarchyModule,
		UserModule,
		GroupModule,
	],
})
export class AppModule {}
