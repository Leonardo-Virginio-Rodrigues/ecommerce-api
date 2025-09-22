import bcrypt from "bcrypt";

const SALT_ROUNDS = 12;

//Create password hash
export async function hashPassword(plain: string): Promise<string> {
  const salt = await bcrypt.genSalt(SALT_ROUNDS);
  return bcrypt.hash(plain, salt);
}

//Verify password
export async function verifyPassword(
  plain: string,
  hash: string
): Promise<boolean> {
  return bcrypt.compare(plain, hash);
}
