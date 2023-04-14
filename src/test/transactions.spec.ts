import { expect, it, beforeAll, afterAll, describe } from 'vitest'
import request from 'supertest'
import { app } from '../app'

describe('Transactions routes', () => {
  beforeAll(async () => {
    await app.ready()
  })

  afterAll(async () => {
    await app.close()
  })

  it('should be able to create a new transaction', async () => {
    const response = await request(app.server).post('/transactions').send({
      title: 'New Transaction',
      amount: 5000,
      type: 'credit',
    })
    expect(response.statusCode).toEqual(201)

    console.log(response.get('Set-Cookie'))
  })

  it('should be able to list all transactions', async () => {
    const createTransactionResponse = await request(app.server)
      .post('/transactions')
      .send({
        title: 'New Transaction',
        amount: 5000,
        type: 'credit',
      })

    const cookies = createTransactionResponse.get('Set-Cookie')

    const listTransactionResponse = await request(app.server)
      .get('/transactions')
      .set('Cookie', cookies)
      .expect(200)

    expect(listTransactionResponse.body.transactions).toEqual([
      expect.objectContaining({
        title: 'New Transaction',
        amount: 5000,
      }),
    ])
  })
})
