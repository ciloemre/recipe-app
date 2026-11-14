import React, { useState, useRef, useEffect } from "react";
import { Title, Text, Box, Button, ScrollArea, Group } from "@mantine/core";
import {
  isSectionHeading,
  sectionHeadingText,
} from "../../../../utils/sectionHeading";

interface RecipeIngredientsProps {
  ingredients: string[];
  maxHeight?: number;
}

export const RecipeIngredients: React.FC<RecipeIngredientsProps> = ({
  ingredients,
  maxHeight = 200, // Varsayılan maksimum yükseklik (piksel cinsinden)
}) => {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const [showButton, setShowButton] = useState(false);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      const contentHeight = listRef.current.scrollHeight;
      setListHeight(contentHeight);
      setShowButton(contentHeight > maxHeight);
    }
  }, [ingredients, maxHeight]);

  const minHeight = 50;
  const currentHeight = Math.min(Math.max(listHeight, minHeight), maxHeight);

  return (
    <Box mt="xl">
      <Title order={2} mb="md" c="orange">
        Malzemeler
      </Title>
      <Box
        style={{
          marginTop: "1rem",
          marginBottom: "1rem",
          width: "100%",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
        }}
      >
        <ScrollArea
          scrollbars="y"
          styles={{
            viewport: {
              overflowX: "hidden",
              "& > div": {
                display: "block !important",
                width: "100%",
              },
            },
          }}
          style={{
            height: expanded ? "auto" : `${currentHeight}px`,
            maxHeight: expanded ? "none" : `${maxHeight}px`,
            transition: "height 0.3s ease-in-out",
          }}
        >
          <Box ref={listRef}>
            {ingredients.map((ingredient, index) =>
              isSectionHeading(ingredient) ? (
                <Text
                  key={index}
                  fw={700}
                  c="orange"
                  mt={index === 0 ? 0 : "md"}
                  mb={4}
                >
                  {sectionHeadingText(ingredient)}
                </Text>
              ) : (
                <Group
                  key={index}
                  gap="sm"
                  wrap="nowrap"
                  align="flex-start"
                  mb={6}
                >
                  <Box
                    style={{
                      width: 8,
                      height: 8,
                      marginTop: 8,
                      borderRadius: "50%",
                      flex: "0 0 auto",
                      backgroundColor: "var(--mantine-color-orange-filled)",
                    }}
                  />
                  <Text
                    style={{
                      overflowWrap: "anywhere",
                      wordBreak: "break-word",
                      whiteSpace: "normal",
                    }}
                  >
                    {ingredient}
                  </Text>
                </Group>
              )
            )}
          </Box>
        </ScrollArea>

        {showButton && (
          <Button
            variant="subtle"
            onClick={() => setExpanded(!expanded)}
            mt="xs"
            fullWidth
          >
            {expanded ? "Daha az göster" : "Tümünü göster"}
          </Button>
        )}
      </Box>
    </Box>
  );
};
