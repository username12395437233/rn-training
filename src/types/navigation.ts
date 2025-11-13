export type RootStackParamList = {
  Home: undefined;
  PostDetails: {
    id: number;
    title: string;
    body: string;
    userId: number;
  };
  NewPost: undefined;
};
