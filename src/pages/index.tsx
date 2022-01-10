import { ReactNode, useEffect, useState } from "react";

import { Auth, Button, IconLogOut } from "@supabase/ui";

import { supabase } from "src/libs/supabase";
import { LayoutWrapper } from "src/components/layouts/layoutWrapper";
import { InputProfile } from "src/components/modal_contents/input_profile";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import toast from "react-hot-toast";

type Props = {
  children: ReactNode;
};

type Profile = {
  avatar_url: string;
  id: string;
  updated_at: Date;
  username: string;
};

type Post={
  user_id:string;
  post_id:string;
  posts:string;
  created_at:Date;
  updated_at:Date;
  public:boolean;
}

//ユーザー情報をGETする
const getProfile = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

  if (!error && data) {
    return data;
  }
  return null;
};
//投稿をPOSTする
const postPost = async (post:string,uuid:string)=>{
  const { error } = await supabase
  .from("post_table")
  .insert([{ user_id: uuid , posts: post ,created_at: new Date(),updated_at: new Date(),public:true}]);
    if (error) toast.error(error.message);
}
//投稿をGETする
const getPosts = async ()=>{
  const { data, error } = await supabase.from("post_table").select("*");
console.log(data);

  if (!error && data) {
    return data as Post[];
  }
  return null;
}

const Container = () => {
  const { user } = Auth.useUser();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [posts, setPosts] = useState<Post[] | null>(null);
  const [isLoading, setIsLoading] = useState(true);
    const { register, handleSubmit } = useForm({
      mode: "onSubmit",
      reValidateMode: "onChange",
      criteriaMode: "firstError",
    });

  useEffect(() => {
    if(user){
      const fetchData = async()=>{
        const fetchedProfile = await getProfile();
        const posts = await getPosts();
        setPosts(posts);
        setProfile(fetchedProfile?.shift());
        setIsLoading(false);
      };
      fetchData();
    }
  }, [user]);
  
  // ログインしている場合
  if (user) {
    return (
      <>
        <form onSubmit={handleSubmit((data) => postPost(data.post,user.id))}>
          <textarea
            placeholder="ここで投稿してね！"
            {...register("post",{required:true})}
          />
          <button type="submit">投稿！</button>
        </form>
        <div className="flex flex-col">
          {posts?.map((post)=>{
            return (
              <div key={post.post_id} className="border">
                <p>{post.created_at}</p>
                <p>{post.posts}</p>
              </div>
            );
          })}
        </div>
        <Button
          size="medium"
          icon={<IconLogOut />}
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </Button>
        {!isLoading && !profile && <InputProfile uuid={user.id} />}
      </>
    );
  }
  // ログインしていない場合
  return (
    <div className="flex justify-center pt-8">
      <div className="w-full sm:w-96">
        <Auth
          supabaseClient={supabase}
          providers={["github"]}
          socialColors={true}
        />
      </div>
    </div>
  );
};

const Home = () => {
  return (
    <LayoutWrapper>
      <Auth.UserContextProvider supabaseClient={supabase}>
        <Container />
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
};
export default Home;
