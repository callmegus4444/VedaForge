---
description: Build the multi-field form that teachers fill in to configure their assignment. This feeds into the AI generation pipeline
---

Build the Create Assignment form in vedaforge/frontend/.
Reference: vedaforge/figma-assets/screenshot_create_form.png
and design-tokens.json for exact styling.
1. PAGE 
File: app/assignments/create/page.tsx
- Header: back arrow + 'Create Assignment' title
- Subtitle: 'Set all new assignments for your students'
2. FILE UPLOAD ZONE 
File: components/FileUpload.tsx
- Dashed border box, upload icon, text 'Choose a file or drag & drop'
- Accepted: PNG, JPG, PDF upto 50MB
- 'Browse Files' button below
- Show filename + remove button after upload
- This field is OPTIONAL
 3. DUE DATE PICKER 
- Label: 'Due Date'
- Dropdown-style input showing 'Choose a chapter'
- Calendar icon on the right
- Required field — show error if empty on submit
 4. QUESTION TYPE ROWS 
File: components/QuestionTypeRow.tsx
- Each row: [Type dropdown] [x remove] [No. of Qs stepper] [Marks stepper]
- Type options: Multiple Choice, Short Questions,
Diagram/Graph-Based, Numerical Problems
- Stepper: minus button, number, plus button
- Validation: minimum 1 question, minimum 1 mark, no negatives
- Show running totals: 'Total Questions: X Total Marks: Y'
- '+ Add Question Type' button to add new rows
- At least 1 question type required
 5. ADDITIONAL INSTRUCTIONS 
- Textarea: placeholder 'e.g. Generate a question paper for 1 hour...'
- Microphone icon on the right (non-functional placeholder is fine)
6. FORM STATE (Zustand) 
Add to store/assignmentStore.ts:
formData: { file, dueDate, questionTypes[], instructions }
setFormData(field, value)
resetForm()
 7. SUBMIT
- 'Previous' button (goes back to list)
- 'Next' button: validates all fields, then POSTs to
POST /api/assignments (backend — built in Step 3)
- Show loading spinner on the Next button while posting
- On success: navigate to /assignments/[id]/generating
 8. VALIDATION RULES 
- At least 1 question type row
- No question type can have 0 questions or 0 marks
- Due date must be in the future
- Show inline red error messages below each invalid field