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
  console.log(error);

  if (error) toast.error(error.message);
};

//投稿をGETする
export const getPosts = async () => {
  const { data, error } = await supabase
    .from<PostsWithProfile>("post_table")
    .select("*,profiles!inner(*)");
  console.log(data);
  console.log(error);

  if (!error && data) {
    return data;
  }
  return null;
};
