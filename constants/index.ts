import type { Resume } from "~/types";

export const resumes: Resume[] = [
    {
        id: "1",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "2",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "3",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "4",
        companyName: "Google",
        jobTitle: "Frontend Developer",
        imagePath: "/images/resume_01.png",
        resumePath: "/resumes/resume-1.pdf",
        feedback: {
            overallScore: 85,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "5",
        companyName: "Microsoft",
        jobTitle: "Cloud Engineer",
        imagePath: "/images/resume_02.png",
        resumePath: "/resumes/resume-2.pdf",
        feedback: {
            overallScore: 55,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
    {
        id: "6",
        companyName: "Apple",
        jobTitle: "iOS Developer",
        imagePath: "/images/resume_03.png",
        resumePath: "/resumes/resume-3.pdf",
        feedback: {
            overallScore: 75,
            ATS: {
                score: 90,
                tips: [],
            },
            toneAndStyle: {
                score: 90,
                tips: [],
            },
            content: {
                score: 90,
                tips: [],
            },
            structure: {
                score: 90,
                tips: [],
            },
            skills: {
                score: 90,
                tips: [],
            },
        },
    },
];

export const AIResponseFormat = `
      interface Feedback {
      overallScore: number; //max 100
      ATS: {
        score: number; //rate based on ATS suitability
        tips: {
          type: "good" | "improve";
          tip: string; //give 3-4 tips
        }[];
      };
      toneAndStyle: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      content: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      structure: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
      skills: {
        score: number; //max 100
        tips: {
          type: "good" | "improve";
          tip: string; //make it a short "title" for the actual explanation
          explanation: string; //explain in detail here
        }[]; //give 3-4 tips
      };
    }`;

export const prepareInstructions = ({jobTitle, jobDescription}: { jobTitle: string; jobDescription: string; }) =>
    `You are an expert in ATS (Applicant Tracking System) and resume analysis.
      Please analyze and rate this resume and suggest how to improve it.
      The rating can be low if the resume is bad.
      Be thorough and detailed. Don't be afraid to point out any mistakes or areas for improvement.
      If there is a lot to improve, don't hesitate to give low scores. This is to help the user to improve their resume.
      If available, use the job description for the job user is applying to to give more detailed feedback.
      If provided, take the job description into consideration.
      The job title is: ${jobTitle}
      The job description is: ${jobDescription}
      Provide the feedback using the following format:
      ${AIResponseFormat}
      Return the analysis as an JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

export const HRReviewResponseFormat = `
      interface HRReview {
      overallSuitability: string; // 1-2 sentence summary
      skillAlignment: {
        matchedSkills: string[]; // list of skills that match
        missingSkills: string[]; // list of skills that are missing
      };
      experienceReview: string; // detailed review of experience relevance
      suggestions: string[]; // 3-5 actionable improvement tips
      roleFitScore: number; // 0-100 score
    }`;

export const prepareHRInstructions = ({jobTitle, jobDescription}: { jobTitle: string; jobDescription: string; }) =>
    `You are an experienced HR professional reviewing a candidate's resume for a specific role.
      Be thorough, professional, and provide actionable feedback.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      
      Write a structured HR review including:
      - Overall Suitability: A 1-2 sentence summary of how well the resume matches the role
      - Skill Alignment: List matched skills and missing skills that would be beneficial
      - Experience Review: How relevant and strong the experience is for this role
      - Suggestions for Improvement: 3-5 actionable tips to improve candidacy
      - A Role Fit Score: 0-100 rating based on overall match
      
      Be honest but constructive. If the candidate is a poor fit, explain why and suggest improvements.
      If they're a strong fit, highlight what makes them stand out.
      
      Provide the review using the following format:
      ${HRReviewResponseFormat}
      Return the analysis as a JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;

export const ImprovedResumeFormat = `
      interface ImprovedResume {
      summary: string; // Professional summary optimized for the role
      skills: string[]; // Array of relevant skills
      experience: string; // Rewritten experience section with stronger results
      education: string; // Education section
      estimatedScore: number; // Estimated role fit score after improvement (80-100)
    }`;

export const prepareImprovementInstructions = ({
  jobTitle,
  jobDescription,
  hrFeedback,
}: {
  jobTitle: string;
  jobDescription: string;
  hrFeedback: string;
}) =>
    `You are an expert resume writer and HR recruiter specializing in ATS optimization.
      The candidate's HR feedback indicates areas for improvement.
      
      Job Title: ${jobTitle}
      Job Description: ${jobDescription}
      HR Feedback: ${hrFeedback}
      
      Rewrite the resume to significantly increase its Role Fit Score (target: 85-95).
      Focus on:
      1. Adding relevant keywords for "${jobTitle}" naturally throughout
      2. Quantifying achievements with metrics (%, $, numbers)
      3. Strengthening action verbs and impact statements
      4. Highlighting skills mentioned in the job description
      5. Making content more ATS-friendly and scannable
      6. Professional tone appropriate for the industry
      
      Output a complete improved resume with these sections:
      - Summary: 2-3 sentences highlighting relevant experience and value proposition
      - Skills: Array of 8-12 relevant technical and soft skills
      - Experience: Rewritten work history with bullet points focusing on achievements
      - Education: Degree(s), institution(s), and relevant certifications
      - EstimatedScore: Predicted role fit score after these improvements (85-95)
      
      Provide the improved resume using the following format:
      ${ImprovedResumeFormat}
      Return the result as a JSON object, without any other text and without the backticks.
      Do not include any other text or comments.`;
