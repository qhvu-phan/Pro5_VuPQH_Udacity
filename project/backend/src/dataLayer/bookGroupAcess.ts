import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { BookGroupItem } from '../models/BookGroupItem'
import { BookGroupUpdate } from '../models/BookGroupUpdate';

const XAWS = AWSXRay.captureAWS(AWS)

export class BookGroupAccess {

  constructor(
    private readonly docClient: DocumentClient = createDynamoDBClient(),
    private readonly bookIndex = process.env.BOOK_GROUP_TABLE_GSI,
    private readonly bookGroupTable = process.env.BOOK_GROUP_TABLE) {
  }

  async deleteBookGroupById(bookGroupId: string, userId: string) {
    await this.docClient.delete({
      TableName: this.bookGroupTable,
      Key: {
        'bookGroupId': bookGroupId,
        'userId': userId
      }
    }).promise()
  }

  async updateBookGroup(bookGroupId: string, userId: string, updatedBookGroup: BookGroupUpdate){

    await this.docClient.update({
        TableName: this.bookGroupTable,
        Key: {
            "bookGroupId": bookGroupId,
            "userId": userId
        },
        UpdateExpression: "set #name = :name, description = :description",
        ExpressionAttributeNames: {
            "#name": "name"
        },
        ExpressionAttributeValues: {
            ":name": updatedBookGroup.name,
            ":description": updatedBookGroup.description
        }
    }).promise()
}

  async getBookGroupByUserId(userId: string): Promise<BookGroupItem[]> {
    console.log("Called function get book")
    const result = await this.docClient.query({
      TableName: this.bookGroupTable,
      IndexName: this.bookIndex,
      KeyConditionExpression: 'userId = :userId',
      ExpressionAttributeValues: {
        ':userId': userId
      },
      ScanIndexForward: false
    }).promise()
    const items = result.Items
    return items as BookGroupItem[]
  }

  async createBookGroup(bookGroup: BookGroupItem): Promise<BookGroupItem> {
    await this.docClient.put({
      TableName: this.bookGroupTable,
      Item: bookGroup
    }).promise()

    return bookGroup
  }
}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}
