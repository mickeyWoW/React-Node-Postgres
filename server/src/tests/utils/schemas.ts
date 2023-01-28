import { object, string, number, boolean, array, date } from 'lib/yup';

export const skillSchema = object({
  id: number().required(),
  name: string().required(),
  updatedAt: date().required(),
  createdAt: date().required(),
});

export const userSchemaWithSkillIds = object({
  id: number().required(),
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required(),
  isActive: boolean().required(),
  address1: string().required(),
  address2: string().nullable(),
  city: string().required(),
  state: string().required(),
  zip: string().required(),
  phone: string().required(),
  podId: number().required(),
  skills: array().of(number().required()),
});

export const userSchemaWithSkills = object({
  id: number().required(),
  email: string().email().required(),
  firstName: string().required(),
  lastName: string().required(),
  isActive: boolean().required(),
  address1: string().required(),
  address2: string().nullable(),
  city: string().required(),
  state: string().required(),
  zip: string().required(),
  phone: string().required(),
  podId: number().required(),
  skills: array().of(skillSchema.required()),
});

export const podSchema = object({
  id: string().required(),
  name: string().required(),
});

export const workOrderSchema = object({
  id: number().required(),
  name: string().required(),
  timeEstimateMin: number().required(),
  timeEstimateMax: number().required(),
  minTaskQuantity: number().required(),
  maxTaskQuantity: number().required(),
  endDate: date().required(),
  status: string().required(),
  paymentTerms: number().required(),
  paymentStatus: string().required(),
  totalQuantity: number().required(),
  completedQuantity: number().required(),
  instructionsPdfLink: string().required(),
  instructionsVideoLink: string().required(),
});

export const taskSchema = object({
  active: boolean().required(),
  claimedQuantity: number().required(),
  completedQuantity: number().required(),
  completedOnTime: boolean().required(),
  userId: number().required(),
  workOrderId: number().required(),
  id: number().required(),
});
