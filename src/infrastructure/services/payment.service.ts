import {Injectable} from '@nestjs/common';
import Stripe from 'stripe';
import config from 'config';
type StripeCustomer = Stripe.customers.ICustomer;

@Injectable()
export class PaymentService {
	private readonly stripe = new Stripe(config.get('stripe.secretKey'));

	public async createCustomer(source: any, email?: string) {
		return this.stripe.customers.create({
			email,
			source: source.id
		});
	}

	public async createCharge(customer: StripeCustomer, amount: number) {
		return this.stripe.charges.create({
			amount: amount * 100,
			currency: 'eur',
			customer: customer.id
		});
	}
}
