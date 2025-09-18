import { Controller, Get, HttpCode, HttpStatus } from "@nestjs/common";

interface HealthStatus {
	status: string;
	uptime: number;
	timestamp: string;
	memory: {
		rss: number;
		heapTotal: number;
		heapUsed: number;
		external: number;
	};
}

@Controller("health")
export class HealthController {
	@Get()
	@HttpCode(HttpStatus.OK)
	status(): HealthStatus {
		return {
			status: "ok",
			uptime: process.uptime(),
			timestamp: new Date().toISOString(),
			memory: {
				rss: process.memoryUsage().rss,
				heapTotal: process.memoryUsage().heapTotal,
				heapUsed: process.memoryUsage().heapUsed,
				external: process.memoryUsage().external,
			},
		};
	}
}
