import { FastifyRequest, FastifyReply } from 'fastify'
import { env } from '@/env'
import { z } from 'zod'

interface Owner {
  login: string
  avatar_url: string
}

interface Repo {
  id: number
  full_name: string
  owner: Owner
}

export async function fetchRepos(req: FastifyRequest, res: FastifyReply) {
  const querySchema = z.object({
    repo: z.string(),
    user: z.string().optional(),
  })

  const { repo, user } = querySchema.parse(req.query)

  let query = 'q=' + `${repo}+in:name`

  if (user) query = query + `+user:${user}`

  try {
    const response = await fetch(
      `${env.GITHUB_API_URL}/search/repositories?${query}`,
      {
        headers: {
          Authorization: `Bearer ${env.GITHUB_ACCESS_TOKEN}`,
          Accept: 'application/vnd.github+json',
        },
      },
    )

    console.log('url: ', response.url)

    if (!response.ok) {
      return res.status(200).send({
        repos: [],
        meta: {
          total: 0,
        },
      })
    }

    // console.log('response.ok: ', response.ok)

    const json = await response.json()

    // console.log('json: ', json)

    return res.status(200).send({
      repos: json.items.map(({ id, full_name, owner }: Repo) => {
        return {
          id,
          name: full_name,
          author: {
            username: owner.login,
            avatar: owner.avatar_url,
          },
        }
      }),
      meta: {
        total: json.total_count,
      },
    })
  } catch (error) {
    return res.status(500).send({ message: 'Internal Server Error' })
  }
}
