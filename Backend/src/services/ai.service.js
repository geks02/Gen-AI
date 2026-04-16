// const { GoogleGenAI } = require("@google/genai");

// const ai = new GoogleGenAI({
//   apiKey: process.env.GOOGLE_GENAI_API_KEY,
// });

// async function generateInterviewReport({
//   resume,
//   selfDescription,
//   jobDescription,
// }) {
//   // Aapka behtareen prompt intact rakha gaya hai taaki AI empty array na de
//   const prompt = `
// You are an expert technical interviewer and recruiter. Analyze the candidate's profile and generate a highly detailed interview report.

// CRITICAL INSTRUCTIONS:
// 1. You MUST generate exactly 5 technical questions.
// 2. You MUST generate exactly 3 behavioral questions.
// 3. You MUST identify at least 2 skill gaps based on the job description.
// 4. You MUST generate a step-by-step preparation plan spanning at least 5 days.
// DO NOT leave any array empty.

// Candidate Resume:
// ${resume}

// Candidate Self Description:
// ${selfDescription}

// Job Description:
// ${jobDescription}
// `;

//   const response = await ai.models.generateContent({
//     model: "gemini-3-flash-preview", // Note: gemini-2.5-flash JSON schema ke liye zyada stable hai
//     contents: prompt,
//     config: {
//       responseMimeType: "application/json",
//       // Upar wale code ka strict native JSON Schema yahan add kar diya hai
//       responseSchema: {
//         type: "OBJECT",
//         properties: {
//           matchScore: { type: "NUMBER", description: "Score out of 100" },
//           title: { type: "STRING", description: "The title of the job for which the interview report is generated" },
//           technicalQuestions: {
//             type: "ARRAY",
//             items: {
//               type: "OBJECT",
//               properties: {
//                 question: { type: "STRING" },
//                 intention: { type: "STRING" },
//                 answer: { type: "STRING" },
//               },
//               required: ["question", "intention", "answer"],
//             },
//           },
//           behavioralQuestions: {
//             type: "ARRAY",
//             items: {
//               type: "OBJECT",
//               properties: {
//                 question: { type: "STRING" },
//                 intention: { type: "STRING" },
//                 answer: { type: "STRING" },
//               },
//               required: ["question", "intention", "answer"],
//             },
//           },
//           skillGap: {
//             type: "ARRAY",
//             items: {
//               type: "OBJECT",
//               properties: {
//                 skill: { type: "STRING" },
//                 severity: { type: "STRING", enum: ["low", "medium", "high"] },
//               },
//               required: ["skill", "severity"],
//             },
//           },
//           preparationPlan: {
//             type: "ARRAY",
//             items: {
//               type: "OBJECT",
//               properties: {
//                 day: { type: "INTEGER" },
//                 focus: { type: "STRING" },
//                 tasks: { type: "ARRAY", items: { type: "STRING" } },
//               },
//               required: ["day", "focus", "tasks"],
//             },
//           },
//         },
//         required: [
//           "matchScore",
//           "title",
//           "technicalQuestions",
//           "behavioralQuestions",
//           "skillGap",
//           "preparationPlan",
//         ],
//       },
//     },
//   });

//   // Debugging ke liye log
//   console.log("Strict AI JSON Output:", response.text);

//   return JSON.parse(response.text);
// }

// module.exports = generateInterviewReport;

const { GoogleGenAI } = require("@google/genai");
const puppeteer = require("puppeteer");

const ai = new GoogleGenAI({
  apiKey: process.env.GOOGLE_GENAI_API_KEY,
});

async function generateInterviewReport({
  resume,
  selfDescription,
  jobDescription,
}) {
  // Aapka behtareen prompt intact rakha gaya hai taaki AI empty array na de
  const prompt = `
You are an expert technical interviewer and recruiter. Analyze the candidate's profile and generate a highly detailed interview report.

CRITICAL INSTRUCTIONS:
1. You MUST generate exactly 5 technical questions.
2. You MUST generate exactly 3 behavioral questions.
3. You MUST identify at least 2 skill gaps based on the job description.
4. You MUST generate a step-by-step preparation plan spanning at least 5 days.
DO NOT leave any array empty.

Candidate Resume: 
${resume}

Candidate Self Description: 
${selfDescription}

Job Description: 
${jobDescription}
`;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview", // Note: gemini-2.5-flash JSON schema ke liye zyada stable hai
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // Upar wale code ka strict native JSON Schema yahan add kar diya hai
      responseSchema: {
        type: "OBJECT",
        properties: {
          matchScore: { type: "NUMBER", description: "Score out of 100" },
          title: {
            type: "STRING",
            description:
              "The title of the job for which the interview report is generated",
          },
          technicalQuestions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                intention: { type: "STRING" },
                answer: { type: "STRING" },
              },
              required: ["question", "intention", "answer"],
            },
          },
          behavioralQuestions: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                question: { type: "STRING" },
                intention: { type: "STRING" },
                answer: { type: "STRING" },
              },
              required: ["question", "intention", "answer"],
            },
          },
          skillGap: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                skill: { type: "STRING" },
                severity: { type: "STRING", enum: ["low", "medium", "high"] },
              },
              required: ["skill", "severity"],
            },
          },
          preparationPlan: {
            type: "ARRAY",
            items: {
              type: "OBJECT",
              properties: {
                day: { type: "INTEGER" },
                focus: { type: "STRING" },
                tasks: { type: "ARRAY", items: { type: "STRING" } },
              },
              required: ["day", "focus", "tasks"],
            },
          },
        },
        required: [
          "matchScore",
          "title",
          "technicalQuestions",
          "behavioralQuestions",
          "skillGap",
          "preparationPlan",
        ],
      },
    },
  });

  // Debugging ke liye log
  console.log("Strict AI JSON Output:", response.text);

  return JSON.parse(response.text);
}

// --- MISSING CODE ADDED BELOW THIS LINE ---

async function generatePdfFromHtml(htmlContent) {
  const browser = await puppeteer.launch();
  const page = await browser.newPage();
  await page.setContent(htmlContent, { waitUntil: "networkidle0" });

  const pdfBuffer = await page.pdf({
    format: "A4",
    margin: {
      top: "20mm",
      bottom: "20mm",
      left: "15mm",
      right: "15mm",
    },
  });

  await browser.close();

  return pdfBuffer;
}

async function generateResumePdf({ resume, selfDescription, jobDescription }) {
  const prompt = `Generate resume for a candidate with the following details:
                        Resume: ${resume}
                        Self Description: ${selfDescription}
                        Job Description: ${jobDescription}

                        the response should be a JSON object with a single field "html" which contains the HTML content of the resume which can be converted to PDF using any library like puppeteer.
                        The resume should be tailored for the given job description and should highlight the candidate's strengths and relevant experience. The HTML content should be well-formatted and structured, making it easy to read and visually appealing.
                        The content of resume should be not sound like it's generated by AI and should be as close as possible to a real human-written resume.
                        you can highlight the content using some colors or different font styles but the overall design should be simple and professional.
                        The content should be ATS friendly, i.e. it should be easily parsable by ATS systems without losing important information.
                        The resume should not be so lengthy, it should ideally be 1-2 pages long when converted to PDF. Focus on quality rather than quantity and make sure to include all the relevant information that can increase the candidate's chances of getting an interview call for the given job description.
                    `;

  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: prompt,
    config: {
      responseMimeType: "application/json",
      // Zod hata kar native schema use kiya gaya hai taaki format consistent rahe
      responseSchema: {
        type: "OBJECT",
        properties: {
          html: {
            type: "STRING",
            description:
              "The HTML content of the resume which can be converted to PDF",
          },
        },
        required: ["html"],
      },
    },
  });

  const jsonContent = JSON.parse(response.text);

  const pdfBuffer = await generatePdfFromHtml(jsonContent.html);

  return pdfBuffer;
}

// Updated exports to include both functions
module.exports = { generateInterviewReport, generateResumePdf };
