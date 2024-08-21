import { readFileSync, writeFileSync } from 'fs';
import { createHash } from 'crypto';

async function updateCaskChecksums() {
  const caskPath = './paip.rb';
  let caskContent = readFileSync(caskPath, 'utf-8');

  // Define the files and their corresponding regex patterns in the cask file
  const files = [
    { name: 'paip-macos-x64', regex: /(url\s+"[^"]+paip-macos-x64"[\s\S]*?sha256\s+")([a-f0-9]{64})(")/ },
    { name: 'paip-macos-arm64', regex: /(url\s+"[^"]+paip-macos-arm64"[\s\S]*?sha256\s+")([a-f0-9]{64})(")/ },
    { name: 'paip-linux-x64', regex: /(url\s+"[^"]+paip-linux-x64"[\s\S]*?sha256\s+")([a-f0-9]{64})(")/ },
    { name: 'paip-linux-arm64', regex: /(url\s+"[^"]+paip-linux-arm64"[\s\S]*?sha256\s+")([a-f0-9]{64})(")/ },
  ];

  for (const file of files) {
    try {
      // Calculate SHA256 checksum
      const fileContent = readFileSync(`./${file.name}`);
      const hash = createHash('sha256');
      hash.update(fileContent);
      const sha256 = hash.digest('hex');

      // Update cask content
      caskContent = caskContent.replace(file.regex, `$1${sha256}$3`);

      console.log(`Updated SHA256 for ${file.name}: ${sha256}`);
    } catch (error) {
      console.error(`Error processing ${file.name}: ${(error as Error).message}`);
    }
  }

  // Write updated content back to the cask file
  writeFileSync(caskPath, caskContent, 'utf-8');
  console.log('Cask file updated successfully.');
}

if (import.meta.main) {
  await updateCaskChecksums();
}