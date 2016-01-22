import { Schema, arrayOf } from 'normalizr';

export const API_VERSION = 'v1';
export const SINGLETON_ID = 'SINGLETON_ID';

const sessionSchema = new Schema('sessions', {idAttribute: () => SINGLETON_ID});
const configSchema = new Schema('configs', {idAttribute: () => SINGLETON_ID});
const customerSchema = new Schema('customers');
const purchaseSchema = new Schema('purchases').define({owner: customerSchema});
const cardSchema = new Schema('cards');
const planSchema = new Schema('plans');
const itemSchema = new Schema('items');
const subscriptionSchema = new Schema('subscriptions');
const metricSchema = new Schema('metrics');

export const SCHEMAS = Object.freeze({
  CUSTOMER: customerSchema,
  CONFIG: configSchema,
  PURCHASE: purchaseSchema,
  CARD: cardSchema,
  CARD_ARRAY: arrayOf(cardSchema),
  PLAN: planSchema,
  PLAN_ARRAY: arrayOf(planSchema),
  ITEM: itemSchema,
  ITEM_ARRAY: arrayOf(itemSchema),
  SUBSCRIPTION: subscriptionSchema,
  SUBSCRIPTION_ARRAY: arrayOf(subscriptionSchema),
  SESSION: sessionSchema,
  METRIC: metricSchema
});
