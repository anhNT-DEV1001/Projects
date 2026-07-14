import { registerAs } from '@nestjs/config';

export default registerAs('rateLimit', () => ({
  burst: {
    ttlSeconds: Number.parseInt(process.env.RATE_LIMIT_BURST_TTL ?? '10', 10),
    limit: Number.parseInt(process.env.RATE_LIMIT_BURST_LIMIT ?? '30', 10),
    blockSeconds: Number.parseInt(
      process.env.RATE_LIMIT_BURST_BLOCK ?? '10',
      10,
    ),
  },
  sustained: {
    ttlSeconds: Number.parseInt(
      process.env.RATE_LIMIT_SUSTAINED_TTL ?? '60',
      10,
    ),
    limit: Number.parseInt(process.env.RATE_LIMIT_SUSTAINED_LIMIT ?? '120', 10),
    blockSeconds: Number.parseInt(
      process.env.RATE_LIMIT_SUSTAINED_BLOCK ?? '60',
      10,
    ),
  },
}));
