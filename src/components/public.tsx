import { Button } from "@supabase/ui";
import { useRouter } from "next/router";
import { ReactNode, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "src/libs/supabase";
import { convertDate } from "./functions/convertDate";
import { getPosts, getProfile, postPost } from "./functions/supabase";
import { InputProfile } from "./modal_contents/input_profile";

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
  post_id: string;
  posts: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  profiles: Profile;
};

export const Public = () => {
  const session = supabase.auth.session();
  const { replace } = useRouter();
  const { register, handleSubmit, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [posts, setPosts] = useState<PostsWithProfile[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const fetchedProfile = await getProfile(session.user!.id);
        const posts = await getPosts();
        setPosts(posts);
        setProfile(fetchedProfile?.shift());
        setIsLoading(false);
      };
      fetchData();
    } else {
      //localstrageにログイン情報がなければログイン画面へ
      replace("/signin");
    }
  }, [session]);

  //投稿したときの処理
  const handlePost = async (data: { post: string }) => {
    setIsLoading(true);
    await postPost(data.post, session?.user?.id!);
    const posts = await getPosts();
    setPosts(posts);
    setValue("post", "");
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
          {posts?.reverse().map((post) => {
            return (
              <div key={post.post_id} className="border mt-2 bg-purple-200">
                <p className="bg-purple-100 rounded p-4">{post.posts}</p>

                <div className="flex justify-between px-4">
                  <p className="font-bold">{post.profiles.username}</p>
                  <p className="text-right ml-auto">
                    {convertDate(post.created_at)}
                  </p>
                </div>
                <Button>コメント</Button>
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
