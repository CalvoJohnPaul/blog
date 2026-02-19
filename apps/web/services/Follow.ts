import type {Follow} from '~/definitions/Follow';

export async function getFollows(): Promise<Follow[]> {}

export async function follow(): Promise<void> {}

export async function unfollow(): Promise<void> {}
