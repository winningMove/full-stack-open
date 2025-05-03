import { NextFunction, Request, Response } from "express";
import { v1 as uuid } from "uuid";
import { z } from "zod";
import { Gender, HealthCheckRating } from "./types";

const baseEntrySchema = z.strictObject({
  id: z.string(),
  description: z.string(),
  date: z.string(),
  specialist: z.string(),
  diagnosisCodes: z.array(z.string()).optional(),
});

const healthCheckEntrySchema = baseEntrySchema.extend({
  type: z.literal("HealthCheck"),
  healthCheckRating: z.nativeEnum(HealthCheckRating),
});

const hospitalEntrySchema = baseEntrySchema.extend({
  type: z.literal("Hospital"),
  discharge: z.strictObject({
    date: z.string(),
    criteria: z.string(),
  }),
});

const occupationalHealthcareEntrySchema = baseEntrySchema.extend({
  type: z.literal("OccupationalHealthcare"),
  employerName: z.string(),
  sickLeave: z
    .strictObject({
      startDate: z.string(),
      endDate: z.string(),
    })
    .optional(),
});

export const entrySchema = z.discriminatedUnion("type", [
  healthCheckEntrySchema,
  hospitalEntrySchema,
  occupationalHealthcareEntrySchema,
]);

export const entryWithoutIdSchema = z.discriminatedUnion("type", [
  healthCheckEntrySchema.omit({ id: true }),
  hospitalEntrySchema.omit({ id: true }),
  occupationalHealthcareEntrySchema.omit({ id: true }),
]);

export const newPatientSchema = z.strictObject({
  name: z.string(),
  dateOfBirth: z.string().date(),
  ssn: z.string(),
  gender: z.nativeEnum(Gender),
  occupation: z.string(),
  entries: z.array(entrySchema),
});

export const patientSchema = newPatientSchema.merge(
  z.strictObject({ id: z.string() })
);

export const newPatientParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    newPatientSchema.parse(req.body);
    next();
  } catch (err: unknown) {
    next(err);
  }
};

export const newEntryParser = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  try {
    entryWithoutIdSchema.parse(req.body);
    next();
  } catch (err: unknown) {
    next(err);
  }
};

export const errorMiddleware = (
  error: unknown,
  _req: Request,
  res: Response<{ error: z.ZodIssue[] }>,
  next: NextFunction
) => {
  if (error instanceof z.ZodError) {
    res.status(400).send({ error: error.issues });
  } else {
    next(error);
  }
};

export const generateId = (): string => uuid();

/* --- deprecated after introducing zod ---

export const toNewPatient = (obj: unknown): NewPatient => {
  if (!obj || typeof obj !== "object")
    throw new Error("Incorrect or missing data: payload must be an object");
  if (
    !(
      "name" in obj &&
      "dateOfBirth" in obj &&
      "ssn" in obj &&
      "gender" in obj &&
      "occupation" in obj
    )
  )
    throw new Error("Incorrect or missing data: some fields missing");

  const newPatient: NewPatient = {
    name: z.string().parse(obj.name),
    dateOfBirth: z.string().date().parse(obj.dateOfBirth),
    ssn: z.string().parse(obj.ssn),
    gender: z.nativeEnum(Gender).parse(obj.gender),
    occupation: z.string().parse(obj.occupation),
  };

  return newPatient;
};

const parseAnyString = (str: unknown): string => {
  if (!str || !isString(str)) throw new Error("Incorrect or missing field");
  return str;
};
const parseDateOfBirth = (dob: unknown): string => {
  if (!dob || !isString(dob) || !isDate(dob))
    throw new Error("Incorrect or missing date of birth");
  return dob;
};
const parseGender = (gender: unknown): Gender => {
  if (!gender || !isString(gender) || !isGender(gender))
    throw new Error("Incorrect or missing gender");
  return gender;
};

const isDate = (arg: string): boolean => Boolean(Date.parse(arg));
const isGender = (arg: string): arg is Gender =>
  Object.values(Gender)
    .map((v) => String(v))
    .includes(arg);
const isString = (arg: unknown): arg is string =>
  typeof arg === "string" || arg instanceof String;
*/
