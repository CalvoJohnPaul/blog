import {updateTag} from 'next/cache';
import type {Paginated} from '~/definitions/common';
import type {CreatePostInput, Post, PostsInput, UpdatePostDataInput} from '~/definitions/Post';

export async function getPosts(input?: PostsInput): Promise<Paginated<Post>> {
  return {
    rows: [],
    hasNext: false,
    hasPrevious: false,
    total: 0,
  };
}

export async function getPost(id: string): Promise<Post | null> {}

export async function createPost(input: CreatePostInput): Promise<Post> {
  updateTag('post');
}

export async function updatePost(id: string, data: UpdatePostDataInput): Promise<Post> {}

export async function deletePost(id: string): Promise<void> {}
