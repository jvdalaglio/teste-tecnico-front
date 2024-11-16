import fs from 'fs';
import path from 'path';

export const getData = async () => {
  const filePath = path.join(process.cwd(), 'public', 'data', 'full_data.json');

  try {
    const jsonData = fs.readFileSync(filePath, 'utf-8');
    return JSON.parse(jsonData);
  } catch (error) {
    console.error('Erro ao ler o arquivo JSON:', error);
    throw new Error('Erro ao carregar os dados');
  }
};
