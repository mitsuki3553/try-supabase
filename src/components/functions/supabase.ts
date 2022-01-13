import toast from "react-hot-toast";
import { supabase } from "src/libs/supabase";

type Post = {
  user_id: string;
  post_id: string;
  posts: string;
  created_at: Date;
  updated_at: Date;
  public: boolean;
};


//ユーザー情報をGETする
export const getProfile = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

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
  if (error) toast.error(error.message);
};

//投稿をGETする
export const getPosts = async () => {
  const { data, error } = await supabase.from("post_table").select("*");
  console.log(data);

  if (!error && data) {
    return data as Post[];
  }
  return null;
};
