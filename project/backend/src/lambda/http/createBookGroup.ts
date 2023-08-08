import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { CreateBookGroupRequest } from '../../requests/CreateBookGroupRequest'
import { getUserId } from '../utils';
import { createBookGroup } from '../../businessLogic/bookGroup'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newBookGroup: CreateBookGroupRequest = JSON.parse(event.body)
    console.log('Processing event: ', event)
    const newItem = await createBookGroup(newBookGroup, getUserId(event))

    return {
      statusCode: 201,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        newItem
      })
    }
  }
)


handler.use(
  cors({
    credentials: true
  })
)
