import { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@/env'
import { z } from 'zod'

interface Author {
  name: string
  avatar: string
}

interface Issue {
  author: Author
  title: string
  body: string
  url: string
}

export async function fetchIssuesFromRepo(
  req: FastifyRequest,
  res: FastifyReply,
) {
  const paramsSchema = z.object({
    owner: z.string(),
    repo: z.string(),
  })

  const { owner, repo } = paramsSchema.parse(req.params)

  const response = await fetch(
    `${env.GITHUB_API_URL}/repos/${owner}/${repo}/issues`,
    {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}`,
        Accept: 'application/vnd.github+json',
      },
    },
  )

  const json = await response.json()

  return res.status(200).send({
    issues: json.map(({ author, body, title, url }: Issue) => {
      return {
        author,
        body,
        title,
        url,
      }
    }),
  })
}
