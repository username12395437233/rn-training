import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import HomeScreen from "./src/screens/HomeScreen";
import TaskDetailsScreen from "./src/screens/TaskDetailsScreen";
import NewTaskScreen  from "./src/screens/NewTaskScreen";
import { RootStackParamList } from "./src/types/navigation";


const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>         
        <Stack.Screen
          name="Home"
          component={HomeScreen}
          options={{ title: "Задачи" }}
        />
        <Stack.Screen
          name="TaskDetails"
          component={TaskDetailsScreen}
          options={{ title: "Детали задачи" }}
        />
        <Stack.Screen
          name="NewTask"
          component={NewTaskScreen}
          options={{ title: "Добавить задачу" }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
