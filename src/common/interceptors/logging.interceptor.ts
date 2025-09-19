import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { catchError, Observable } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: PinoLogger) {}

	intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
		const req = ctx.switchToHttp().getRequest<Request>();

		this.logger.info({ data: req.body }, `START ${req.method} ${req.url}`);

		return next.handle().pipe(
			catchError((err: unknown) => {
				const message = err instanceof Error ? err.message : String(err);
				const stack = err instanceof Error ? err.stack : undefined;
				this.logger.error(`ERROR ${req.method} ${req.url}: ${message}`, stack);
				throw err;
			})
		);
	}
}
