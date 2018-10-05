export interface JwtPayload {
	readonly iat: number;
	readonly exp: number;
	readonly jwt: string;
}
