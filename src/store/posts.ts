import { create } from "zustand";
import { api } from "../api/client";
import { Post } from "../types/post";

type PostsState = {
  posts: Post[];
  loading: boolean;
  error: string | null;
  fetchPosts: () => Promise<void>;
  addPost: (post: Post) => void;
};

export const usePostsStore = create<PostsState>((set) => ({
  posts: [],
  loading: false,
  error: null,

  fetchPosts: async () => {
    try {
      set({ loading: true, error: null });

      const response = await api.get<Post[]>("/posts");

      set({ posts: response.data, loading: false });
    } catch (e) {
      console.error("Ошибка загрузки постов:", e);
      set({
        loading: false,
        error: "Не удалось загрузить посты. Попробуйте позже.",
      });
    }
  },

  addPost: (post: Post) =>
    set((state) => ({
      posts: [post, ...state.posts],
    })),
}));
