import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { APP_INTERCEPTOR } from "@nestjs/core";
import { LoggingInterceptor } from "./common/interceptors/logging.interceptor";
import { TracingInterceptor } from "./common/interceptors/tracing.interceptor";
import { LoggingModule } from "./common/logging/logging.module";
import { DatabaseModule } from "./infrastructure/database/database.module";
import { HealthModule } from "./infrastructure/health/health.module";
import { GroupModule } from "./modules/group/group.module";
import { HierarchyModule } from "./modules/hierarchy/hierarchy.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [ConfigModule.forRoot({ isGlobal: true }), DatabaseModule, HealthModule, LoggingModule, HierarchyModule, UserModule, GroupModule],
	providers: [
		{
			provide: APP_INTERCEPTOR,
			useClass: TracingInterceptor,
		},
		{
			provide: APP_INTERCEPTOR,
			useClass: LoggingInterceptor,
		},
	],
})
export class AppModule {}
