import { NextApiRequest, NextApiResponse } from 'next'

export const fakeData = [
  { value: '1', label: 'Francesco' },
  { value: '6', label: 'Francesco' },
  { value: '7', label: 'Francesco' },
  { value: '8', label: 'Francesco' },
  { value: '9', label: 'Francesco' },
  { value: '10', label: 'Francesco' },
  { value: '11', label: 'Francesco' },
  { value: '12', label: 'Francesco' },
  { value: '13', label: 'Francesco' },
  { value: '14', label: 'Francesco' },
  { value: '15', label: 'Francesco' },
  { value: '2', label: 'Roberto' },
  { value: '3', label: 'Daniel' },
  { value: '4', label: 'Matheus' },
  { value: '5', label: 'Ricardo' }
]

type QueryParams = {
  query: string
}

export default async function HomeSelect(
  req: NextApiRequest,
  res: NextApiResponse
): Promise<void> {
  try {
    if (req.method !== 'GET') {
      res.setHeader('Allow', 'GET')
      res.status(405).end('Method not allowed')
    }
    const { query } = req.query as QueryParams

    if (query) {
      const data = fakeData.filter(
        fake => !!fake.label.toLowerCase().match(query.toLowerCase())
      )
      res.status(200).json(data)
    } else {
      res.status(200).json([])
    }
  } catch (error) {
    res.status(500).end('An error occurred')
  }
}
