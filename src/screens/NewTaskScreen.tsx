import React, { useState } from "react";
import { View, Text, TextInput, StyleSheet, Button } from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

type Props = NativeStackScreenProps<RootStackParamList, "NewTask">;

const NewTask: React.FC<Props> = ({ navigation }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSave = () => {
    console.log("NEW TASK:", { title, description });
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Название задачи</Text>
      <TextInput
        style={styles.input}
        placeholder="Например, Проверить отчёты"
        value={title}
        onChangeText={setTitle}
      />

      <Text style={styles.label}>Описание</Text>
      <TextInput
        style={[styles.input, styles.textArea]}
        placeholder="Подробности задачи"
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <Button title="Сохранить" onPress={handleSave} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  label: { fontSize: 14, marginBottom: 4, fontWeight: "500" },
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
    height: 100,
    textAlignVertical: "top",
  },
});

export default NewTask;
