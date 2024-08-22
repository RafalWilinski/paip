import { anthropic } from "@ai-sdk/anthropic";
import { openai } from "@ai-sdk/openai";
import { generateText } from "ai";
import { $, ShellError } from "bun";

const OPENAI_API_KEY = process.env.OPENAI_API_KEY;
const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;

const prompt = `You are an expert Python programmer tasked with helping users resolve issues encountered during package installation using pip. Your goal is to analyze the output from a pip install or related command and recommend the next command to run in order to fix any problems.

Here is the output from the pip command:

<pip_output>
{{PIP_OUTPUT}}
</pip_output>

Additional context:
Current directory: {{CURRENT_DIR}}
Username: {{USERNAME}}

Carefully analyze the provided pip output. Look for error messages, warnings, or any indications of issues that prevented successful installation. Pay attention to:

1. Package name and version
2. Python version compatibility
3. Dependency conflicts
4. Permission errors
5. Network-related issues
6. Any other error messages or warnings

Based on your analysis, determine the most likely cause of the problem and formulate the next command that the user should run to resolve the issue. Consider the following options:

1. Upgrading pip
2. Installing dependencies
3. Using a virtual environment
4. Specifying a different package version
5. Addressing permission issues
6. Clearing pip cache
7. Using alternative installation methods (e.g., from source)

Provide your recommendation in the following format:

<recommendation>
<explanation>
Briefly explain the issue identified in the pip output and why you're recommending the following command.
</explanation>
<command>
Write the exact command the user should run next, including any necessary flags or options. Must be a valid pip command. Must have everything specified not leaving anything to the user to guess or fill out. Always use pip3.
</command>
</recommendation>

Ensure that your explanation is clear and concise, and that the recommended command is accurate and appropriate for addressing the specific issue identified in the pip output. Consider the current directory and username when formulating your recommendation if relevant.`;

async function getLLMSuggestion(error: string): Promise<Recommendation> {
  const currentDir = process.cwd();
  const username = process.env.USER || process.env.USERNAME || "unknown";

  const { text } = await generateText({
    model: ANTHROPIC_API_KEY
      ? anthropic("claude-3-5-sonnet-20240620")
      : openai("gpt-4o-mini"),
    prompt: prompt
      .replace("{{PIP_OUTPUT}}", error)
      .replace("{{CURRENT_DIR}}", currentDir)
      .replace("{{USERNAME}}", username),
  });

  return parseRecommendation(text)!;
}

interface Recommendation {
  explanation: string;
  command: string;
}

function parseRecommendation(output: string): Recommendation | null {
  const recommendationMatch = output.match(
    /<recommendation>([\s\S]*?)<\/recommendation>/,
  );

  if (!recommendationMatch) {
    return null;
  }

  const recommendationContent = recommendationMatch[1];

  const explanationMatch = recommendationContent.match(
    /<explanation>([\s\S]*?)<\/explanation>/,
  );
  const commandMatch = recommendationContent.match(
    /<command>([\s\S]*?)<\/command>/,
  );

  if (!explanationMatch || !commandMatch) {
    return null;
  }

  return {
    explanation: explanationMatch[1].trim(),
    command: commandMatch[1].trim(),
  };
}

async function smartPipInstall(args: string[]) {
  let command = [
    "pip3",
    "install",
    ...(args[0] === "install" ? args.slice(1) : args),
  ];

  if (!OPENAI_API_KEY && !ANTHROPIC_API_KEY) {
    console.error(
      "Neither OPENAI_API_KEY nor ANTHROPIC_API_KEY is set. Please set one of them.",
    );
    process.exit(1);
  }

  while (true) {
    try {
      const output = await $`${command}`.text();
      console.log("Installation successful!");
      console.log(output);
      break;
    } catch (err) {
      if (err instanceof Error) {
        console.error(`Error occurred: ${(err as ShellError).stderr}`);

        const suggestion = await getLLMSuggestion(
          `${err.message}\n\n${(err as ShellError).stderr}`,
        );
        console.log("LLM Explanation: ", suggestion.explanation);
        console.log("-----------------------------------");
        console.log(`LLM suggestion: ${suggestion.command}`);

        command = suggestion.command.split(/\s+/);
      } else {
        console.error("An unexpected error occurred");
        break;
      }
    }
  }
}

if (import.meta.main) {
  const args = Bun.argv.slice(2);
  if (args.length === 0) {
    console.log("Usage: paip (install) [pip3 install arguments]");
    process.exit(1);
  }

  await smartPipInstall(args);
  process.exit(0);
}