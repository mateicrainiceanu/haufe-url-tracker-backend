import bcrypt from "bcrypt";
const saltRounds = Number(process.env.SALT_ROUNDS) || 11;

export function hashPassword(pssw) {
    return bcrypt.hash(pssw, saltRounds)
}

export function matchesHash(pssw, hash) {
    return bcrypt.compare(pssw, hash);
}