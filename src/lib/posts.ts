import axios from 'axios'
import { CURRENT_USER, User } from '../data/users'

const API_URL = 'https://6af3f9fe55a1de7dcf03745a.mockapi.io/api/products/items'

type ApiPost = {
  id: string
  name: string
  description: string
  image: string
  createdAt?: string | number
  author?: {
    id?: string | number | null
    name?: string | null
    username?: string | null
    avatar?: string | null
  } | null
  authorId?: string | number | null
  authorName?: string | null
  authorUsername?: string | null
  authorAvatar?: string | null
}

export type Post = Omit<ApiPost, 'author'> & {
  author: User
}

export type PostInput = {
  name: string
  title: string
  caption: string
  image: string
}

// Local fallback posts so the app works even if MockAPI is offline or blocked
let localPosts: ApiPost[] = [
  {
    id: '3',
    name: 'Golden Hour Walk',
    description: 'Nothing beats catching the late afternoon sun before heading home. 🌻✨',
    image: 'https://unsplash.com',
    author: { id: CURRENT_USER.id, name: CURRENT_USER.name, username: CURRENT_USER.username },
    createdAt: Date.now() - 1000 * 60 * 45,
  },
  {
    id: '2',
    name: 'Fresh Matcha & Morning Notes',
    description: 'Ready to tackle today’s coding tasks! How is everyone’s week going?',
    image: 'https://unsplash.com',
    author: { id: CURRENT_USER.id, name: CURRENT_USER.name, username: CURRENT_USER.username },
    createdAt: Date.now() - 1000 * 60 * 60 * 3,
  },
  {
    id: '1',
    name: 'Weekend Sunflower Field',
    description: 'Found the brightest spot in town today!',
    image: 'https://unsplash.com',
    author: { id: CURRENT_USER.id, name: CURRENT_USER.name, username: CURRENT_USER.username },
    createdAt: Date.now() - 1000 * 60 * 60 * 9,
  },
]

const myCreatedPostIds = new Set<string>()

function toPost(raw: ApiPost): Post {
  const savedAuthorName = raw.author?.name?.trim() || raw.authorName?.trim()
  const authorName = savedAuthorName || raw.name?.trim() || 'Unknown user'
  const username =
    raw.author?.username?.trim() ||
    raw.authorUsername?.trim() ||
    authorName.toLowerCase().replace(/[^a-z0-9]+/g, '.').replace(/^\.+|\.+$/g, '') ||
    'unknown'
  const avatar = raw.author?.avatar || raw.authorAvatar
  const authorId = String(raw.author?.id ?? raw.authorId ?? username)
  const legacyTitleMatch = raw.description.match(/^\s*\[\[?([^\]\r\n]+)\]\]?\s*(?:\r?\n|$)\s*/)

  return {
    ...raw,
    name: legacyTitleMatch?.[1].trim() ??
      (savedAuthorName && raw.name !== savedAuthorName ? raw.name : ''),
    description: legacyTitleMatch
      ? raw.description.slice(legacyTitleMatch[0].length)
      : raw.description,
    author: {
      id: authorId,
      name: authorName,
      username,
      avatar: avatar ? { uri: avatar } : authorId === CURRENT_USER.id ? CURRENT_USER.avatar : undefined,
    },
  }
}

function encodeDescription(title: string, description: string) {
  const trimmedTitle = title.trim()
  const trimmedDescription = description.trim()
  if (!trimmedTitle) return trimmedDescription
  return `[[${trimmedTitle}]]${trimmedDescription ? `\n${trimmedDescription}` : ''}`
}

export async function fetchPosts(): Promise<Post[]> {
  try {
    const { data } = await axios.get<ApiPost[]>(API_URL, { timeout: 5000 })
    return [...data].sort((a, b) => Number(b.id) - Number(a.id)).map(toPost)
  } catch {
    return [...localPosts].sort((a, b) => Number(b.id) - Number(a.id)).map(toPost)
  }
}

export async function fetchPost(id: string): Promise<Post> {
  try {
    const { data } = await axios.get<ApiPost>(`${API_URL}/${id}`, { timeout: 5000 })
    return toPost(data)
  } catch {
    const found = localPosts.find((p) => p.id === id)
    if (!found) throw new Error('Post not found')
    return toPost(found)
  }
}

export async function createPost(input: PostInput) {
  const authorName = input.name.trim()
  const description = encodeDescription(input.title, input.caption)
  try {
    const { data } = await axios.post<ApiPost>(
      API_URL,
      {
        name: authorName,
        description,
        image: input.image.trim(),
        author: {
          id: CURRENT_USER.id,
          name: authorName,
          username: CURRENT_USER.username,
          avatar: CURRENT_USER.avatarUrl || undefined,
        },
      },
      { timeout: 5000 }
    )
    if (data?.id) {
      myCreatedPostIds.add(String(data.id))
    }
  } catch {
    const newId = String(Date.now())
    myCreatedPostIds.add(newId)
    localPosts = [
      {
        id: newId,
        name: authorName,
        description,
        image: input.image.trim(),
        author: {
          id: CURRENT_USER.id,
          name: authorName,
          username: CURRENT_USER.username,
          avatar: CURRENT_USER.avatarUrl || undefined,
        },
        createdAt: Date.now(),
      },
      ...localPosts,
    ]
  }
}

export async function updatePost(id: string, input: PostInput) {
  try {
    await axios.put(
      `${API_URL}/${id}`,
      {
        name: input.name.trim(),
        description: encodeDescription(input.title, input.caption),
        image: input.image.trim(),
      },
      { timeout: 5000 }
    )
  } catch {
    localPosts = localPosts.map((p) =>
      p.id === id
        ? {
            ...p,
            name: input.name.trim(),
            description: encodeDescription(input.title, input.caption),
            image: input.image.trim(),
          }
        : p
    )
  }
}

export async function deletePost(id: string) {
  try {
    await axios.delete(`${API_URL}/${id}`, { timeout: 5000 })
  } catch (error) {
    if (!localPosts.some((post) => post.id === id)) throw error
    localPosts = localPosts.filter((p) => p.id !== id)
  }
  myCreatedPostIds.delete(String(id))
}

export const isMine = (post: Post) =>
  post.author.id === CURRENT_USER.id || myCreatedPostIds.has(post.id)

export function timeAgo(value?: string | number): string {
  if (value === undefined || value === '') return ''
  let ms = typeof value === 'number' || /^\d+$/.test(value) ? Number(value) : new Date(value).getTime()
  if (Number.isNaN(ms)) return ''
  if (ms < 1e12) ms *= 1000
  const s = Math.max(0, (Date.now() - ms) / 1000)
  if (s < 60) return 'now'
  if (s < 3600) return `${Math.floor(s / 60)}m`
  if (s < 86400) return `${Math.floor(s / 3600)}h`
  return `${Math.floor(s / 86400)}d`
}
