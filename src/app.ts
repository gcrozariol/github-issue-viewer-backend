import fastify from 'fastify'
import { ZodError } from 'zod'

import { env } from './env'
import { reposRoutes } from './http/controllers/repos/routes'
import { issuesRoutes } from './http/controllers/issues/routes'

export const app = fastify()

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
