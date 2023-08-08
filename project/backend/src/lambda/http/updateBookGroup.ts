import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'
import { getUserId } from '../utils';

import { updateBookGroup } from '../../businessLogic/bookGroup'
import { UpdateBookGroupRequest } from '../../requests/UpdateBookGroupRequest'

export const handler = middy(
    async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
        const bookGroupId = event.pathParameters.bookGroupId
        const updatedBookGroup: UpdateBookGroupRequest = JSON.parse(event.body)
        await updateBookGroup(bookGroupId,getUserId(event), updatedBookGroup)
        return {
            statusCode: 202,
            headers: {
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(updatedBookGroup)
        }
    }
)

handler
    .use(httpErrorHandler())
    .use(
        cors({
            credentials: true
        })
    )
