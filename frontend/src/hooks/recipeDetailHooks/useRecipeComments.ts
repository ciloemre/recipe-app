import { useState, useRef } from "react";
import { Recipe, Comment } from "../../types/types";

export const useRecipeComments = (recipe: Recipe | null) => {
  const [comments, setComments] = useState<Comment[]>(recipe?.comments || []);
  const commentSectionRef = useRef<HTMLDivElement>(null);

  const handleSetComments = (newComments: Comment[]) => {
    setComments(newComments);
  };

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return { comments, handleSetComments, commentSectionRef, scrollToComments };
};
