import type {
  CommentsInput,
  CreateCommentInput,
  UpdateCommentDataInput,
} from '~/definitions/Comment';
import type {Paginated} from '~/definitions/common';

export async function getComments(input?: CommentsInput): Promise<Paginated<Comment>> {}

export async function getComment(id: string): Promise<Comment | null> {}

export async function createComment(data: CreateCommentInput): Promise<Comment> {}

export async function updateComment(id: string, data: UpdateCommentDataInput): Promise<Comment> {}

export async function deleteComment(id: string): Promise<void> {}
