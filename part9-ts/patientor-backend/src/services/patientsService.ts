import patients from "../../data/patients";
import {
  NewPatient,
  Patient,
  NonSensitivePatient,
  EntryWithoutId,
  Entry,
} from "../types";
import { generateId } from "../utils";

const getNonSensitivePatients = (): NonSensitivePatient[] =>
  patients.map(({ ssn: _ssn, ...rest }) => rest);

const addPatient = (patient: NewPatient): NonSensitivePatient => {
  const newPatient = {
    id: generateId(),
    ...patient,
  } as Patient;
  patients.push(newPatient);
  const nonSensitivePatient = getNonSensitivePatient(newPatient);
  return nonSensitivePatient;
};

const getPatient = (id: string): Patient | undefined => {
  const patient = patients.find((patient) => patient.id === id);
  return patient;
};

const getNonSensitivePatient = (patient: Patient): NonSensitivePatient => {
  const { ssn: _ssn, entries: _entries, ...rest } = patient;
  return rest;
};

const addEntry = (patient: Patient, entry: EntryWithoutId): Entry => {
  const newEntry = {
    id: generateId(),
    ...entry,
  } as Entry;
  patient.entries.push(newEntry);
  return newEntry;
};

export default { addPatient, getPatient, getNonSensitivePatients, addEntry };
