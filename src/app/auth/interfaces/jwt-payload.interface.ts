export interface JwtPayload {
	readonly iat: number;
	readonly exp: string;
	readonly jwt: string;
}
