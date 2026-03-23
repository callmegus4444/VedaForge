import mongoose, { Schema, Document, Types } from 'mongoose';

export interface IPaperMeta {
  schoolName: string;
  subject: string;
  class: string;
  timeAllowed: string;
  totalMarks: number;
  instructions: string[];
}

export interface IQuestion {
  number: number;
  text: string;
  options?: string[] | null;
  correctOption?: string | null;
  modelAnswer?: string | null;
  difficulty: 'easy' | 'moderate' | 'hard';
  marks: number;
}

export interface ISection {
  title: string;
  type: string;
  instruction: string;
  questions: IQuestion[];
}

export interface IAnswerKeyItem {
  questionNumber: number;
  answer: string;
}

export interface IGeneratedPaper extends Document {
  assignmentId: Types.ObjectId;
  paperMeta: IPaperMeta;
  sections: ISection[];
  answerKey: IAnswerKeyItem[];
  generatedAt: Date;
}

const PaperMetaSchema = new Schema<IPaperMeta>({
  schoolName:   { type: String, default: 'VedaForge Academy' },
  subject:      { type: String, required: true },
  class:        { type: String, required: true },
  timeAllowed:  { type: String, required: true },
  totalMarks:   { type: Number, required: true },
  instructions: { type: [String], required: true },
}, { _id: false });

const QuestionSchema = new Schema<IQuestion>({
  number:        { type: Number, required: true },
  text:          { type: String, required: true },
  options: {
    type: [String],
    default: null,
    set: function (val: any) {
      // Case 1: already correct
      if (Array.isArray(val) && typeof val[0] === "string") {
        return val;
      }

      // Case 2: array of object → convert to string[]
      if (Array.isArray(val) && typeof val[0] === "object") {
        return Object.values(val[0]);
      }

      // Case 3: stringified JSON
      if (typeof val === "string") {
        try {
          const parsed = JSON.parse(val);
          if (Array.isArray(parsed) && typeof parsed[0] === "object") {
            return Object.values(parsed[0]);
          }
        } catch (e) {
          console.error("Failed to parse options string", e);
        }
      }

      return null;
    }
  },
  correctOption: { type: String, default: null },
  modelAnswer:   { type: String, default: null },
  difficulty:    { type: String, enum: ['easy', 'moderate', 'hard'], required: true },
  marks:         { type: Number, required: true, min: 1 },
}, { _id: false });

const SectionSchema = new Schema<ISection>({
  title:       { type: String, required: true },
  type:        { type: String, required: true },
  instruction: { type: String, default: '' },
  questions:   { type: [QuestionSchema], required: true },
}, { _id: false });

const AnswerKeyItemSchema = new Schema<IAnswerKeyItem>({
  questionNumber: { type: Number, required: true },
  answer:         { type: String, required: true },
}, { _id: false });

const GeneratedPaperSchema = new Schema<IGeneratedPaper>({
  assignmentId: {
    type: Schema.Types.ObjectId,
    ref: 'Assignment',
    required: true,
    unique: true,
  },
  paperMeta:   { type: PaperMetaSchema, required: true },
  sections:    { type: [SectionSchema], required: true },
  answerKey:   { type: [AnswerKeyItemSchema], required: true },
  generatedAt: { type: Date, default: Date.now },
});

export default mongoose.models.GeneratedPaper || mongoose.model<IGeneratedPaper>('GeneratedPaper', GeneratedPaperSchema);
