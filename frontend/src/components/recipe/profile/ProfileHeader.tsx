import { useEffect, useRef, useState } from "react";
import {
  Avatar,
  Paper,
  Title,
  Text,
  Button,
  Modal,
  TextInput,
  PasswordInput,
  Stack,
  Group,
} from "@mantine/core";
import { useForm } from "@mantine/form";
import { notifications } from "@mantine/notifications";
import { IconEdit } from "@tabler/icons-react";
import { User } from "../../../types/types";
import { updateProfile } from "../../../api/api";
import { useSocket } from "../../../hooks/useSocket";
import {
  confirmDifference,
  getPasswordChecks,
  PASSWORD_RULES,
} from "../../../utils/passwordValidation";
import { resizeImage } from "../../../utils/imageUtils";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

export function ProfileHeader({ user, onUserUpdated }: ProfileHeaderProps) {
  const [opened, setOpened] = useState(false);
  const [saving, setSaving] = useState(false);
  const [avatar, setAvatar] = useState(user.avatar || "");
  const fileRef = useRef<HTMLInputElement>(null);
  const [followerCount, setFollowerCount] = useState(user.followerCount ?? 0);
  const [followingCount, setFollowingCount] = useState(user.followingCount ?? 0);
  const { emit, on, off, subscribeConnect } = useSocket();

  useEffect(() => {
    setFollowerCount(user.followerCount ?? 0);
    setFollowingCount(user.followingCount ?? 0);
  }, [user.followerCount, user.followingCount, user._id]);

  useEffect(() => {
    const stopJoin = subscribeConnect(() => emit("authenticate", user._id));
    const handleFollow = (data: { followerCount?: number }) => {
      if (typeof data?.followerCount === "number") {
        setFollowerCount(data.followerCount);
      }
    };
    on("follow:updated", handleFollow);
    return () => {
      stopJoin();
      off("follow:updated", handleFollow);
    };
  }, [user._id, emit, on, off, subscribeConnect]);

  const form = useForm({
    initialValues: {
      name: user.name,
      username: user.username,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    },
    validate: {
      name: (value) =>
        value.trim().length < 2 ? "İsim en az 2 karakter olmalıdır" : null,
      username: (value) => {
        if (value.trim().length < 3) {
          return "Kullanıcı adı en az 3 karakter olmalıdır";
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          return "Yalnızca harf, rakam ve alt çizgi kullanılabilir";
        }
        return null;
      },
      newPassword: (value, values) => {
        if (!value && !values.confirmPassword && !values.currentPassword) {
          return null;
        }
        const checks = getPasswordChecks(value, values.confirmPassword);
        if (!checks.minLength) return "Şifre en az 8 karakter olmalıdır";
        if (!checks.uppercase) return "En az bir büyük harf gerekli";
        if (!checks.lowercase) return "En az bir küçük harf gerekli";
        if (!checks.number) return "En az bir rakam gerekli";
        if (!checks.special) return "En az bir işaret gerekli";
        return null;
      },
      confirmPassword: (value, values) => {
        if (!values.newPassword && !value) return null;
        return value !== values.newPassword ? "Şifreler eşit değil" : null;
      },
      currentPassword: (value, values) => {
        if (values.newPassword && !value) return "Mevcut şifre gerekli";
        return null;
      },
    },
  });

  const openEditor = () => {
    form.setValues({
      name: user.name,
      username: user.username,
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    });
    form.clearErrors();
    setAvatar(user.avatar || "");
    setOpened(true);
  };

  const checks = getPasswordChecks(
    form.values.newPassword,
    form.values.confirmPassword
  );
  const showRules = form.values.newPassword.length > 0;
  const missing = PASSWORD_RULES.filter((rule) => !checks[rule.key]).map(
    (rule) => rule.label
  );
  const met = PASSWORD_RULES.filter((rule) => checks[rule.key]).map(
    (rule) => rule.label
  );
  const difference = confirmDifference(
    form.values.newPassword,
    form.values.confirmPassword
  );

  const handleSave = form.onSubmit(async (values) => {
    setSaving(true);
    try {
      const updated = await updateProfile({
        name: values.name.trim(),
        username: values.username.trim(),
        avatar,
        ...(values.newPassword
          ? {
              currentPassword: values.currentPassword,
              newPassword: values.newPassword,
            }
          : {}),
      });
      onUserUpdated(updated);
      notifications.show({
        title: "Kaydedildi",
        message: "Profil bilgilerin güncellendi",
        color: "green",
      });
      setOpened(false);
    } catch (error) {
      notifications.show({
        title: "Hata",
        message:
          error instanceof Error ? error.message : "Profil güncellenemedi",
        color: "red",
      });
    } finally {
      setSaving(false);
    }
  });

  return (
    <Paper className={styles.header}>
      <div className={styles.content}>
        <Group align="center" gap="md" wrap="nowrap">
          <Avatar
            src={user.avatar || null}
            size={72}
            radius="xl"
            color="orange"
          >
            {user.name.slice(0, 1).toUpperCase()}
          </Avatar>
          <div>
          <Title order={2} className={styles.title}>
            {user.name}
          </Title>
          <Text className={styles.username}>@{user.username}</Text>
          <Text size="sm" style={{ opacity: 0.9 }}>
            {followerCount} Takipçi · {followingCount} Takip
          </Text>
          <Text className={styles.email}>{user.email}</Text>
          </div>
        </Group>
        <Button className={styles.editButton} onClick={openEditor}>
          <IconEdit size={16} style={{ marginRight: 8 }} />
          Profili Düzenle
        </Button>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title="Profili Düzenle"
        centered
      >
        <form onSubmit={handleSave}>
          <Stack gap="sm">
            <Group align="center" wrap="nowrap">
              <Avatar src={avatar || null} size={64} radius="xl" color="orange">
                {form.values.name.slice(0, 1).toUpperCase() || "?"}
              </Avatar>
              <Stack gap={6}>
                <Button
                  type="button"
                  variant="light"
                  color="orange"
                  onClick={() => fileRef.current?.click()}
                >
                  Fotoğraf seç
                </Button>
                {avatar && (
                  <Button
                    type="button"
                    variant="subtle"
                    color="red"
                    onClick={() => setAvatar("")}
                  >
                    Fotoğrafı kaldır
                  </Button>
                )}
              </Stack>
            </Group>
            <input
              ref={fileRef}
              type="file"
              accept="image/jpeg,image/png,image/webp"
              hidden
              onChange={async (event) => {
                const file = event.currentTarget.files?.[0];
                event.currentTarget.value = "";
                if (!file) return;
                try {
                  setAvatar(await resizeImage(file, 256));
                } catch (error) {
                  notifications.show({
                    title: "Hata",
                    message:
                      error instanceof Error
                        ? error.message
                        : "Fotoğraf eklenemedi",
                    color: "red",
                  });
                }
              }}
            />
            <TextInput
              label="İsim"
              required
              {...form.getInputProps("name")}
            />
            <TextInput
              label="Kullanıcı adı"
              required
              {...form.getInputProps("username")}
            />
            <Text size="sm" c="dimmed">
              Şifreyi değiştirmek istemezsen bu alanları boş bırak.
            </Text>
            <PasswordInput
              label="Mevcut şifre"
              {...form.getInputProps("currentPassword")}
            />
            <PasswordInput
              label="Yeni şifre"
              {...form.getInputProps("newPassword")}
              error={
                form.values.newPassword.length > 0
                  ? !(
                      checks.minLength &&
                      checks.uppercase &&
                      checks.lowercase &&
                      checks.number &&
                      checks.special
                    )
                  : form.errors.newPassword
              }
            />
            {showRules && (
              <Text size="xs">
                {missing.length > 0 && (
                  <Text span c="red" size="xs">
                    Eksik: {missing.join(", ")}
                  </Text>
                )}
                {missing.length > 0 && met.length > 0 && (
                  <Text span c="dimmed" size="xs">
                    {" "}
                    ·{" "}
                  </Text>
                )}
                {met.length > 0 && (
                  <Text span c="teal" size="xs">
                    Tamam: {met.join(", ")}
                  </Text>
                )}
              </Text>
            )}
            <PasswordInput
              label="Yeni şifre tekrar"
              {...form.getInputProps("confirmPassword")}
              error={
                form.values.confirmPassword.length > 0
                  ? !checks.match
                  : form.errors.confirmPassword
              }
            />
            {difference && (
              <Text size="xs" c={difference.ok ? "teal" : "red"}>
                {difference.text}
              </Text>
            )}
            <Button type="submit" color="orange" loading={saving}>
              Kaydet
            </Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  );
}
