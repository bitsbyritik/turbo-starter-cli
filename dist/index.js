"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = __importDefault(require("fs-extra"));
const path_1 = __importDefault(require("path"));
const commander_1 = require("commander");
const inquirer_1 = __importDefault(require("inquirer"));
const chalk_1 = __importDefault(require("chalk"));
const program = new commander_1.Command();
program
    .name("create-100x-turbo")
    .description("A new Turborepo with a predefined structure")
    .argument("[project-name]", "Name of the project")
    .action(async (projectName) => {
    if (!projectName) {
        const { name } = await inquirer_1.default.prompt([
            {
                type: "input",
                name: "name",
                message: "What is the name of your project?",
            },
        ]);
        projectName = name;
    }
    const { packageManager } = await inquirer_1.default.prompt([
        {
            type: "list",
            name: "packageManager",
            message: "Which package manager do you want to use?",
            choices: ["npm", "pnpm", "yarn", "bun"],
        },
    ]);
    const templatePath = path_1.default.join(__dirname, "../turbo-starter");
    const destinationPath = path_1.default.join(process.cwd(), projectName);
    try {
        await fs_extra_1.default.copy(templatePath, destinationPath);
        const packageJsonPath = path_1.default.join(destinationPath, "package.json");
        const packageJson = await fs_extra_1.default.readJson(packageJsonPath);
        packageJson.name = projectName;
        await fs_extra_1.default.writeJson(packageJsonPath, packageJson, { spaces: 2 });
        console.log(chalk_1.default.green(`🚀 Successfully created "${projectName}"!`));
        console.log(chalk_1.default.blue(`👉 Next steps:`));
        console.log(chalk_1.default.blue(`cd ${projectName}`));
        switch (packageManager) {
            case "npm":
                console.log(chalk_1.default.blue(`npm install`));
                console.log(chalk_1.default.blue(`npm run dev`));
                break;
            case "pnpm":
                console.log(chalk_1.default.blue(`pnpm install`));
                console.log(chalk_1.default.blue(`pnpm run dev`));
                break;
            case "yarn":
                console.log(chalk_1.default.blue(`yarn install`));
                console.log(chalk_1.default.blue(`yarn run dev`));
                break;
        }
    }
    catch (err) {
        console.error(chalk_1.default.red("❌ Error creating project:", err));
    }
});
program.parse(process.argv);
