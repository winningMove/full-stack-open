import e from "express";
import { calculateBmi } from "./bmiCalculator";
import {
  calculateExercises,
  ExerciseValues,
  Result,
} from "./exerciseCalculator";

const app = e();

app.use(e.json());

app.route("/hello").get((_req, res) => {
  res.send("Hello Full Stack!");
});

app.route("/bmi").get((req, res) => {
  const height =
    typeof req.query.height === "string" ? Number(req.query.height) : undefined;
  const weight =
    typeof req.query.weight === "string" ? Number(req.query.weight) : undefined;
  if (!height || !weight || isNaN(height) || isNaN(weight)) {
    res.status(400).json({ error: "missing or invalid parameters" });
    return;
  }
  res.json({ height, weight, bmi: calculateBmi(height, weight) });
});

app.route("/exercises").post((req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const { daily_exercises, target } = req.body;
  if (daily_exercises === undefined || target === undefined) {
    res.status(400).json({ error: "missing parameters" });
    return;
  }
  if (typeof target !== "number" || isNaN(target)) {
    res
      .status(400)
      .json({ error: "malformed parameters, target must be a number" });
    return;
  }
  if (
    !Array.isArray(daily_exercises) ||
    daily_exercises.some((el) => typeof el !== "number" || isNaN(el))
  ) {
    res.status(400).json({
      error:
        "malformed parameters, daily_exercises must be an array of numbers",
    });
    return;
  }
  const validBody: ExerciseValues = {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    dailyTrainingHours: daily_exercises,
    target,
  };
  const result: Result = calculateExercises(
    validBody.dailyTrainingHours,
    validBody.target
  );
  res.json(result);
});

const PORT = 3003;

app.listen(PORT, () => {
  console.log(`Listening on ${PORT}`);
});
