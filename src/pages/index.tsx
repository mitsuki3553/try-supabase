import { ReactNode, useState, useEffect } from "react";
import { useRouter } from "next/router";
import { useForm } from "react-hook-form";
import { Button, IconLogOut } from "@supabase/ui";

import { supabase } from "src/libs/supabase";
import { InputProfile } from "src/components/modal_contents/input_profile";
import {
  getPosts,
  getProfile,
  postPost,
} from "src/components/functions/supabase";
import { LayoutWrapper } from "src/components/layouts/layoutWrapper";
import { convertDate } from "src/components/functions/convertDate";

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

export default function Home() {
  const session = supabase.auth.session();
  const { replace } = useRouter();
  const { register, handleSubmit } = useForm({
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


  return (
    <LayoutWrapper>
      <div className="h-screen flex center items-center justify-center">
        <div className="sm:max-w-xl bg-white  w-full sm:rounded-lg p-5 shadow">
          <h2>ログイン中</h2>
          <form
            className="mt-2"
            onSubmit={handleSubmit((data) =>
              postPost(data.post, session?.user?.id!)
            )}
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
          <div className="flex flex-col my-4">
            {posts?.map((post) => {
              return (
                <div key={post.post_id} className="border mt-2 bg-purple-200">
                  <p className="bg-purple-100 rounded p-4">{post.posts}</p>

                <div className="flex justify-between px-4">
                  <p className="font-bold">{post.profiles.username}</p>
                  <p className="text-right ml-auto">{convertDate(post.created_at)}</p>
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
    </LayoutWrapper>
  );
}
