import React from "react";
import { Image, Badge, Box } from "@mantine/core";

interface RecipeImageProps {
  src: string;
  alt: string;
  rating?: number;
}

function getRatingColor(rating: number) {
  if (rating >= 4) return "teal";
  if (rating >= 2) return "yellow";
  return "red";
}

export const RecipeImage: React.FC<RecipeImageProps> = ({
  src,
  alt,
  rating,
}) => (
  <Box
    pos="relative"
    h={{ base: 250, sm: 300, md: 400 }}
    w={{ base: "100%", md: "50%" }}
    style={{ overflow: "hidden", borderRadius: "16px" }}
  >
    <Image src={src} alt={alt} height="100%" width="100%" fit="cover" />
    {rating !== undefined && (
      <Badge
        color={getRatingColor(rating)}
        size="xl"
        variant="filled"
        style={{
          position: "absolute",
          top: 16,
          right: 16,
          fontSize: "1.1rem",
          padding: "8px 12px",
        }}
      >
        {rating.toFixed(1)}
      </Badge>
    )}
  </Box>
);
