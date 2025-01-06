import { getRandomValues } from 'crypto';

export default function getDigit() {
  const random = getRandomValues(new Uint8Array(4));
  const digitCode = random.join('').slice(0, 4);
  return digitCode;
}
