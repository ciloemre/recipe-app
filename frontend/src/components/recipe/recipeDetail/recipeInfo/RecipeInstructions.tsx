import React, { useState, useRef, useEffect } from "react";
import { Title, Text, Box, Button, ScrollArea } from "@mantine/core";
import {
  isSectionHeading,
  sectionHeadingText,
} from "../../../../utils/sectionHeading";

interface RecipeInstructionsProps {
  instructions: string[];
  maxHeight?: number;
}

export const RecipeInstructions: React.FC<RecipeInstructionsProps> = ({
  instructions,
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
          <Box
            ref={listRef}
            style={{
              margin: 0,
              padding: 0,
              display: "flex",
              flexDirection: "column",
              gap: 12,
            }}
          >
            {(() => {
              let stepNumber = 0;
              return instructions.map((step, index) => {
                if (isSectionHeading(step)) {
                  return (
                    <Text
                      key={index}
                      fw={700}
                      c="orange"
                      mt={index === 0 ? 0 : "xs"}
                    >
                      {sectionHeadingText(step)}
                    </Text>
                  );
                }

                stepNumber += 1;
                return (
                  <Box
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 8,
                    }}
                  >
                    <span
                      style={{
                        flex: "0 0 auto",
                        minWidth: 20,
                        fontWeight: 700,
                        lineHeight: 1.55,
                        color: "var(--mantine-color-orange-6)",
                      }}
                    >
                      {stepNumber}.
                    </span>
                    <span
                      style={{
                        flex: 1,
                        minWidth: 0,
                        lineHeight: 1.55,
                        overflowWrap: "break-word",
                      }}
                    >
                      {step}
                    </span>
                  </Box>
                );
              });
            })()}
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
