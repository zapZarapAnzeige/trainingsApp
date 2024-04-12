export type CalendarDayData = {
  name: string;
  date: string;
  trainingData: CalendarDayTrainingData[] | null;
};

export type CalendarDayTrainingData = {
  exercise: string;
  repititionAmount: number;
  setAmount: number;
  weight: number;
  done: boolean;
};
