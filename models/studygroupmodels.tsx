export interface BaseAssignment {
  id: string;
  title: string;
  dueDate: string;
  link: string;
}
export interface AssignmentUpload extends BaseAssignment {
  uploadTime: string;
  status: 'Active' | 'Overdue';
  questions: string[];
}
export interface AssignmentSubmission extends BaseAssignment {
  submissionTime: string;
  status: 'Approved' | 'Pending' | 'Submitted' | 'Rejected';
  percentage?: number;
}
export const mockAssignments: AssignmentUpload[] = [
  {
    id: '1',
    title: 'Kings and Priests in the Earth (2020) - Track 1',
    uploadTime: '2025-01-01T10:00:00Z',
    dueDate: '27th April, 2025',
    status: 'Active',
    questions: [
      '1. Explain the concept of the “Feast of God”.',
      '2. Provide an exhaustive explanation on how the Tabernacle of Moses and the Temple of Solomon mirrors God’s plan for the whole earth.',
      '3. Write a commentary on the Kingdom of God.',
    ],
    link: 'https://www.livingwordmedia.org/kings-and-priests-in-the-earth/',
  },
  {
    id: '2',
    title: 'Kings and Priests in the Earth (2020) - Track 2',
    uploadTime: '2025-01-02T10:00:00Z',
    dueDate: '27th April, 2025',
    status: 'Overdue',
    questions: [],
    link: '',
  },
];
export const mockAssignmentsSubmit: AssignmentSubmission[] = [
  {
    id: '1',
    title: 'Kings and Priests in the Earth (2020) - Track 1',
    submissionTime: '27th April, 2025 11:59AM',
    dueDate: '27th April, 2025 11:59AM',
    status: 'Approved',
    link: 'https://www.livingwordmedia.org/kings-and-priests-in-the-earth/',
    percentage: 67,
  },
  {
    id: '2',
    title: "(In Christ) Paul's revelation of Identification - Track 1",
    submissionTime: '27th April, 2025 11:59AM',
    dueDate: '24th April, 2025 11:59AM',
    status: 'Submitted',
    link: '',
  },
  {
    id: '3',
    title: "(In Christ) Paul's revelation of Identification - Track 2",
    submissionTime: '17th April, 2025 11:59AM',
    dueDate: '24th April, 2025 11:59AM',
    status: 'Approved',
    link: '',
    percentage: 85,
  },
  {
    id: '4',
    title: "(In Christ) Paul's revelation of Identification - Track 3",
    submissionTime: '16th April, 2025 11:59AM',
    dueDate: '24th April, 2025 11:59AM',
    status: 'Approved',
    link: '',
    percentage: 90,
  },
  {
    id: '5',
    title: "(In Christ) Paul's revelation of Identification - Track 4",
    submissionTime: '28th April, 2025 11:59AM',
    dueDate: '24th April, 2025 11:59AM',
    status: 'Submitted',
    link: '',
  },
  {
    id: '6',
    title: "(In Christ) Paul's revelation of Identification - Track 5",
    submissionTime: '27th April, 2025 11:59AM',
    dueDate: '24th April, 2025 11:59AM',
    status: 'Submitted',
    link: '',
  },
];
