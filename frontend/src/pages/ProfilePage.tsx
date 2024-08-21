import { useState, useEffect } from "react";
import { Container, Loader, Text, Box } from "@mantine/core";
import { useProfileData } from "../hooks/useProfileData";
import { ProfileHeader } from "../components/recipe/profile/ProfileHeader";
import { ProfileTabs } from "../components/recipe/profile/ProfileTabs";
import { MyRecipesList } from "../components/recipe/profile/MyRecipesList";
import { useSocket } from "../hooks/useSocket";
import FavoritesPage from "./FavoritesPage";

export function ProfilePage() {
  const {
    userData,
    userRecipes,
    loading,
    error,
    handleDeleteRecipe,
    handleEditRecipe,
    updateRecipe,
    removeRecipe,
    fetchUserDataAndRecipes,
  } = useProfileData();
  const [activeTab, setActiveTab] = useState<string | null>("myRecipes");
  const { on, off } = useSocket();

  useEffect(() => {
    const handleRecipeUpdate = (updatedRecipe: any) => {
      updateRecipe(updatedRecipe);
    };

    const handleRecipeDelete = (deletedRecipeId: string) => {
      removeRecipe(deletedRecipeId);
    };

    on("recipeUpdated", handleRecipeUpdate);
    on("recipeDeleted", handleRecipeDelete);
    on("recipeRated", handleRecipeUpdate);
    on("commentAdded", handleRecipeUpdate);
    on("commentDeleted", handleRecipeUpdate);

    return () => {
      off("recipeUpdated", handleRecipeUpdate);
      off("recipeDeleted", handleRecipeDelete);
      off("recipeRated", handleRecipeUpdate);
      off("commentAdded", handleRecipeUpdate);
      off("commentDeleted", handleRecipeUpdate);
    };
  }, [on, off, updateRecipe, removeRecipe]);

  const handleTabChange = (value: string | null) => {
    setActiveTab(value);
    fetchUserDataAndRecipes();
  };

  if (loading) return <Loader color="orange" />;
  if (error) return <Text color="red">{error}</Text>;
  if (!userData) return <Text>Kullanıcı bilgileri bulunamadı.</Text>;

  return (
    <Container size={"90%"}>
      <ProfileHeader user={userData} />
      <Box mt="xl" p="md">
        <ProfileTabs activeTab={activeTab} onTabChange={handleTabChange} />
        <Box mt="md">
          {activeTab === "myRecipes" && (
            <MyRecipesList
              recipes={userRecipes}
              onDeleteRecipe={handleDeleteRecipe}
              onEditRecipe={handleEditRecipe}
            />
          )}
          {activeTab === "favoriteRecipes" && <FavoritesPage />}
        </Box>
      </Box>
    </Container>
  );
}

export default ProfilePage;
