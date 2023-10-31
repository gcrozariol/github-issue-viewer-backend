import request from 'supertest'
import { beforeAll, afterAll, describe, it, expect } from 'vitest'

import { app } from '@/app'
import { env } from '@/env'

describe('Issues e2e', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to retrieve issues from a repository', async () => {
    const response = await request(app.server)
      .get('/repos/gcrozariol/gympass-api/issues')
      .set('Authorization', `Bearer ${env.GITHUB_ACCESS_TOKEN}`)
      .set('Accept', 'application/vnd.github+json')

    expect(response.statusCode).toBe(200)
  })
})
