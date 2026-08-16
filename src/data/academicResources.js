import { title } from "framer-motion/client";
import { Download, Undo2 } from "lucide-react";
import { Navigate } from "react-router-dom";

export const academicResources = [
  {
    id: 1,
    title: "B.Tech",
    department: [
      {
    id: 1,
    title: "1st Year",
    semesters: "Semester 1 • 2",
    semester: [
      {
        id: 1,
        title: "First sem",
        branch: [
          {
            id: 1,
            title: "CSE",
            subject: [
                  {
                    id: 1,
                    title: "Mathematics 1",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                  {
                    id: 2,
                    title: "Physics",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                  {
                    id: 3,
                    title: "BASIC ELECTRICAL ENGINEERING",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                  {
                    id: 4,
                    title: "FUNDAMENTAL OF ELECTRONICS ENGINEERING",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
            ]
              },
          {
            id: 2,
            title: "IT",
            subject: [
              {
                id: 1,
                title: "Syllabus",
                subject: [
                  {
                    id: 1,
                    title: "Mathematics 2",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                  {
                    id: 2,
                    title: "CHEMISTRY",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                  {
                    id: 3,
                    title: "PROGRAMMING FOR PROBLEM SOLVING",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                  {
                    id: 4,
                    title: "PROFESSIONAL ENGLISH",
                    pyqYear: [
                      {
                        id: 1,
                        title: "2026",
                        link: '#'
                      },
                      {
                        id: 2,
                        title: "2025",
                        link: "#"
                      },
                      {
                        id: 3,
                        title: "2024",
                        link: '#'
                      },
                      {
                        id: 4,
                        title: "2023",
                        link: "#"
                      },
                    ]
                  },
                ]
              },
            ]
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
      {
        id: 2,
        title: "Second sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
    ]
  },
  {
    id: 2,
    title: "2nd Year",
    semesters: "Semester 3 • 4",
    semester: [
      {
        id: 1,
        title: "Third sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
      {
        id: 2,
        title: "Fourth sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
    ]
  },
  {
    id: 3,
    title: "3rd Year",
    semesters: "Semester 5 • 6",
    semester: [
      {
        id: 1,
        title: "Fifth sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
      {
        id: 2,
        title: "Sixth sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
    ]
  },
  {
    id: 4,
    title: "4th Year",
    semesters: "Semester 7 • 8",
    semester: [
      {
        id: 1,
        title: "Seventh sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
      {
        id: 2,
        title: "Eighth sem",
        branch: [
          {
            id: 1,
            title: "CSE"
          },
          {
            id: 2,
            title: "IT"
          },
          {
            id: 3,
            title: "ECE"
          },
          {
            id: 4,
            title: "EE"
          },
          {
            id: 5,
            title: "ME"
          },
          {
            id: 6,
            title: "Civil"
          },
        ]
      },
    ]
  },
]
},]
