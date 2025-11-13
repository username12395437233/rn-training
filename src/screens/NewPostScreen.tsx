import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { api } from "../api/client";
import { usePostsStore } from "../store/posts";
import { Post } from "../types/post";

type Props = NativeStackScreenProps<RootStackParamList, "NewPost">;

const NewPostScreen: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const addPost = usePostsStore((state) => state.addPost);

  const handleSave = async () => {
    if (!title.trim() || !body.trim()) {
      Alert.alert("Ошибка", "Заполните и заголовок, и текст поста");
      return;
    }

    try {
      setSubmitting(true);

      const response = await api.post<Post>("/posts", {
        title: title.trim(),
        body: body.trim(),
        userId: 1,
      });

      const created = response.data;

      addPost(created);

      Alert.alert("Успех", "Пост создан (на фейковом API)", [
        {
          text: "Ок",
          onPress: () => navigation.goBack(),
        },
      ]);
    } catch (e) {
      console.error("Ошибка создания поста:", e);
      Alert.alert("Ошибка", "Не удалось создать пост");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Заголовок</Text>
      <TextInput
        style={styles.input}
        placeholder="Введите заголовок"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Текст поста</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Введите текст поста"
        value={body}
        onChangeText={setBody}
        multiline
      />

      <Button title={submitting ? "Сохраняем..." : "Сохранить"} onPress={handleSave} disabled={submitting} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "500", marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 12,
    fontSize: 14,
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
  },
});

export default NewPostScreen;
