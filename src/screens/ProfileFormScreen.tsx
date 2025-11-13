import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Switch,
  TouchableOpacity,
  Image,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { NativeStackScreenProps } from "@react-navigation/native-stack";
import { RootStackParamList } from "../types/navigation";

import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  ProfileFormValues,
  profileSchema,
} from "../forms/profileForm";

import * as ImagePicker from "expo-image-picker";
import { Ionicons } from "@expo/vector-icons";

type Props = NativeStackScreenProps<RootStackParamList, "ProfileForm">;

const ProfileFormScreen: React.FC<Props> = ({ navigation }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors, isSubmitting },
    setValue,
    watch,
    reset,
  } = useForm<ProfileFormValues>({
    resolver: yupResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      passportNumber: "",
      password: "",
      confirmPassword: "",
      avatarUri: undefined,
      acceptTerms: false,
    },
  });

  const avatarUri = watch("avatarUri");

  // Форматирование номера телефона: +7 (XXX) XXX-XX-XX
  const formatPhoneNumber = (text: string) => {
    // Удаляем все нецифровые символы кроме +
    const cleaned = text.replace(/[^\d+]/g, "");
    
    // Если начинается не с +, добавляем +7
    if (!cleaned.startsWith("+")) {
      const digits = cleaned.replace(/\D/g, "");
      if (digits.length === 0) return "";
      if (digits.startsWith("7")) {
        return `+${digits}`;
      }
      return `+7${digits}`;
    }
    
    // Если начинается с +, форматируем
    if (cleaned.startsWith("+7")) {
      const digits = cleaned.substring(2).replace(/\D/g, "");
      if (digits.length === 0) return "+7";
      if (digits.length <= 3) return `+7 (${digits}`;
      if (digits.length <= 6) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3)}`;
      if (digits.length <= 8) return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
      return `+7 (${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6, 8)}-${digits.slice(8, 10)}`;
    }
    
    return cleaned;
  };

  // Форматирование номера паспорта: 1234 567890
  const formatPassportNumber = (text: string) => {
    const cleaned = text.replace(/\D/g, "");
    if (cleaned.length <= 4) return cleaned;
    return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 10)}`;
  };

  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Нет доступа", "Разрешите доступ к фото, чтобы выбрать изображение");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.7,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      const uri = result.assets[0].uri;
      setValue("avatarUri", uri, { shouldValidate: false });
    }
  };

  const onSubmit = (values: ProfileFormValues) => {
    // Тут можно сохранить в AsyncStorage / Zustand, но пока просто покажем алерт
    console.log("FORM VALUES:", values);

    Alert.alert("Готово", "Форма валидна, данные сохранены локально (пока просто в консоль)", [
      {
        text: "Ок",
        onPress: () => {
          reset();
          navigation.goBack();
        },
      },
    ]);
  };

  return (
    <KeyboardAvoidingView
      style={styles.keyboardView}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
    >
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
        {/* Аватар / фото документа */}
        <Text style={styles.label}>Фото документа / аватар</Text>
        <TouchableOpacity style={styles.avatarContainer} onPress={pickImage}>
          {avatarUri ? (
            <Image source={{ uri: avatarUri }} style={styles.avatar} />
          ) : (
            <Text style={styles.avatarPlaceholder}>Нажми, чтобы выбрать фото</Text>
          )}
        </TouchableOpacity>

        {/* ФИО */}
        <Text style={styles.label}>ФИО *</Text>
        <Controller
          control={control}
          name="fullName"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.fullName && styles.inputError]}
              placeholder="Иванов Иван Иванович"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              autoCapitalize="words"
            />
          )}
        />
        {errors.fullName && (
          <Text style={styles.errorText}>{errors.fullName.message}</Text>
        )}

        {/* Email */}
        <Text style={styles.label}>Email *</Text>
        <Controller
          control={control}
          name="email"
          render={({ field: { value, onChange, onBlur } }) => (
            <TextInput
              style={[styles.input, errors.email && styles.inputError]}
              placeholder="you@example.com"
              autoCapitalize="none"
              keyboardType="email-address"
              value={value}
              onChangeText={onChange}
              onBlur={onBlur}
              returnKeyType="next"
              autoCorrect={false}
            />
          )}
        />
        {errors.email && (
          <Text style={styles.errorText}>{errors.email.message}</Text>
        )}

        {/* Телефон (необязательный) */}
        <Text style={styles.label}>Телефон (опционально)</Text>
        <Controller
          control={control}
          name="phone"
          render={({ field: { value, onChange, onBlur } }) => {
            const formattedValue = value ? formatPhoneNumber(value) : "";
            return (
              <TextInput
                style={[styles.input, errors.phone && styles.inputError]}
                placeholder="+7 (XXX) XXX-XX-XX"
                keyboardType="phone-pad"
                value={formattedValue}
                onChangeText={(text) => {
                  const formatted = formatPhoneNumber(text);
                  // Сохраняем только цифры и + для валидации
                  const cleaned = formatted.replace(/[^\d+]/g, "");
                  onChange(cleaned || null);
                }}
                onBlur={onBlur}
                returnKeyType="next"
                maxLength={18} // +7 (XXX) XXX-XX-XX
              />
            );
          }}
        />
        {errors.phone && (
          <Text style={styles.errorText}>{errors.phone.message}</Text>
        )}

        {/* Паспорт */}
        <Text style={styles.label}>Номер паспорта *</Text>
        <Controller
          control={control}
          name="passportNumber"
          render={({ field: { value, onChange, onBlur } }) => {
            const formattedValue = value ? formatPassportNumber(value) : "";
            return (
              <TextInput
                style={[styles.input, errors.passportNumber && styles.inputError]}
                placeholder="1234 567890"
                keyboardType="number-pad"
                value={formattedValue}
                onChangeText={(text) => {
                  const formatted = formatPassportNumber(text);
                  // Сохраняем только цифры для валидации
                  const cleaned = formatted.replace(/\D/g, "");
                  onChange(cleaned);
                }}
                onBlur={onBlur}
                returnKeyType="next"
                maxLength={11} // 4 цифры + пробел + 6 цифр
              />
            );
          }}
        />
        {errors.passportNumber && (
          <Text style={styles.errorText}>{errors.passportNumber.message}</Text>
        )}

        {/* Пароль */}
        <Text style={styles.label}>Пароль *</Text>
        <Controller
          control={control}
          name="password"
          render={({ field: { value, onChange, onBlur } }) => (
            <View style={[styles.inputWithIcon, errors.password && styles.inputError]}>
              <TextInput
                style={styles.inputInner}
                placeholder="Минимум 8 символов, буквы и цифры"
                secureTextEntry={!showPassword}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="next"
                autoCapitalize="none"
                autoCorrect={false}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowPassword((prev) => !prev)}
              >
                <Ionicons
                  name={showPassword ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.password && (
          <Text style={styles.errorText}>{errors.password.message}</Text>
        )}

        {/* Подтверждение пароля */}
        <Text style={styles.label}>Подтверждение пароля *</Text>
        <Controller
          control={control}
          name="confirmPassword"
          render={({ field: { value, onChange, onBlur } }) => (
            <View
              style={[styles.inputWithIcon, errors.confirmPassword && styles.inputError]}
            >
              <TextInput
                style={styles.inputInner}
                placeholder="Повторите пароль"
                secureTextEntry={!showConfirm}
                value={value}
                onChangeText={onChange}
                onBlur={onBlur}
                returnKeyType="done"
                autoCapitalize="none"
                autoCorrect={false}
                onSubmitEditing={handleSubmit(onSubmit)}
              />
              <TouchableOpacity
                style={styles.iconButton}
                onPress={() => setShowConfirm((prev) => !prev)}
              >
                <Ionicons
                  name={showConfirm ? "eye-off" : "eye"}
                  size={20}
                  color="#555"
                />
              </TouchableOpacity>
            </View>
          )}
        />
        {errors.confirmPassword && (
          <Text style={styles.errorText}>{errors.confirmPassword.message}</Text>
        )}

        {/* Принять условия */}
        <View style={styles.termsRow}>
          <Controller
            control={control}
            name="acceptTerms"
            render={({ field: { value, onChange } }) => (
              <Switch value={value} onValueChange={onChange} />
            )}
          />
          <Text style={styles.termsText}>Я принимаю условия соглашения *</Text>
        </View>
        {errors.acceptTerms && (
          <Text style={styles.errorText}>{errors.acceptTerms.message}</Text>
        )}

        <View style={styles.submitButton}>
          <Button
            title={isSubmitting ? "Сохраняем..." : "Сохранить"}
            onPress={handleSubmit(onSubmit)}
            disabled={isSubmitting}
          />
        </View>
      </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    paddingVertical: 16,
    flexGrow: 1,
  },
  container: {
    paddingHorizontal: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 4,
    marginTop: 12,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
    backgroundColor: "#fff",
  },
  inputError: {
    borderColor: "red",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginTop: 2,
  },
  textArea: {
    height: 100,
    textAlignVertical: "top",
  },
  avatarContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 1,
    borderColor: "#ccc",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#f0f0f0",
    marginTop: 8,
  },
  avatar: {
    width: 118,
    height: 118,
    borderRadius: 59,
  },
  avatarPlaceholder: {
    fontSize: 12,
    color: "#666",
    textAlign: "center",
    paddingHorizontal: 8,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    backgroundColor: "#fff",
    paddingRight: 8,
  },
  inputInner: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 8,
    fontSize: 14,
  },
  iconButton: {
    paddingHorizontal: 4,
    paddingVertical: 4,
  },
  termsRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
  },
  termsText: {
    marginLeft: 8,
    flex: 1,
    fontSize: 13,
  },
  submitButton: {
    marginTop: 24,
    marginBottom: 24,
  },
});

export default ProfileFormScreen;
