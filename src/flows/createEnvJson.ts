import inquirer from 'inquirer';
import fs from 'fs';
import { dirname, resolve } from 'path';
import { fileURLToPath } from 'url';
import getDotEnvFileParsed from '../helpers/getDotEnvFileParsed.js';

export default async function createEnvJson() {
  const { createEnvJson } = await inquirer.prompt([
    {
      type: 'confirm',
      message: 'env.json does not exist. Do you want to create it?',
      default: true,
      name: 'createEnvJson',
    },
  ]);

  if (!createEnvJson) {
    return;
  }

  const { origin } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Where do you want to get the initial values from?',
      default: true,
      name: 'origin',
      choices: ['Create a sample one', 'Import .env file'],
    },
  ]);

  if (origin === 'Create a sample one') {
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);

    const sampleEnvJson = fs.readFileSync(
      resolve(__dirname, '../example-env.json'),
      'utf8'
    );

    fs.writeFileSync('./env.json', sampleEnvJson);
    console.log('env.json created');
    return;
  }

  const parsedEnvFile = getDotEnvFileParsed();

  const arrayOfVariables = Array.from(parsedEnvFile.entries()).map(
    ([key, value]) => ({
      name: key,
      values: [value],
    })
  );

  fs.writeFileSync('./env.json', JSON.stringify(arrayOfVariables, null, 2));
  console.log('env.json created');
}
