#!/usr/bin/env node

import fs from "fs-extra";
import path from "path";
import { Command } from "commander";
import inquirer from "inquirer";
import chalk from "chalk";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const program = new Command();

type PackageManager = "npm" | "pnpm" | "yarn" | "bun";

program
  .name("create-100x-turbo")
  .description("A new Turborepo with a predefined structure")
  .argument("[project-name]", "Name of the project")
  .action(async (projectName: string) => {
    if (!projectName) {
      const { name } = await inquirer.prompt<{ name: string }>([
        {
          type: "input",
          name: "name",
          message: "What is the name of your project?",
        },
      ]);
      projectName = name;
    }

    const { packageManager } = await inquirer.prompt<{
      packageManager: PackageManager;
    }>([
      {
        type: "list",
        name: "packageManager",
        message: "Which package manager do you want to use?",
        choices: ["npm", "pnpm", "yarn", "bun"],
      },
    ]);

    const templatePath = path.join(__dirname, "../turbo-starter");
    const destinationPath = path.join(process.cwd(), projectName);

    try {
      await fs.copy(templatePath, destinationPath);

      const packageJsonPath = path.join(destinationPath, "package.json");
      const packageJson = await fs.readJson(packageJsonPath);
      packageJson.name = projectName;
      await fs.writeJson(packageJsonPath, packageJson, { spaces: 2 });

      console.log(chalk.green(`🚀 Successfully created "${projectName}"!`));
      console.log(chalk.blue(`👉 Next steps:`));
      console.log(chalk.blue(`cd ${projectName}`));

      switch (packageManager) {
        case "npm":
          console.log(chalk.blue(`npm install`));
          console.log(chalk.blue(`npm run dev`));
          break;
        case "pnpm":
          console.log(chalk.blue(`pnpm install`));
          console.log(chalk.blue(`pnpm run dev`));
          break;
        case "yarn":
          console.log(chalk.blue(`yarn install`));
          console.log(chalk.blue(`yarn run dev`));
          break;
      }
    } catch (err) {
      console.error(chalk.red("❌ Error creating project:", err));
    }
  });

program.parse(process.argv);
