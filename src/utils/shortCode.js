const CHARACTERS =
  "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

export function generateShortCode(length = 6) {
  let result = "";

  for (let i = 0; i < length; i++) {
    const index = Math.floor(Math.random() * CHARACTERS.length);

    result += CHARACTERS[index];
  }

  return result;
}

