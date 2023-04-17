import fs from 'fs';
import createEnvJson from './flows/createEnvJson.js';
import inquirer from 'inquirer';
import getEnvJSONFileParsed from './helpers/getEnvFileParsed.js';
import getDotEnvFileParsed from './helpers/getDotEnvFileParsed.js';

(async () => {
  const envJsonExists = fs.existsSync('./env.json');

  if (!envJsonExists) {
    await createEnvJson();
    console.log('Please run the script again.');
    return;
  }

  const envFileExists = fs.existsSync('./.env');

  if (!envFileExists) {
    console.log('No .env file found. Please create one.');
    return;
  }

  const parsedEnvFile = getDotEnvFileParsed();

  const parsedEnvJson = getEnvJSONFileParsed();

  const { variable } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select a variable to update',
      name: 'variable',
      choices: Array.from(parsedEnvFile.keys()),
    },
  ]);

  const envJsonField = parsedEnvJson.find((item) => item.name === variable);

  if (!envJsonField) {
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

    return;
  }

  const { value } = await inquirer.prompt([
    {
      type: 'list',
      message: 'Select a value to update',
      name: 'value',
      choices: envJsonField?.values || [],
    },
  ]);

  fs.copyFileSync('./.env', './.env.bak');

  const envFileWithNewValue = fs
    .readFileSync('./.env', 'utf8')
    .split('\n')
    .map((line) =>
      line.includes(`${variable}=`) ? `${variable}=${value}` : line
    )
    .join('\n');

  fs.writeFileSync('./.env', envFileWithNewValue);
})();
