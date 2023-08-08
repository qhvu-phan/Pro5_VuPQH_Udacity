import { BookGroupAccess } from '../dataLayer/bookGroupAcess'
import { AttachmentUtils } from '../fileStorage/attachmentUtils';
import { BookGroupItem } from '../models/BookGroupItem'
import { CreateBookGroupRequest } from '../requests/CreateBookGroupRequest'
import { UpdateBookGroupRequest } from '../requests/UpdateBookGroupRequest'
import * as uuid from 'uuid'

const bookGroupAccess = new BookGroupAccess()
const attachmentUtils = new AttachmentUtils()


export async function getBookGroupByUserId(userId: string): Promise<BookGroupItem[]> {
  return bookGroupAccess.getBookGroupByUserId(userId)
}

export async function deleteBookGroupById(bookGroupId: string, userId: string) {
  bookGroupAccess.deleteBookGroupById(bookGroupId, userId)
}

export async function updateBookGroup(bookGroupId: string, userId: string, updateBookGroup: UpdateBookGroupRequest) {
  bookGroupAccess.updateBookGroup(bookGroupId, userId, updateBookGroup)
}

export async function createBookGroup(
  createBookGroupRequest: CreateBookGroupRequest,
  jwtToken: string
): Promise<BookGroupItem> {

  const itemId = uuid.v4()

  return await bookGroupAccess.createBookGroup({
    bookGroupId: itemId,
    createdAt: new Date().toISOString(),
    name: createBookGroupRequest.name,
    description: createBookGroupRequest.description,
    attachmentUrl: await attachmentUtils.createAttachmentURL(itemId),
    userId: jwtToken
  })
}