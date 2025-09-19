import { CallHandler, ExecutionContext, Injectable, NestInterceptor } from "@nestjs/common";
import { PinoLogger } from "nestjs-pino";
import { catchError, Observable, tap, throwError } from "rxjs";

@Injectable()
export class LoggingInterceptor implements NestInterceptor {
	constructor(private readonly logger: PinoLogger) {}

	intercept(ctx: ExecutionContext, next: CallHandler): Observable<unknown> {
		const req = ctx.switchToHttp().getRequest<Request>();
		const start = Date.now();

		this.logger.info({ data: req.body }, `START ${req.method} ${req.url}`);

		return next.handle().pipe(
			tap(() => this.logger.info(`END   ${req.method} ${req.url} ${Date.now() - start}ms`)),
			catchError(err => {
				const message = err instanceof Error ? err.message : String(err);
				const stack = err instanceof Error ? err.stack : undefined;
				this.logger.error(`ERROR ${req.method} ${req.url}: ${message}`, stack);
				return throwError(() => err);
			})
		);
	}
}
