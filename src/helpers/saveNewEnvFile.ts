import fs from 'fs';

export default async function saveNewEnvFile(variable: string, value: string) {
  fs.copyFileSync('./.env', './.env.bak');

  const envFileWithNewValue = fs
    .readFileSync('./.env', 'utf8')
    .split('\n')
    .map((line) =>
      line.includes(`${variable}=`) ? `${variable}=${value}` : line
    )
    .join('\n');

  fs.writeFileSync('./.env', envFileWithNewValue);
}
