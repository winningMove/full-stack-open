import e from "express";
import diagnosesRouter from "./routes/diagnosesRouter";
import patientsRouter from "./routes/patientsRouter";
const app = e();

app.use(e.json());
const PORT = 3001;

app.get("/api/ping", (_req, res) => {
  res.send("Pong");
});

app.use("/api/diagnoses", diagnosesRouter);
app.use("/api/patients", patientsRouter);

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
