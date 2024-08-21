// import { useEffect, useMemo, useState } from "react";
// import { SimpleGrid, Text } from "@mantine/core";
// import { RecipeCard } from "../recipe/recipeCard/RecipeCard";
// import { Recipe } from "../../../types/types";
// import { useSocket } from "../../../hooks/useSocket";
// import { useProfileData } from "../../../hooks/useProfileData";
// import { PaginatedList } from "../../../components/recipe/PaginatedList";
// import { useRecipe } from "../../../contexts/RecipeContext";

// interface MyFavoritesListProps {
//   onFavoriteToggle: (recipeId: string) => void;
// }

// export function MyFavoritesList({ onFavoriteToggle }: MyFavoritesListProps) {
//   const { favoriteRecipes, updateRecipe } = useProfileData();
//   const { toggleFavoriteRecipe } = useRecipe();
//   const { on, off } = useSocket();
//   const [localFavorites, setLocalFavorites] =
//     useState<Recipe[]>(favoriteRecipes);

//   useEffect(() => {
//     const handleRecipeUpdate = (updatedRecipe: Recipe) => {
//       updateRecipe(updatedRecipe);
//       setLocalFavorites((prev) =>
//         prev.map((recipe) =>
//           recipe._id === updatedRecipe._id ? updatedRecipe : recipe
//         )
//       );
//     };

//     const events = ["recipeRated", "commentAdded", "commentDeleted"];

//     events.forEach((event) => {
//       on(event, handleRecipeUpdate);
//     });

//     return () => {
//       events.forEach((event) => {
//         off(event, handleRecipeUpdate);
//       });
//     };
//   }, [on, off, updateRecipe]);

//   useEffect(() => {
//     setLocalFavorites(favoriteRecipes);
//   }, [favoriteRecipes]);

//   const sortedFavoriteRecipes = useMemo(() => {
//     return [...localFavorites].sort(
//       (a, b) =>
//         new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
//     );
//   }, [localFavorites]);

//   const handleError = (error: any) => {
//     console.error("Bir hata oluştu:", error);
//     // Kullanıcıya hata mesajı göster
//   };

//   const handleFavoriteToggleWrapper = async (recipeId: string) => {
//     try {
//       await toggleFavoriteRecipe(recipeId);
//       setLocalFavorites((prev) =>
//         prev.filter((recipe) => recipe._id !== recipeId)
//       );
//       onFavoriteToggle(recipeId);
//     } catch (error) {
//       handleError(error);
//     }
//   };

//   if (sortedFavoriteRecipes.length === 0) {
//     return <Text>Henüz favori tarif eklememişsiniz.</Text>;
//   }

//   return (
//     <PaginatedList<Recipe>
//       items={sortedFavoriteRecipes}
//       itemsPerPage={12}
//       containerProps={{ size: "100%", p: 0 }}
//       renderItems={(paginatedFavorites) => (
//         <SimpleGrid
//           cols={{ base: 1, sm: 2, md: 3, lg: 4 }}
//           spacing="lg"
//           verticalSpacing="xl"
//         >
//           {paginatedFavorites.map((recipe) => (
//             <RecipeCard
//               key={`favorite-${recipe._id}`}
//               recipe={recipe}
//               isFavorite={true}
//               onFavoriteToggle={() => handleFavoriteToggleWrapper(recipe._id)}
//             />
//           ))}
//         </SimpleGrid>
//       )}
//     />
//   );
// }
