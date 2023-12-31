import 'dotenv/config'
import { z } from 'zod'

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  PORT: z.coerce.number().default(3333),
  GITHUB_API_URL: z.string(),
  GITHUB_ACCESS_TOKEN: z.string(),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.log(
    '❌ Environment variables setup incorrectly. ',
    _env.error.format(),
  )

  throw new Error('Environment variables setup incorrectly.')
}

export const env = _env.data
