import { create } from "zustand";
import { QuestionType } from "@/app/components/QuestionTypeTable";

const API_BASE = process.env.NEXT_PUBLIC_BACKEND_URL ?? "https://vedaforge-backend.onrender.com";

// ── Assignment types ─────────────────────────────────────────────────────────
export interface Assignment {
  _id: string;
  title: string;
  createdAt: string;
  dueDate: string;
  status: "pending" | "processing" | "done" | "error";
}

// ── Form types ───────────────────────────────────────────────────────────────
export interface QTypeRow {
  type: QuestionType;
  count: number;
  marks: number;
}

export interface FormData {
  file: File | null;
  dueDate: string;
  questionTypes: QTypeRow[];
  instructions: string;
}

const DEFAULT_ROWS: QTypeRow[] = [
  { type: "Multiple Choice Questions", count: 4, marks: 1 },
  { type: "Short Questions", count: 3, marks: 2 },
];

// ── Store ────────────────────────────────────────────────────────────────────
interface AssignmentState {
  // List state
  assignments: Assignment[];
  isLoading: boolean;
  hasFetched: boolean;
  error: string | null;

  // Form state
  formData: FormData;

  // List actions
  fetchAssignments: () => Promise<void>;
  deleteAssignment: (id: string) => Promise<void>;

  // Form actions
  setFormField: <K extends keyof FormData>(field: K, value: FormData[K]) => void;
  addQuestionType: () => void;
  removeQuestionType: (index: number) => void;
  updateQuestionType: (
    index: number,
    field: "type" | "count" | "marks",
    value: string | number
  ) => void;
  resetForm: () => void;
}

export const useAssignmentStore = create<AssignmentState>((set, get) => ({
  // ── List state ─────────────────────────────────────────────────────────────
  assignments: [],
  isLoading: true,
  hasFetched: false,
  error: null,

  // ── Form state ─────────────────────────────────────────────────────────────
  formData: {
    file: null,
    dueDate: "",
    questionTypes: DEFAULT_ROWS,
    instructions: "",
  },

  // ── List actions ──────────────────────────────────────────────────────────
  fetchAssignments: async () => {
    // If we already have data show it immediately while re-fetching silently
    const { assignments, hasFetched } = get();
    if (!hasFetched) {
      set({ isLoading: true, error: null });
    } else {
      set({ error: null }); // background refresh — don't show spinner
    }
    try {
      const res = await fetch(`${API_BASE}/api/assignments`);
      if (!res.ok) throw new Error("Failed to fetch assignments");
      const data: Assignment[] = await res.json();
      set({ assignments: data, isLoading: false, hasFetched: true });
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message, isLoading: false, hasFetched: true });
    }
  },

  deleteAssignment: async (id: string) => {
    try {
      const res = await fetch(`${API_BASE}/api/assignments/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error("Failed to delete assignment");
      set((state) => ({
        assignments: state.assignments.filter((a) => a._id !== id),
      }));
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Unknown error";
      set({ error: message });
    }
  },

  // ── Form actions ──────────────────────────────────────────────────────────
  setFormField: (field, value) => {
    set((state) => ({
      formData: { ...state.formData, [field]: value },
    }));
  },

  addQuestionType: () => {
    const { formData } = get();
    const usedTypes = formData.questionTypes.map((r) => r.type);
    const allTypes: QuestionType[] = [
      "Multiple Choice Questions",
      "Short Questions",
      "Diagram/Graph-Based Questions",
      "Numerical Problems",
    ];
    const nextType = allTypes.find((t) => !usedTypes.includes(t));
    if (!nextType) return;
    set((state) => ({
      formData: {
        ...state.formData,
        questionTypes: [
          ...state.formData.questionTypes,
          { type: nextType, count: 1, marks: 1 },
        ],
      },
    }));
  },

  removeQuestionType: (index: number) => {
    set((state) => {
      if (state.formData.questionTypes.length <= 1) return state;
      const next = [...state.formData.questionTypes];
      next.splice(index, 1);
      return { formData: { ...state.formData, questionTypes: next } };
    });
  },

  updateQuestionType: (index, field, value) => {
    set((state) => {
      const next = [...state.formData.questionTypes];
      next[index] = { ...next[index], [field]: value };
      return { formData: { ...state.formData, questionTypes: next } };
    });
  },

  resetForm: () => {
    set({
      formData: {
        file: null,
        dueDate: "",
        questionTypes: DEFAULT_ROWS,
        instructions: "",
      },
    });
  },
}));
