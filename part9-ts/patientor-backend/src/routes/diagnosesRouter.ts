import { Response, Router } from "express";
import diagnosesService from "../services/diagnosesService";
import { Diagnosis } from "../types";

const diagnosesRouter = Router();

diagnosesRouter
  .route("/")
  .get((_req, res: Response<Diagnosis[]>) => {
    const diagnoses = diagnosesService.getDiagnoses();
    res.json(diagnoses);
  })
  .post((_req, res) => {
    res.send("saving diagnosis");
  });

export default diagnosesRouter;
