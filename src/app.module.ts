import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";
import { TypeOrmModule } from "@nestjs/typeorm";
import { DatabaseConfigService } from "./config/database.config.service";
import { HierarchyModule } from "./modules/hierarchy/hierarchy.module";
import { UserModule } from "./modules/user/user.module";

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		TypeOrmModule.forRootAsync({
			useClass: DatabaseConfigService,
			inject: [DatabaseConfigService],
		}),
		UserModule,
		HierarchyModule,
	],
	controllers: [],
	providers: [],
})
export class AppModule {}
