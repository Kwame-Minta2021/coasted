export type AgeBand = '6-9' | '10-13' | '14-17';

export const COURSES = [
  {
    id: '6-9',
    title: 'Ages 6–9 · Spark Curiosity & Creativity',
    oneTime: 650,
    monthly: 200,
    content: [
      'Creative Thinking & Imagination Lab',
      'Critical Thinking & Problem Identification',
      'Coding with Blocks (ScratchJr / Blockly)',
      'Digital Play & Simple Robotics',
      'Math Adventures (games & logic)',
      'Intro to AI (story‑based)',
    ],
    benefits: [
      'Free Robotics Starter Kit delivered',
      'Access to recorded courses',
      'Weekly online fun meet‑ups',
    ],
  },
  {
    id: '10-13',
    title: 'Ages 10–13 · Build Skills & Confidence',
    oneTime: 750,
    monthly: 250,
    content: [
      'Problem Solving & Logical Reasoning',
      'Python Programming Basics',
      'Robotics Fundamentals (sensors & movement)',
      'Creative AI mini‑projects',
      'STEM in Real Life projects',
      'Teamwork & Presentation',
    ],
    benefits: [
      'Robotics Kit with sensors',
      'Recorded tutorials & challenges',
      'Weekly coding clubs & hackathons',
    ],
  },
  {
    id: '14-17',
    title: 'Ages 14–17 · Innovate & Launch',
    oneTime: 800,
    monthly: 299,
    content: [
      'Programming & Cybersecurity (Python, JavaScript)',
      'Applied Robotics & AI (vision, automation)',
      'Tech Entrepreneurship',
      'Research & Social Problem Solving',
      'Design Thinking & Prototyping',
      'Capstone Project',
    ],
    benefits: [
      'Advanced Robotics Kit',
      'Recorded masterclasses',
      'Weekly innovation meet‑ups',
    ],
  },
] as const;
