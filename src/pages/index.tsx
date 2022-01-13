import { ReactNode, useState } from "react";
import { Button, IconLogOut } from "@supabase/ui";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "src/libs/supabase";
import { InputProfile } from "src/components/modal_contents/input_profile";
import { getPosts, getProfile, postPost } from "src/components/functions/supabase";

type Props = {
  children: ReactNode;
};

type Profile = {
  avatar_url: string;
  id: string;
  updated_at: Date;
  username: string;
};

type Post = {
  user_id: string;
  post_id: string;
  posts: string;
  created_at: Date;
  updated_at: Date;
  public: boolean;
};

export default function Home() {
  const session = supabase.auth.session();
  const { replace } = useRouter();
  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

    const [profile, setProfile] = useState<Profile | null>(null);
    const [posts, setPosts] = useState<Post[] | null>(null);
    const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const fetchedProfile = await getProfile();
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

  return (
    <div className="h-screen flex center items-center justify-center">
      <div className="sm:max-w-xl bg-white  w-full sm:rounded-lg p-5 shadow">
        <h2>ログイン中</h2>
        <form
          className="mt-2"
          onSubmit={handleSubmit((data) => postPost(data.post, session?.user?.id!))}
        >
          <textarea
            placeholder="ここで投稿してね！"
            className="w-full"
            {...register("post", { required: true })}
          />
          <Button role="submit" block>
            投稿！
          </Button>
        </form>
        <div className="flex flex-col">
          {posts?.map((post) => {
            return (
              <div key={post.post_id} className="border">
                <p>{post.created_at}</p>
                <p>{post.posts}</p>
                <form>
                  <Button role="submit">コメント</Button>
                </form>
              </div>
            );
          })}
        </div>
        {!isLoading && !profile && <InputProfile uuid={session?.user?.id!} />}

        <Button
          block
          onClick={() => {
            supabase.auth.signOut()
            replace("/");
          }}
        >
          サインアウト
        </Button>
      </div>
    </div>
  );
}
