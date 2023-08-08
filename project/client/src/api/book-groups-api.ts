import { apiEndpoint } from '../config'
import { BookGroup } from '../types/BookGroup';
import { CreateBookGroupRequest } from '../types/CreateBookGroupRequest';
import Axios from 'axios'
import { UpdateBookGroupRequest } from '../types/UpdateBookGroupRequest';

export async function getBookGroups(idToken: string): Promise<BookGroup[]> {
  console.log('Fetching book groups')

  const response = await Axios.get(`${apiEndpoint}/book-groups`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('BookGroup:', response.data)
  return response.data.items
}

export async function createBookGroup(
  idToken: string,
  newBookGroup: CreateBookGroupRequest
): Promise<BookGroup> {
  const response = await Axios.post(`${apiEndpoint}/book-groups`,  JSON.stringify(newBookGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.newItem
}

export async function patchBookGroup(
  idToken: string,
  bookGroupId: string,
  updatedBookGroup: UpdateBookGroupRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/book-groups/${bookGroupId}`, JSON.stringify(updatedBookGroup), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteBookGroup(
  idToken: string,
  bookGroupId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/book-groups/${bookGroupId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  bookGroupId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/book-groups/${bookGroupId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
