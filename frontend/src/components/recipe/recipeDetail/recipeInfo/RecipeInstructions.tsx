import React, { useState, useRef, useEffect } from "react";
import { Title, List, Box, Button, ScrollArea } from "@mantine/core";

interface RecipeInstructionsProps {
  instructions: string[];
  maxHeight?: number;
}

export const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({
  instructions,
  maxHeight = 200, // Varsayılan maksimum yükseklik (piksel cinsinden)
}) => {
  const [expanded, setExpanded] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const [showButton, setShowButton] = useState(false);
  const [listHeight, setListHeight] = useState(0);

  useEffect(() => {
    if (listRef.current) {
      const contentHeight = listRef.current.scrollHeight;
      setListHeight(contentHeight);
      setShowButton(contentHeight > maxHeight);
    }
  }, [instructions, maxHeight]);

  const minHeight = 50;
  const currentHeight = Math.min(Math.max(listHeight, minHeight), maxHeight);

  return (
    <Box mt="xl">
      <Title order={2} mb="md" c="orange">
        Hazırlanışı
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
          style={{
            height: expanded ? "auto" : `${currentHeight}px`,
            maxHeight: expanded ? "none" : `${maxHeight}px`,
            transition: "height 0.3s ease-in-out",
          }}
        >
          <List ref={listRef} type="ordered" withPadding spacing="md">
            {instructions.map((step, index) => (
              <List.Item key={index}>{step}</List.Item>
            ))}
          </List>
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
