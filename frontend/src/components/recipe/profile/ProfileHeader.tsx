import { Paper, Title, Text, Button } from "@mantine/core";
import { IconEdit } from "@tabler/icons-react";
import { User } from "../../../types/types";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  user: User;
}

export function ProfileHeader({ user }: ProfileHeaderProps) {
  return (
    <Paper className={styles.header}>
      <div className={styles.content}>
        <div>
          <Title order={2} className={styles.title}>
            {user.name}
          </Title>
          <Text className={styles.username}>@{user.username}</Text>
          <Text className={styles.email}>{user.email}</Text>
        </div>
        <Button className={styles.editButton}>
          <IconEdit size={16} style={{ marginRight: 8 }} />
          Profili Düzenle
        </Button>
      </div>
    </Paper>
  );
}
