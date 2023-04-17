import fs from 'fs';

export default function getDotEnvFileParsed() {
  return new Map(
    fs
      .readFileSync('./.env', 'utf8')
      .split('\n')
      .filter((line) => line.includes('='))
      .map((line) => {
        const [key, ...value] = line.split('=');
        return [key, value.join('=')];
      })
  );
}
