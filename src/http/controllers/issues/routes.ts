import { FastifyInstance } from 'fastify'
import { fetchIssuesFromRepo } from './issues'

export async function issuesRoutes(app: FastifyInstance) {
  app.get('/repos/:owner/:repo/issues', fetchIssuesFromRepo)
}
