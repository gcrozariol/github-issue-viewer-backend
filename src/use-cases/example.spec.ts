import { describe, it, expect } from 'vitest'

describe('Test', () => {
  it('should be able to pass', () => {
    function sum(a: number, b: number) {
      return a + b
    }

    const result = sum(1, 1)

    expect(result).toBe(2)
  })
})
