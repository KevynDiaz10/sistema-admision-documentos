// import { create } from "zustand";
// import { STUDENTS } from "./data";
// import type { Status, Student } from "./types";

// type State = {
//   students: Student[];
//   updateStatus: (id: string, status: Status, comment?: string) => void;
//   addComment: (id: string, comment: string) => void;
// };

// export const useAdmissions = create<State>((set) => ({
//   students: STUDENTS,
//   updateStatus: (id, status, comment) =>
//     set((s) => ({
//       students: s.students.map((st) =>
//         st.id === id ? { ...st, status, comment: comment || st.comment } : st,
//       ),
//     })),
//   addComment: (id, comment) =>
//     set((s) => ({
//       students: s.students.map((st) =>
//         st.id === id ? { ...st, comment } : st,
//       ),
//     })),
// }));
