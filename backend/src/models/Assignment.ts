import mongoose, { Schema, Document } from 'mongoose';

export interface IQuestionType {
  type: string;
  count: number;
  marks: number;
}

export interface IAssignment extends Document {
  title: string;
  dueDate: Date;
  questionTypes: IQuestionType[];
  fileUrl?: string;
  instructions: string;
  status: 'pending' | 'processing' | 'done' | 'error';
  createdAt: Date;
}

const QuestionTypeSchema = new Schema<IQuestionType>(
  {
    type:  { type: String, required: true },
    count: { type: Number, required: true, min: 1 },
    marks: { type: Number, required: true, min: 1 },
  },
  { _id: false }
);

const AssignmentSchema = new Schema<IAssignment>(
  {
    title:         { type: String, required: true, trim: true },
    dueDate:       { type: Date,   required: true },
    questionTypes: { type: [QuestionTypeSchema], required: true },
    fileUrl:       { type: String },
    instructions:  { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'processing', 'done', 'error'],
      default: 'pending',
    },
  },
  { timestamps: true }
);



export default mongoose.model<IAssignment>('Assignment', AssignmentSchema);
