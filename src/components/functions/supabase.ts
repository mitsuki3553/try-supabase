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
  post_id: number;
  posts: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  profiles: Profile;
};

//ユーザー情報をGETする
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

//投稿をGETする
export const getPosts = async () => {
  const { data, error } = await supabase
    .from<PostsWithProfile>("post_table")
    .select("*,profiles!inner(*)");

  if (!error && data) {
    return data;
  }
  console.error(error);
  error && toast.error("情報取得に失敗しました…");
  return null;
};

//コメント数をGETする
export const getCommentsCount = async (postId: number) => {
  const { error, count } = await supabase
    .from("comment_table")
    .select("count", { count: "exact" })
    .eq("post_id", postId);

  if ((!error && count) || count === 0) {
    return { comment_count: count };
  }
  console.error(error);
  toast.error("情報取得に失敗しました…");
  return { comment_count: -1 };
};

//ユーザー情報をInsertする
export const insertProfile = async (username: string, uuid: string) => {
  const { error } = await supabase
    .from("profiles")
    .insert([{ username, id: uuid, created_at: new Date() }]);

  if (error) {
    toast.error(error.message);
  }
};

//投稿をInsertする
export const insertPost = async (post: string, uuid: string) => {
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

//コメントをInsertする
export const insertComment = async (
  uuid: string,
  postId: number,
  comment: string
) => {
  const { error } = await supabase.from("comment_table").insert([
    {
      comment_user_id: uuid,
      post_id: postId,
      created_at: new Date(),
      updated_at: new Date(),
      comment,
    },
  ]);

  if (error) {
    toast.error(error.message);
  }
};

//投稿をdeleteする
export const deletePosts = async (user_id: string, post_id: number) => {
  const { data, error } = await supabase
    .from("post_table")
    .delete()
    .match({ user_id: user_id, post_id: post_id });

  error ? toast.error("削除に失敗しました…") : toast("削除しました！！");
};
