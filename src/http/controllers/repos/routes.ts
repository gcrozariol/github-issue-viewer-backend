import { FastifyInstance } from 'fastify'
import { fetchRepos } from './repos'

export async function reposRoutes(app: FastifyInstance) {
  app.get('/repos', fetchRepos)
}
