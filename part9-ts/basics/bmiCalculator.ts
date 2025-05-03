interface BmiValues {
  heightInCm: number;
  weightInKg: number;
}

export function calculateBmi(heightInCm: number, weightInKg: number): string {
  const heightInM = heightInCm / 100;
  const bmi = weightInKg / (heightInM * heightInM);
  if (bmi < 18.5) return "Underweight";
  else if (bmi < 25) return "Normal weight";
  else if (bmi < 30) return "Overweight";
  else return "Obese";
}

function parseArgs(args: string[]): BmiValues {
  if (args.length < 4) throw new Error("Not enough arguments.");
  if (args.length > 4) throw new Error("Too many arguments.");

  const first = Number(args[2]);
  const second = Number(args[3]);

  if (!isNaN(first) && !isNaN(Number(second))) {
    return {
      heightInCm: first,
      weightInKg: second,
    };
  } else {
    throw new Error("Arguments must be numbers.");
  }
}

try {
  if (require.main === module) {
    const { heightInCm, weightInKg } = parseArgs(process.argv);
    console.log(calculateBmi(heightInCm, weightInKg));
  }
} catch (err: unknown) {
  if (err instanceof Error) {
    console.log("Error:", err.message);
  } else {
    console.log("Something strange has happened.");
  }
}
