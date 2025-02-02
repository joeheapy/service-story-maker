import { requireNodeEnvVar } from '../server/utils'

export type SubscriptionStatus =
  | 'past_due'
  | 'cancel_at_period_end'
  | 'active'
  | 'deleted'

export enum PaymentPlanId {
  Credits10 = 'credits10',
  Credits50 = 'credits50',
  Credits500 = 'credits500',
}

export interface PaymentPlan {
  // Returns the id under which this payment plan is identified on your payment processor.
  // E.g. this might be price id on Stripe, or variant id on LemonSqueezy.
  getPaymentProcessorPlanId: () => string
  effect: PaymentPlanEffect
}

export type PaymentPlanEffect =
  | { kind: 'subscription' }
  | { kind: 'credits'; amount: number }

export const paymentPlans: Record<PaymentPlanId, PaymentPlan> = {
  [PaymentPlanId.Credits10]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar('PAYMENTS_CREDITS_10_PLAN_ID'),
    effect: { kind: 'credits', amount: 10 },
  },
  [PaymentPlanId.Credits50]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar('PAYMENTS_CREDITS_50_PLAN_ID'),
    effect: { kind: 'credits', amount: 50 },
  },
  [PaymentPlanId.Credits500]: {
    getPaymentProcessorPlanId: () =>
      requireNodeEnvVar('PAYMENTS_CREDITS_500_PLAN_ID'),
    effect: { kind: 'credits', amount: 500 },
  },
}

export function prettyPaymentPlanName(planId: PaymentPlanId): string {
  const planToName: Record<PaymentPlanId, string> = {
    [PaymentPlanId.Credits10]: '10 Tokens',
    [PaymentPlanId.Credits50]: '50 Tokens',
    [PaymentPlanId.Credits500]: '500 Tokens',
  }
  return planToName[planId]
}

export function parsePaymentPlanId(planId: string): PaymentPlanId {
  if ((Object.values(PaymentPlanId) as string[]).includes(planId)) {
    return planId as PaymentPlanId
  } else {
    throw new Error(`Invalid PaymentPlanId: ${planId}`)
  }
}

export function getSubscriptionPaymentPlanIds(): PaymentPlanId[] {
  return Object.values(PaymentPlanId).filter(
    (planId) => paymentPlans[planId].effect.kind === 'subscription'
  )
}
