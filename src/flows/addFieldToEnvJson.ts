import inquirer from 'inquirer';
import fs from 'fs';
import { EnvJsonFile } from '../helpers/getEnvFileParsed.js';

export default async function addFieldToEnvJson(
  variable: string,
  parsedEnvJson: EnvJsonFile,
  parsedEnvFile: Map<string, string>
) {
  const { addVariable } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'Variable not found in env.json. Do you want to add it?',
      name: 'addVariable',
      default: true,
    },
  ]);

  if (addVariable) {
    const newVariable = {
      name: variable,
      values: [parsedEnvFile.get(variable) as string],
    };
    parsedEnvJson.push(newVariable);
    fs.writeFileSync('./env.json', JSON.stringify(parsedEnvJson, null, 2));
  }
}
