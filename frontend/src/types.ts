// Trainingstypen
export type Training = {
  name: string;
  trainingId: number;
  onDays: string[];
  exercises: Exercise[];
};

export type Exercise = {
  exerciseName: string;
  exerciseId: number;
  exerciseType: string;
  exercise: ExerciseCardio | ExerciseWeighted;
};

export type TrainingExercise = {
  exerciseName: string;
  exerciseId: number;
  exerciseType: string;
};

export type ExerciseCardio = {
  minutes: number;
};

export type ExerciseWeighted = {
  repetitionAmount: number;
  setAmount: number;
};

export type CalendarData = {
  pastTrainings: CalendarDayData[];
  futureTrainings: CalendarDayData[];
};

export type CalendarDayData = {
  date: string;
  trainings: CalendarTraining[];
};

export type CalendarTraining = {
  trainingName: string;
  trainingId: number;
  onDays: string[];
  exercises: CalendarExercise[];
};

export type CalendarExercise = {
  exerciseName: string;
  exerciseId: number;
  exerciseType: string;
  exercise: ExerciseCardio | (ExerciseWeighted & { weight: number });
  completed: boolean;
};

// Exercises
export type ExercisesEntryData = Exercise &
  Tags & {
    rating: number;
    reviews: number;
    previewImage: string;
  };

type Tags = {
  primaryTags: string[];
  secondaryTags: string[];
};

export type InTraining = {
  exerciseId: number;
  trainingId: number;
  trainingName: string;
};

export type ExerciseAdd = {
  inTraining: InTraining[];
  notInTraining: InTraining[];
};

export type ExercisesAddDialog = Exercise & ExerciseAdd;

export type ExerciseInfo = {
  exerciseName: string;
  exerciseText: string;
  video: string;
  userRating: number;
};

export type ExercisesInfoDialog = Tags & ExerciseInfo;

export type Help = {
  title: string;
  text: string;
};

export type ChatsOverview = {
  partnerName: string;
  partnerId: number;
  lastMessage: string;
  unreadMessages: number;
  lastMessageTimestamp: string | number;
  disabled: boolean;
  profilePicture?: string;
  lastSenderId: number;
  bio?: string;
  nickname?: string;
};

type BaseUserData = {
  name: string;
  id: number;
  profilePicture?: string;
  nickname?: string;
  bio?: string;
};

export type UserRating = {
  exerciseName: string;
  rating: number;
};

export type UserData = BaseUserData & {
  searchingForPartner: boolean;
  plz?: string;
};

export type PartnerData = BaseUserData & {
  disabled: boolean;
  lastMessageSenderId: number;
};

export type SingleChatHistory = {
  sender: number;
  content: string;
  timestamp: string | number;
  tempId?: number;
};

export type WSError = {
  error: boolean;
  error_message?: string;
  message: Message;
};
type Message = {
  recipient_id: number;
  content: string;
  id: number;
};

export enum DismissDialogType {
  INFO = "info",
  WARNING = "warning",
  ERROR = "error",
}

export const isExerciseWeighted = (
  value:
    | ExerciseCardio
    | (ExerciseWeighted & {
        weight: number;
      })
): value is ExerciseWeighted & { weight: number } => {
  return "repetitionAmount" in value && "setAmount" in value;
};

export const isSingleChatHistory = (
  value: SingleChatHistory | WSError
): value is SingleChatHistory => {
  return "content" in value && "sender" in value && "timestamp" in value;
};

export const isWSError = (
  value: SingleChatHistory | WSError
): value is WSError => {
  return "error" in value && "message" in value;
};
