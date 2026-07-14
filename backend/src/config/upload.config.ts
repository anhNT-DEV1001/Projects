import { registerAs } from '@nestjs/config';

function parseNumber(value: string | undefined, fallback: number): number {
  if (value === undefined) {
    return fallback;
  }

  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? fallback : parsed;
}

export default registerAs('upload', () => ({
  dir: process.env.UPLOAD_DIR || 'uploads',
  avatarDir: process.env.AVATAR_UPLOAD_DIR || 'avatars',
  maxAvatarSizeMb: parseNumber(process.env.MAX_AVATAR_SIZE_MB, 5),
}));
