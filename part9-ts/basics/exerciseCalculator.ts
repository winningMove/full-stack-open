export interface Result {
  periodLength: number;
  trainingDays: number;
  success: boolean;
  rating: Rating;
  ratingDescription: string;
  target: number;
  average: number;
}

type Rating = 1 | 2 | 3;

export interface ExerciseValues {
  target: number;
  dailyTrainingHours: number[];
}

export function calculateExercises(
  dailyTrainingHours: number[],
  targetAverageDailyTrainingHours: number
): Result {
  const periodLength = dailyTrainingHours.length;
  const trainingDays = dailyTrainingHours.reduce(
    (acc, el) => (el > 0 ? acc + 1 : acc),
    0
  );
  const target = targetAverageDailyTrainingHours;
  const average =
    dailyTrainingHours.reduce((acc, el) => acc + el) / periodLength;
  const success = average >= target;
  const diff = average - target;
  let rating: Rating;
  if (diff < -1) rating = 1;
  else if (diff < 0) rating = 2;
  else rating = 3;
  const ratingDescriptions: Record<Rating, string> = {
    1: "You failed to meet the target. Try again next week!",
    2: "You almost met the target. Just push a little harder!",
    3: "You met the target! Excellent work, keep it up.",
  };
  const ratingDescription = ratingDescriptions[rating];

  return {
    periodLength,
    trainingDays,
    success,
    rating,
    ratingDescription,
    target,
    average,
  };
}

function parseArgs(args: string[]): ExerciseValues {
  if (args.length < 4) throw new Error("Not enough arguments.");
  if (args.length === 4)
    throw new Error("Add hours of exercise for at least two days.");

  const argNumbers = args.slice(2).map((arg) => Number(arg));
  const validArgs = argNumbers.every((arg) => !isNaN(arg));

  if (validArgs) {
    return {
      target: argNumbers[0],
      dailyTrainingHours: argNumbers.slice(1),
    };
  } else {
    throw new Error("Arguments must be numbers.");
  }
}

try {
  if (require.main === module) {
    const { dailyTrainingHours, target } = parseArgs(process.argv);
    console.log(calculateExercises(dailyTrainingHours, target));
  }
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Error:", err.message);
  } else {
    console.log("Something strange has happened.");
  }
}
