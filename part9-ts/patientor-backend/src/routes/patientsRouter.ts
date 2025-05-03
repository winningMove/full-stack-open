import { Request, Response, Router } from "express";
import patientsService from "../services/patientsService";
import {
  Entry,
  EntryWithoutId,
  NewPatient,
  NonSensitivePatient,
  Patient,
} from "../types";
import { errorMiddleware, newEntryParser, newPatientParser } from "../utils";

const patientsRouter = Router();

patientsRouter
  .route("/")
  .get((_req, res: Response<NonSensitivePatient[]>) => {
    const patients = patientsService.getNonSensitivePatients();
    res.json(patients);
  })
  .post(
    newPatientParser,
    (
      req: Request<unknown, unknown, NewPatient>,
      res: Response<NonSensitivePatient>
    ) => {
      const newPatient = req.body;
      const addedPatient = patientsService.addPatient(newPatient);
      res.json(addedPatient);
    }
  );

patientsRouter
  .route("/:id")
  .get((req, res: Response<Patient | { error: string }>) => {
    const patient = patientsService.getPatient(req.params.id);
    if (!patient) {
      res.status(400).json({ error: "No patient with given id" });
      return;
    }
    res.json(patient);
  });

patientsRouter
  .route("/:id/entries")
  .post(
    newEntryParser,
    (
      req: Request<{ id: string }, unknown, EntryWithoutId>,
      res: Response<Entry | { error: string }>
    ) => {
      const patient = patientsService.getPatient(req.params.id);
      if (!patient) {
        res.status(400).json({ error: "No patient with given id" });
        return;
      }
      const newEntry = req.body;
      const addedEntry = patientsService.addEntry(patient, newEntry);
      res.json(addedEntry);
    }
  );

patientsRouter.use(errorMiddleware);

export default patientsRouter;
