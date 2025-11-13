import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import { RootStackParamList } from "./src/types/navigation";
import PostDetailsScreen from "./src/screens/PostDetailsScreen";
import NewPostScreen from "./src/screens/NewPostScreen";
import ProfileFormScreen from "./src/screens/ProfileFormScreen";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Посты" }}
        />
        <Stack.Screen
          name="PostDetails"
          component={PostDetailsScreen}
          options={{ title: "Детали поста" }}
        />
        <Stack.Screen
          name="NewPost"
          component={NewPostScreen}
          options={{ title: "Новый пост" }}
        />
        <Stack.Screen
          name="ProfileForm"
          component={ProfileFormScreen}
          options={{ title: "Анкета пользователя" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
