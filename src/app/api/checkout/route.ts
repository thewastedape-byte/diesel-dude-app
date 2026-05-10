import { NextRequest, NextResponse } from 'next/server'
import Stripe from 'stripe'

export const dynamic = 'force-dynamic'

const getStripe = () => new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_placeholder', { apiVersion: '2024-04-10' })

const PRICE_IDS: Record<string, string> = {
  grease_monkey:   'price_1TUm7kHfCuVeN1IrgxweTFtn', // $19.99/mo
  troop:           'price_1TUm7kHfCuVeN1IrudictkrK', // $79/mo
  silverback:      'price_1TUm7kHfCuVeN1IrHMa56Hdc', // $149/mo
  // legacy keys
  line_mechanic:   'price_1TUm7kHfCuVeN1IrgxweTFtn',
  master_mechanic: 'price_1TUm7kHfCuVeN1IrudictkrK',
  motor_sergeant:  'price_1TUm7kHfCuVeN1IrHMa56Hdc',
}

export async function POST(req: NextRequest) {
  try {
    const { tier, email } = await req.json()
    const priceId = PRICE_IDS[tier]
    if (!priceId) return NextResponse.json({ error: 'Invalid tier' }, { status: 400 })

    const stripe = getStripe()
    const appUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://dieseldude.thewastedape.com'

    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      customer_email: email || undefined,
      discounts: [{ coupon: 'LAUNCH2026' }], // 50% off for 2 months
      success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/upgrade`,
    })

    return NextResponse.json({ url: session.url })
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 })
  }
}
