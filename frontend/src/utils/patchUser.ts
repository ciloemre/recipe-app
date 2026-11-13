import { Comment, CommentReply, Recipe } from "../types/types";

export interface UserUpdate {
  _id: string;
  name: string;
  username: string;
  avatar?: string;
}

type Person = string | { _id: string; username: string; name?: string; avatar?: string };

function patchPerson<T extends Person>(person: T, update: UserUpdate): T {
  if (!person || typeof person === "string" || person._id !== update._id) {
    return person;
  }
  return {
    ...person,
    name: update.name,
    username: update.username,
    avatar: update.avatar || "",
  };
}

function patchReply(reply: CommentReply, update: UserUpdate): CommentReply {
  return { ...reply, user: patchPerson(reply.user, update) };
}

function patchComment(comment: Comment, update: UserUpdate): Comment {
  return {
    ...comment,
    user: patchPerson(comment.user, update),
    replies: (comment.replies ?? []).map((reply) => patchReply(reply, update)),
  };
}

export function patchRecipeWithUser(recipe: Recipe, update: UserUpdate): Recipe {
  return {
    ...recipe,
    author: patchPerson(recipe.author, update),
    comments: (recipe.comments ?? []).map((comment) =>
      patchComment(comment, update)
    ),
  };
}
