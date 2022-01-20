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
  console.error({ getProfile: error });
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
  console.error({ getPosts: error });
  error && toast.error("投稿情報1の取得に失敗しました…");
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
  console.error({ getCoomentCount: error });
  toast.error("投稿情報2の取得に失敗しました…");
  return { comment_count: -1 };
};

//ユーザー情報をInsertする
export const insertProfile = async (username: string, uuid: string) => {
  const { error } = await supabase
    .from("profiles")
    .insert([{ username, id: uuid, created_at: new Date() }]);

  if (error) {
    console.error({ insertProfile: error });
    toast.error("ユーザー情報の登録に失敗しました…");
  } else {
    toast.success("保存しました！");
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

  if (error) {
    console.error({ insertPost: error });
    toast.error("投稿に失敗しました…");
  } else {
    toast.success("投稿しました！");
  }
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
    console.error({ insertComment: error });
    toast.error("コメントに失敗しました…");
  } else {
    toast.success("コメントしました！");
  }
};

//投稿をdeleteする
export const deletePosts = async (user_id: string, post_id: number) => {
  const { data, error } = await supabase
    .from("post_table")
    .delete()
    .match({ user_id: user_id, post_id: post_id });

  if (error) {
    console.error({ insertComment: error });
    toast.error("投稿の削除に失敗しました…");
  } else {
    toast.success("投稿を削除しました！");
  }
};
