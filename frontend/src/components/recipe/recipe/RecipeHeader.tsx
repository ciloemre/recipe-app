import { Box } from "@mantine/core";
import { Link } from "react-router-dom";
import { IconPlus } from "@tabler/icons-react";
import { CustomButton } from "../../atoms/CustomButton";

export function RecipeHeader() {
  return (
    <Box style={{ position: "relative", marginBottom: "2rem" }}>
      <Link to="/recipe-form">
        <CustomButton
          variant="filled"
          style={{ position: "absolute", top: 0, right: 0 }}
        >
          <IconPlus size={18} style={{ marginRight: "8px" }} />
          Yeni Tarif Ekle
        </CustomButton>
      </Link>
    </Box>
  );
}
