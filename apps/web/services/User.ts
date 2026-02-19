import type {Paginated} from '~/definitions/common';
import type {CreateUserInput, UpdateUserDataInput, User, UsersInput} from '~/definitions/User';

export async function getUsers(input?: UsersInput): Promise<Paginated<User>> {}

export async function getUser(id: string): Promise<User | null> {}

export async function createUser(input: CreateUserInput): Promise<User> {}

export async function updateUser(id: string, data: UpdateUserDataInput): Promise<User> {}

export async function deleteUser(id: string): Promise<void> {}
