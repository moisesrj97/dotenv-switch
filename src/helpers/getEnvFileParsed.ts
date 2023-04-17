import fs from 'fs';

export type EnvJsonFile = {
  name: string;
  values: string[];
}[];

export default function getEnvJSONFileParsed() {
  return JSON.parse(fs.readFileSync('./env.json', 'utf8')) as EnvJsonFile;
}
