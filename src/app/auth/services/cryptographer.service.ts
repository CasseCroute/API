import bcrypt from 'bcrypt';

export class CryptographerService {
	public static async hashPassword(password: string): Promise<string> {
		return new Promise<string>(async (resolve: any, reject: any) => {
			await bcrypt.hash(password, 10, (err, hash) => {
				return err ? reject(err) : resolve(hash);
			});
		});
	}

	public static async comparePassword(candidatePassword: string, saltedPassword: string): Promise<boolean> {
		return new Promise<boolean>(async (resolve: any, reject: any) => {
			await bcrypt.compare(candidatePassword, saltedPassword, (err, res) => {
				return err ? reject(err) : resolve(res);
			});
		});
	}
}
