import * as yup from "yup";

export type ProfileFormValues = {
  fullName: string;
  email: string;
  phone?: string | null;
  passportNumber: string;
  password: string;
  confirmPassword: string;
  avatarUri?: string | null;
  acceptTerms: boolean;
};

const FULL_NAME_REGEX = /^[A-Za-zА-Яа-яЁё\s-]+$/;
const PHONE_REGEX = /^\+?7\d{10}$/; // +7 и 10 цифр
const PASSPORT_REGEX = /^[0-9]{4}[0-9]{6}$/; // 10 цифр без пробела
const PASSWORD_REGEX = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{8,}$/;

export const profileSchema = yup.object({
  fullName: yup
    .string()
    .required("ФИО обязательно")
    .matches(FULL_NAME_REGEX, "Только буквы, пробелы и дефис")
    .min(3, "Минимум 3 символа"),

  email: yup
    .string()
    .required("Email обязателен")
    .email("Неверный email"),

  phone: yup
    .string()
    .nullable()
    .transform((v) => (v === "" ? null : v))
    .test("phone-format", "Телефон в формате +71234567890", function (value) {
      if (!value || value === null) return true; 
      return PHONE_REGEX.test(value);
    })
    .optional(),

  passportNumber: yup
    .string()
    .required("Номер паспорта обязателен")
    .transform((v) => (typeof v === "string" ? v.replace(/\D/g, "") : v))
    .matches(PASSPORT_REGEX, "Формат: 1234 567890 (10 цифр)"),

  password: yup
    .string()
    .required("Пароль обязателен")
    .matches(
      PASSWORD_REGEX,
      "Минимум 8 символов, хотя бы одна буква и одна цифра"
    ),

  confirmPassword: yup
    .string()
    .required("Подтвердите пароль")
    .oneOf([yup.ref("password")], "Пароли не совпадают"),

  avatarUri: yup.string().nullable().optional(),

  acceptTerms: yup
    .boolean()
    .required("Нужно принять условия")
    .oneOf([true], "Нужно принять условия"),
}) as yup.ObjectSchema<ProfileFormValues>;
