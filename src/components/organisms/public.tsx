import { Button } from "@supabase/ui";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "src/libs/supabase";
import { convertDate } from "src/components/functions/convertDate";
import {
  deletePosts,
  getPosts,
  getProfile,
  insertPost,
} from "src/components/functions/supabase";
import { InputProfile } from "src/components/molecules/modal_contents/input_profile";
import { InputComment } from "src/components/molecules/modal_contents/input_comment";
import toast from "react-hot-toast";

type Props = {
  children: ReactNode;
};

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

type comment = {
  comment_count: number;
}


const getCommentsCount = async (postId: number) => {
  const { error,count } = await supabase
    .from("comment_table")
    .select("count", { count: "exact" })
    .eq( "post_id", postId );
    
  if ((!error && count) || count === 0) {
    return { comment_count: count };
  }
    console.error(error);
    toast.error("情報取得に失敗しました…");
    return { comment_count: -1 };  
};

export const Public = () => {
  const session = supabase.auth.session();
  const { replace } = useRouter();
  const { register, handleSubmit, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [posts, setPosts] = useState<
    (PostsWithProfile & comment )[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const fetchedProfile = await getProfile(session.user!.id);
        const posts = await getPosts();
        const postsCount = await Promise.all(
          posts!.map(async (item) => {
            const count = await getCommentsCount(item.post_id);
            return { ...item, ...count };
          })
        );

        posts && setPosts(postsCount?.reverse());
        setProfile(fetchedProfile?.shift());
        setIsLoading(false);
      };
      fetchData();
    } else {
      //localstrageにログイン情報がなければログイン画面へ
      replace("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  //投稿したときの処理
  const handlePost = async (data: { post: string }) => {
    setIsLoading(true);
    await insertPost(data.post, session?.user?.id!);
    const posts = await getPosts();
    const postsCount = await Promise.all(
      posts!.map(async (item) => {
        const count = await getCommentsCount(item.post_id);
        return { ...item, ...count };
      })
    );
    posts && setPosts(postsCount.reverse());
    setValue("post", "");
    setIsLoading(false);
  };

  //削除したときの処理
  const handleDelete = async (user_id: string, post_id: number) => {
    setIsLoading(true);
    await deletePosts(user_id, post_id);
    const posts = await getPosts();
    const postsCount = await Promise.all(
      posts!.map(async (item) => {
        const count = await getCommentsCount(item.post_id);
        return { ...item, ...count };
      })
    );
    posts && setPosts(postsCount.reverse());

    setIsLoading(false);
  };

  return (
    <div className="flex justify-center">
      <div className="sm:max-w-xl bg-white  w-full sm:rounded-lg p-5 shadow">
        <form className="mt-2" onSubmit={handleSubmit(handlePost)}>
          <textarea
            placeholder="ここから投稿してね！"
            className="w-full"
            {...register("post", { required: true })}
          />
          <Button role="submit" block>
            投稿！
          </Button>
        </form>
        <div className="flex flex-col my-4">
          {posts?.map((post) => {
            return (
              <div key={post.post_id} className="border mt-2 bg-purple-200">
                  <p className="font-bold">{post.profiles.username}</p>
                  <p className="text-right ml-auto">
                    {convertDate(post.created_at)}
                  </p>
                <p className="bg-purple-100 rounded p-4">{post.posts}</p>
                <p>コメント数：{post.comment_count}</p>

                <div className="flex justify-between px-4">
                </div>
                <InputComment uuid={session?.user?.id!} postId={post.post_id} />
                {post.user_id === session!.user!.id && (
                  <Button
                    onClick={() => {
                      handleDelete(post.user_id, post.post_id);
                    }}
                    className="mx-2"
                    danger
                  >
                    削除
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        {!isLoading && !profile && <InputProfile uuid={session?.user?.id!} />}

        <Button
          block
          onClick={() => {
            supabase.auth.signOut();
            replace("/");
          }}
        >
          サインアウト
        </Button>
      </div>
    </div>
  );
};
