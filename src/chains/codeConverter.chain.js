import { ChatGroq } from "langchain/chat_models/groq";
import {
  HumanMessagePromptTemplate,
  AIMessagePromptTemplate,
  ChatPromptTemplate,
  FewShotChatMessagePromptTemplate,
} from "@langchain/core/prompts";

const systemPrompt =
  "You are an expert programmer trained in various programming languages such as C, C++, JavaScript, Java, Python, Go, etc. Your job is to convert the code given by the user into the target language specified by the user.";

// Few-shot examples
const examples = [
  {
    input: JSON.stringify({
      code: `#include <iostream>\nusing namespace std;\nint main()\n{\n\tcout << "Hello World" << endl;\n\treturn 0;\n}`,
      target_language: "python",
    }),
    output: `def main():\n    print("Hello World")\n\nif __name__ == "__main__":\n    main()`,
  },
  {
    input: JSON.stringify({
      code: `print('Hello, World!')`,
      target_language: "javascript",
    }),
    output: `console.log("Hello, World!");`,
  },
  {
    input: JSON.stringify({
      code: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
      target_language: "go",
    }),
    output: `package main\n\nimport "fmt"\n\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
  },
  {
    input: JSON.stringify({
      code: `function greet() {\n  console.log('Hello, World!');\n}`,
      target_language: "c++",
    }),
    output: `#include <iostream>\nusing namespace std;\n\nvoid greet() {\n    cout << "Hello, World!" << endl;\n}\n\nint main() {\n    greet();\n    return 0;\n}`,
  },
  {
    input: JSON.stringify({
      code: `package main\nimport "fmt"\nfunc main() {\n    fmt.Println("Hello, World!")\n}`,
      target_language: "java",
    }),
    output: `public class HelloWorld {\n    public static void main(String[] args) {\n        System.out.println("Hello, World!");\n    }\n}`,
  },
];

const examplePrompt = new ChatPromptTemplate({
  promptMessages: [
    HumanMessagePromptTemplate.fromTemplate("{input}"),
    AIMessagePromptTemplate.fromTemplate("{output}"),
  ],
  inputVariables: ["input", "output"],
});

const fewShotPrompt = new FewShotChatMessagePromptTemplate({
  examplePrompt,
  examples,
  inputVariables: [],
});

async function main() {
  const fewShotMessages = await fewShotPrompt.formatMessages({});

  const userPrompt = HumanMessagePromptTemplate.fromTemplate(
    "Convert the following code:\n\n{code}\n\nto {targetLanguage}"
  );

  const code = `print("hello World!")`;
  const targetLanguage = `javascript`;

  const userMessages = await userPrompt.formatMessages({ code, targetLanguage });

  const model = new ChatGroq({
    apiKey: "YOUR_GROQ_API_KEY",
    model: "llama3-70b-8192", // or "mixtral-8x7b-32768"
    temperature: 0.3,
  });

  const allMessages = [
    { role: "system", content: systemPrompt },
    ...fewShotMessages,
    ...userMessages,
  ];

  const response = await model.invoke(allMessages);

  console.log("Converted Code:\n", response.content);
}

main().catch(console.error);