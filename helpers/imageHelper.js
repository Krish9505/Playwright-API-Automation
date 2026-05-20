// helper/imageToBase64.js
import fs from 'fs';
import path from 'path';

/**
 * Convert image file to base64 string
 * @param {string} imagePath - Relative or absolute path to image
 * @returns {string} Base64 encoded string
 */
export function imageToBase64(imagePath) {
  const absolutePath = path.isAbsolute(imagePath) 
    ? imagePath 
    : path.join(process.cwd(), imagePath);
  
  const imageBuffer = fs.readFileSync(absolutePath);
  return imageBuffer.toString('base64');
}