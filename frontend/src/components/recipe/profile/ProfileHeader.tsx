import { useEffect, useMemo, useRef, useState } from "react";
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
import { useTranslation } from "react-i18next";
import { User } from "../../../types/types";
import { updateProfile } from "../../../api/api";
import { useSocket } from "../../../hooks/useSocket";
import {
  getPasswordChecks,
  PASSWORD_RULES,
} from "../../../utils/passwordValidation";
import { resizeImage } from "../../../utils/imageUtils";
import { formatLocaleNumber } from "../../../utils/localeFormat";
import styles from "./ProfileHeader.module.css";

interface ProfileHeaderProps {
  user: User;
  onUserUpdated: (user: User) => void;
}

const RULE_KEYS = {
  minLength: "profile.ruleMinLength",
  uppercase: "profile.ruleUppercase",
  lowercase: "profile.ruleLowercase",
  number: "profile.ruleNumber",
  special: "profile.ruleSpecial",
} as const;

export function ProfileHeader({ user, onUserUpdated }: ProfileHeaderProps) {
  const { t, i18n } = useTranslation();
  const lang = i18n.language?.slice(0, 2) || "tr";
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
        value.trim().length < 2 ? t("profile.nameMin") : null,
      username: (value) => {
        if (value.trim().length < 3) {
          return t("profile.usernameMin");
        }
        if (!/^[a-zA-Z0-9_]+$/.test(value.trim())) {
          return t("profile.usernameChars");
        }
        return null;
      },
      newPassword: (value, values) => {
        if (!value && !values.confirmPassword && !values.currentPassword) {
          return null;
        }
        const passwordChecks = getPasswordChecks(value, values.confirmPassword);
        if (!passwordChecks.minLength) return t("profile.passwordMin8");
        if (!passwordChecks.uppercase) return t("profile.passwordUpper");
        if (!passwordChecks.lowercase) return t("profile.passwordLower");
        if (!passwordChecks.number) return t("profile.passwordNumber");
        if (!passwordChecks.special) return t("profile.passwordSpecial");
        return null;
      },
      confirmPassword: (value, values) => {
        if (!values.newPassword && !value) return null;
        return value !== values.newPassword
          ? t("profile.passwordsMismatch")
          : null;
      },
      currentPassword: (value, values) => {
        if (values.newPassword && !value) {
          return t("profile.currentPasswordRequired");
        }
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
    (rule) => t(RULE_KEYS[rule.key])
  );
  const met = PASSWORD_RULES.filter((rule) => checks[rule.key]).map((rule) =>
    t(RULE_KEYS[rule.key])
  );

  const difference = useMemo(() => {
    const password = form.values.newPassword;
    const confirmPassword = form.values.confirmPassword;
    if (!confirmPassword) return null;
    if (password === confirmPassword) {
      return { ok: true, text: t("profile.passwordsEqual") };
    }
    if (password.startsWith(confirmPassword)) {
      return {
        ok: false,
        text: t("profile.charsMissing", {
          count: password.length - confirmPassword.length,
        }),
      };
    }
    if (password && confirmPassword.startsWith(password)) {
      return {
        ok: false,
        text: t("profile.charsExtra", {
          count: confirmPassword.length - password.length,
        }),
      };
    }
    return { ok: false, text: t("profile.passwordsMismatch") };
  }, [form.values.newPassword, form.values.confirmPassword, t]);

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
        title: t("profile.savedTitle"),
        message: t("profile.savedMessage"),
        color: "green",
      });
      setOpened(false);
    } catch (error) {
      notifications.show({
        title: t("common.error"),
        message:
          error instanceof Error ? error.message : t("profile.updateError"),
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
              {t("profile.followersCount", {
                count: formatLocaleNumber(followerCount, lang),
              })}{" "}
              ·{" "}
              {t("profile.followingCount", {
                count: formatLocaleNumber(followingCount, lang),
              })}
            </Text>
            <Text className={styles.email}>{user.email}</Text>
          </div>
        </Group>
        <Button className={styles.editButton} onClick={openEditor}>
          <IconEdit size={16} style={{ marginInlineEnd: 8 }} />
          {t("profile.editProfile")}
        </Button>
      </div>

      <Modal
        opened={opened}
        onClose={() => setOpened(false)}
        title={t("profile.editProfile")}
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
                  {t("profile.selectPhoto")}
                </Button>
                {avatar && (
                  <Button
                    type="button"
                    variant="subtle"
                    color="red"
                    onClick={() => setAvatar("")}
                  >
                    {t("profile.removePhoto")}
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
                    title: t("common.error"),
                    message:
                      error instanceof Error
                        ? error.message
                        : t("profile.photoError"),
                    color: "red",
                  });
                }
              }}
            />
            <TextInput
              label={t("profile.nameLabel")}
              required
              {...form.getInputProps("name")}
            />
            <TextInput
              label={t("profile.usernameLabel")}
              required
              {...form.getInputProps("username")}
            />
            <Text size="sm" c="dimmed">
              {t("profile.passwordHint")}
            </Text>
            <PasswordInput
              label={t("profile.currentPassword")}
              {...form.getInputProps("currentPassword")}
            />
            <PasswordInput
              label={t("profile.newPassword")}
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
                    {t("profile.missing")} {missing.join(", ")}
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
                    {t("profile.done")} {met.join(", ")}
                  </Text>
                )}
              </Text>
            )}
            <PasswordInput
              label={t("profile.confirmNewPassword")}
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
              {t("common.save")}
            </Button>
          </Stack>
        </form>
      </Modal>
    </Paper>
  );
}
