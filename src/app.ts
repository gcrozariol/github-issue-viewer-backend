import { ZodError } from 'zod'
import fastify, { FastifyRequest } from 'fastify'
import cors, { FastifyCorsOptions } from '@fastify/cors'

import { env } from './env'
import { reposRoutes } from './http/controllers/repos/routes'
import { issuesRoutes } from './http/controllers/issues/routes'

export const app = fastify()

app.register(cors, () => {
  return (
    req: FastifyRequest,
    cb: (error: Error | null, corsOptions: FastifyCorsOptions) => void,
  ) => {
    const corsOptions: FastifyCorsOptions = {
      origin: true,
    }

    if (
      env.NODE_ENV === 'production' ||
      /^localhost$/m.test(req.headers.origin as string)
    ) {
      corsOptions.origin = false
    }

    cb(null, corsOptions)
  }
})

app.register(reposRoutes)
app.register(issuesRoutes)

app.setErrorHandler((error, _, res) => {
  if (error instanceof ZodError) {
    return res.status(400).send({
      message: error.format(),
    })
  }

  if (env.NODE_ENV !== 'production') {
    console.error(error)
  } else {
    // TODO: Should log to an external tool i.e. DataDog/NewRelix/Sentry
  }

  return res.status(500).send({
    message: 'Internal server error.',
  })
})
