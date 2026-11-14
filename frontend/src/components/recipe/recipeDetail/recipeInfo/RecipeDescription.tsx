import React, { useState, useRef, useEffect } from "react";
import { Text, Box, Button, Title } from "@mantine/core";
import { useTranslation } from "react-i18next";

interface RecipeDescriptionProps {
  description: string;
  maxHeight?: number;
}

export const RecipeDescription: React.FC<RecipeDescriptionProps> = ({
  description,
  maxHeight = 100,
}) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = useState(false);
  const [showButton, setShowButton] = useState(false);
  const textRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (textRef.current) {
      setShowButton(textRef.current.scrollHeight > maxHeight);
    }
  }, [description, maxHeight]);

  return (
    <Box mt="xl">
      <Title order={2} mb="md" c="orange">
        {t("detail.description")}
      </Title>
      <Box
        style={{
          marginTop: "0.5rem",
          marginBottom: "1rem",
          width: "100%",
          padding: "1rem",
          borderRadius: "8px",
          border: "1px solid #e0e0e0",
          overflow: "hidden",
        }}
      >
        <Box
          style={{
            maxHeight: expanded ? "none" : `${maxHeight}px`,
            overflow: "hidden",
            position: "relative",
            transition: "max-height 0.3s ease-in-out",
          }}
        >
          <Text
            ref={textRef}
            size="lg"
            c="dimmed"
            style={{
              wordBreak: "break-word",
              overflowWrap: "break-word",
              whiteSpace: "pre-wrap",
            }}
          >
            {description}
          </Text>
          {!expanded && showButton && (
            <Box
              style={{
                position: "absolute",
                bottom: 0,
                insetInline: 0,
                height: "50px",
                background: "linear-gradient(transparent, white)",
              }}
            />
          )}
        </Box>

        {showButton && (
          <Button
            variant="subtle"
            onClick={() => setExpanded(!expanded)}
            mt="xs"
            fullWidth
          >
            {expanded ? t("detail.showLess") : t("detail.showMore")}
          </Button>
        )}
      </Box>
    </Box>
  );
};
