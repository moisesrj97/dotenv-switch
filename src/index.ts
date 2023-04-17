import fs from 'fs';
import createEnvJson from './flows/createEnvJson.js';
import inquirer from 'inquirer';
import getEnvJSONFileParsed from './helpers/getEnvFileParsed.js';
import getDotEnvFileParsed from './helpers/getDotEnvFileParsed.js';
import addFieldToEnvJson from './flows/addFieldToEnvJson.js';
import saveNewEnvFile from './helpers/saveNewEnvFile.js';

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

  const [parsedEnvFile, parsedEnvJson] = [
    getDotEnvFileParsed(),
    getEnvJSONFileParsed(),
  ];

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
    addFieldToEnvJson(variable, parsedEnvJson, parsedEnvFile);
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

  await saveNewEnvFile(variable, value);
})();
