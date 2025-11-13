import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  FlatList,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";
import { api } from "../api/client";
import { Comment } from "../types/comment";

type Props = NativeStackScreenProps<RootStackParamList, "PostDetails">;

const PostDetailsScreen: React.FC<Props> = ({ route }) => {
  const { id, title, body, userId } = route.params;

  const [comments, setComments] = useState<Comment[]>([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [commentsError, setCommentsError] = useState<string | null>(null);

  useEffect(() => {
    const loadComments = async () => {
      try {
        setLoadingComments(true);
        setCommentsError(null);

        const response = await api.get<Comment[]>("/comments", {
          params: { postId: id },
        });

        setComments(response.data);
      } catch (e) {
        console.error("Ошибка загрузки комментариев:", e);
        setCommentsError("Не удалось загрузить комментарии");
      } finally {
        setLoadingComments(false);
      }
    };

    loadComments();
  }, [id]);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID поста: {id}</Text>
      <Text style={styles.label}>userId: {userId}</Text>

      <Text style={styles.title}>{title}</Text>
      <Text style={styles.body}>{body}</Text>

      <Text style={styles.commentsTitle}>Комментарии:</Text>

      {loadingComments && (
        <View style={styles.center}>
          <ActivityIndicator />
          <Text style={styles.loadingText}>Загружаем комментарии...</Text>
        </View>
      )}

      {!!commentsError && !loadingComments && (
        <Text style={styles.errorText}>{commentsError}</Text>
      )}

      {!loadingComments && !commentsError && comments.length === 0 && (
        <Text style={styles.noCommentsText}>Комментариев нет</Text>
      )}

      {!loadingComments && comments.length > 0 && (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <View style={styles.commentCard}>
              <Text style={styles.commentAuthor}>{item.email}</Text>
              <Text style={styles.commentBody}>{item.body}</Text>
            </View>
          )}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 12, color: "#777", marginBottom: 4 },
  title: { fontSize: 20, fontWeight: "700", marginVertical: 8 },
  body: { fontSize: 15, marginBottom: 16, lineHeight: 20 },
  commentsTitle: { fontSize: 16, fontWeight: "600", marginBottom: 8 },
  center: { alignItems: "center", marginVertical: 8 },
  loadingText: { marginTop: 4, fontSize: 13 },
  errorText: { color: "red", marginTop: 4 },
  noCommentsText: { fontSize: 13, color: "#777" },
  commentCard: {
    padding: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#eee",
    marginBottom: 8,
  },
  commentAuthor: { fontSize: 13, fontWeight: "600", marginBottom: 4 },
  commentBody: { fontSize: 13, color: "#444" },
});

export default PostDetailsScreen;
