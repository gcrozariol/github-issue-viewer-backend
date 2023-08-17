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

  it('should be able to retrieve public repositories', async () => {
    const response = await request(app.server)
      .get('/repos')
      .query({ repo: 'react' })
      .set('Authorization', `Bearer ${env.GITHUB_ACCESS_TOKEN}`)
      .set('Accept', 'application/vnd.github+json')

    expect(response.statusCode).toBe(200)
    expect(response.body.repos).toHaveLength(30)
  })

  it('should be able to retrieve public repositories based on user', async () => {
    const response = await request(app.server)
      .get('/repos')
      .query({ user: 'gcrozariol' })
      .query({ repo: 'gympass' })
      .set('Authorization', `Bearer ${env.GITHUB_ACCESS_TOKEN}`)
      .set('Accept', 'application/vnd.github+json')

    expect(response.statusCode).toBe(200)
    expect(response.body.repos).toHaveLength(1)
  })

  it('should not be able to retrieve repositories: repo query key missing', async () => {
    const response = await request(app.server)
      .get('/repos')
      .set('Authorization', `Bearer ${env.GITHUB_ACCESS_TOKEN}`)
      .set('Accept', 'application/vnd.github+json')

    expect(response.statusCode).toBe(400)
  })
})
