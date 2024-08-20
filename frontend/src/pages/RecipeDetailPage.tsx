import React, { useCallback, useRef, useEffect } from "react";
import { Container, Paper, Stack, ActionIcon } from "@mantine/core";
import { IconArrowLeft } from "@tabler/icons-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RecipeHeader } from "../components/recipe/recipeDetail/RecipeDetailHeader";
import { RecipeImage } from "../components/recipe/recipeDetail/RecipeImage";
import { RecipeActions } from "../components/recipe/recipeDetail/RecipeDetailActions";
import { RecipeInfo } from "../components/recipe/recipeDetail/recipeInfo/RecipeInfo";
import { RecipeEditForm } from "../components/recipe/recipeDetail/RecipeEditForm";
import { CommentSection } from "../components/recipe/recipeDetail/comments/CommentSection";
import { useRecipeDetail } from "../hooks/recipeDetailHooks/useRecipeDetail";
import { useRecipeEdit } from "../hooks/recipeDetailHooks/useRecipeEdit";
import { ErrorDisplay } from "../components/common/ErrorDisplay";
import { LoadingSpinner } from "../components/common/LoadingSpinner";
import { useAuth } from "../contexts/AuthContext";
import { useFavoriteActions } from "../hooks/recipeDetailHooks/useFavoriteActions";
import { useRatingActions } from "../hooks/recipeDetailHooks/useRatingActions";
import { useSocket } from "../hooks/useSocket";

const RecipeDetailPage: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const initialEditMode = searchParams.get("edit") === "true";

  const { recipe, isLoading, error, setRecipe, setError, refreshRecipe } =
    useRecipeDetail();
  const { isEditing, handleEditSubmit, handleEditClick, handleDeleteClick } =
    useRecipeEdit(recipe, setRecipe, setError, initialEditMode);
  const { isFavorite, toggleFavorite } = useFavoriteActions(recipe);
  const { handleRating } = useRatingActions(recipe, setRecipe, setError);
  const { on, off } = useSocket();

  const commentSectionRef = useRef<HTMLDivElement>(null);

  const handleRefreshRecipe = useCallback(async () => {
    const scrollPosition = window.pageYOffset;
    await refreshRecipe();
    window.scrollTo(0, scrollPosition);
  }, [refreshRecipe]);

  const scrollToComments = () => {
    commentSectionRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (recipe) {
      const handleRecipeUpdate = (updatedRecipe: any) => {
        if (updatedRecipe._id === recipe._id) {
          setRecipe(updatedRecipe);
        }
      };

      const handleRatingUpdate = (data: {
        recipeId: string;
        averageRating: number;
        ratingCount: number;
      }) => {
        if (data.recipeId === recipe._id) {
          setRecipe((prevRecipe) => {
            if (prevRecipe) {
              return {
                ...prevRecipe,
                averageRating: data.averageRating,
                ratings: { ...prevRecipe.ratings, length: data.ratingCount },
              };
            }
            return prevRecipe;
          });
        }
      };

      on("recipeUpdated", handleRecipeUpdate);
      on("recipeRated", handleRatingUpdate);

      return () => {
        off("recipeUpdated", handleRecipeUpdate);
        off("recipeRated", handleRatingUpdate);
      };
    }
  }, [recipe, on, off, setRecipe]);

  if (isLoading) return <LoadingSpinner />;
  if (error || !recipe)
    return <ErrorDisplay message={error || "Tarif bulunamadı."} />;

  const isAuthor = user
    ? typeof recipe.author === "string"
      ? user._id === recipe.author
      : user._id === recipe.author._id
    : false;

  if (isEditing) {
    return (
      <RecipeEditForm
        recipe={recipe}
        onSubmit={(updatedRecipe) => {
          handleEditSubmit(updatedRecipe);
          handleEditClick(false);
        }}
        onCancel={() => handleEditClick(false)}
      />
    );
  }

  return (
    <Container size="90%" py="xl">
      <ActionIcon
        variant="subtle"
        size="lg"
        onClick={() => navigate("/recipes")}
        mb="md"
      >
        <IconArrowLeft size="1.5rem" />
      </ActionIcon>
      <Paper shadow="md" p="xl" withBorder>
        <Stack>
          <RecipeHeader
            recipe={recipe}
            isAuthor={isAuthor}
            onEditClick={() => handleEditClick(true)}
            onDeleteClick={handleDeleteClick}
          />
          <RecipeImage
            src={recipe.image}
            alt={recipe.title}
            rating={recipe.averageRating}
          />
          <RecipeActions
            isFavorite={isFavorite}
            toggleFavorite={toggleFavorite}
            commentCount={recipe.comments.length}
            scrollToComments={scrollToComments}
            ratingCount={recipe.ratings.length}
            averageRating={recipe.averageRating}
            onRating={handleRating}
            recipeId={recipe._id}
          />
          <RecipeInfo recipe={recipe} />
          <CommentSection
            ref={commentSectionRef}
            comments={recipe.comments}
            recipeId={recipe._id}
            refreshRecipe={handleRefreshRecipe}
          />
        </Stack>
      </Paper>
    </Container>
  );
};

export default RecipeDetailPage;
