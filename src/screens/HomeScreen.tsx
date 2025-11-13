import React, { useEffect } from "react";
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "Home">;

type Task = {
  id: string;
  title: string;
  description: string;
};

const tasks: Task[] = [
  { id: "1", title: "Проверить отчёты", description: "Отчёты за неделю" },
  { id: "2", title: "Созвон с командой", description: "План релиза" }
];

const HomeScreen: React.FC<Props> = ({ navigation }) => {

    useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity onPress={() => navigation.navigate("NewTask")}>
          <Text style={styles.headerButton}>+ Добавить</Text>
        </TouchableOpacity>
      ),
    });
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.card}
            onPress={() => navigation.navigate("TaskDetails", item)}
          >
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.description}>{item.description}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  card: {
    padding: 12,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    marginBottom: 12
  },
  title: { fontSize: 16, fontWeight: "600" },
  description: { fontSize: 14, color: "#555" },
  headerButton: {
    marginRight: 12,
    fontSize: 14,
    color: "#007AFF",
    fontWeight: "600",
  },
});

export default HomeScreen;
