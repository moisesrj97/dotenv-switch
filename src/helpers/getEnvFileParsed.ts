import fs from 'fs';

export default function getEnvJSONFileParsed() {
  return JSON.parse(fs.readFileSync('./env.json', 'utf8')) as {
    name: string;
    values: string[];
  }[];
}
