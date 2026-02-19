import * as z from 'zod';
import {UserDefinition} from './User';

export type Follow = z.infer<typeof FollowDefinition>;
export const FollowDefinition = z.object({
  following: z.array(
    UserDefinition.pick({
      id: true,
      name: true,
      image: true,
    }),
  ),
  followers: z.array(
    UserDefinition.pick({
      id: true,
      name: true,
      image: true,
    }),
  ),
});
