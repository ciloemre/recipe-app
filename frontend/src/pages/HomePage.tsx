import { Flex, Box } from "@mantine/core";
import { HeroSection } from "../components/recipe/home/heroSection/HeroSection";
import { QuickCategories } from "../components/recipe/home/quickCategories/QuickCategories";
import { RecipeDiscovery } from "../components/recipe/home/recipeDiscovery/RecipeDiscovery";
import { CookingTips } from "../components/recipe/home/cookingTips/CookingTips";
import { LatestRecipes } from "../components/recipe/home/latestRecipes/LatestRecipes";
import { SocialMediaFollow } from "../components/recipe/home/socialMedia/SocialMediaFollow";

export function HomePage() {
  return (
    <Flex direction="column">
      <Box>
        <HeroSection />
        <QuickCategories />
        <RecipeDiscovery />
        <CookingTips />
        <LatestRecipes />
        <SocialMediaFollow />
      </Box>
    </Flex>
  );
}

export default HomePage;
