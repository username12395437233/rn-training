import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "TaskDetails">;

const TaskDetailsScreen: React.FC<Props> = ({ route }) => {
  const { id, title, description } = route.params;

  return (
    <View style={styles.container}>
      <Text style={styles.label}>ID:</Text>
      <Text style={styles.value}>{id}</Text>

      <Text style={styles.label}>Название:</Text>
      <Text style={styles.title}>{title}</Text>

      <Text style={styles.label}>Описание:</Text>
      <Text style={styles.description}>{description}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 14, fontWeight: "500", marginTop: 12, color: "#555" },
  value: { fontSize: 14, fontWeight: "400" },
  title: { fontSize: 20, fontWeight: "700", marginTop: 4 },
  description: { fontSize: 15, marginTop: 4, lineHeight: 20 },
  buttonContainer: { marginTop: 24 },
});

export default TaskDetailsScreen;
