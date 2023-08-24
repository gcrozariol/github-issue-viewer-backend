import { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@/env'
import { z } from 'zod'

interface Author {
  name: string
  avatar: string
}

interface Issue {
  id: number
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

  try {
    const response = await fetch(
      `${env.GITHUB_API_URL}/repos/${owner}/${repo}/issues`,
      {
        headers: {
          Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      },
    )

    if (!response.ok) {
      return res.status(200).send({
        issues: [],
      })
    }

    const json = await response.json()

    return res.status(200).send({
      issues: json.map(({ id, author, body, title, url }: Issue) => {
        return {
          id,
          author,
          body,
          title,
          url,
        }
      }),
    })
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
