import toast from "react-hot-toast";
import { supabase } from "src/libs/supabase";

type Profile = {
  avatar_url: string;
  id: string;
  updated_at: string;
  username: string;
};

type PostsWithProfile = {
  user_id: string;
  post_id: string;
  posts: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  profiles: Profile;
};

//ログインユーザー情報をGETする
export const getProfile = async (id: string) => {
  const { data, error } = await supabase
    .from<Profile>("profiles")
    .select("*")
    .eq("id", id);

  if (!error && data) {
    return data;
  }
  return null;
};

//投稿をPOSTする
export const postPost = async (post: string, uuid: string) => {
  const { error } = await supabase.from("post_table").insert([
    {
      user_id: uuid,
      posts: post,
      created_at: new Date(),
      updated_at: new Date(),
      public: true,
    },
  ]);

  error ? toast.error("保存に失敗しました…") : toast("保存しました！！");
};

//投稿をGETする
export const getPosts = async () => {
  const { data, error } = await supabase
    .from<PostsWithProfile>("post_table")
    .select("*,profiles!inner(*)");

  if (!error && data) {
    return data;
  }
  error && toast.error("情報取得に失敗しました…");
  return null;
};

//投稿を削除する
export const deletePosts = async (user_id: string, post_id: string) => {
  const { data, error } = await supabase
    .from("post_table")
    .delete()
    .match({ user_id: user_id, post_id: post_id });

  error ? toast.error("削除に失敗しました…") : toast("削除しました！！");
};
