import prisma from '../index.services'
import { PrismaClient } from '@prisma/client'
import { mockReset, DeepMockProxy } from 'jest-mock-extended'
import { mockDeep } from 'jest-mock-extended';

console.log(mockReset);

jest.mock('../index.services', () => ({
  __esModule: true,
  default: mockDeep<PrismaClient>(),
}))

beforeEach(() => {
  // jest.useFakeTimers()
  mockReset(prismaMock)
})

export const prismaMock = prisma as unknown as DeepMockProxy<PrismaClient>
