import { ReactNode, useEffect, useState } from "react";

import { Auth, Button, IconLogOut } from "@supabase/ui";

import { supabase } from "src/libs/supabase";
import { LayoutWrapper } from "src/components/layoutWrapper";
import { InputProfile } from "src/components/modal_contents/input_profile";

type Props = {
  children: ReactNode;
};

type Profile = {
  avatar_url: string;
  id: string;
  updated_at: Date;
  username: string;
};

const getProfile = async () => {
  const { data, error } = await supabase.from("profiles").select("*");

  if (!error && data) {
    return data;
  }
  return null;
};

const Container = () => {
  const { user } = Auth.useUser();
  const [data, setData] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if(user){
      const fetchData = async()=>{
        const data = await getProfile();
        setData(data?.shift());
        setIsLoading(false);
      };
      fetchData();
    }
  }, [user]);
  
  // ログインしている場合
  if (user) {
    return (
      <>
        <Button
          size="medium"
          icon={<IconLogOut />}
          onClick={() => supabase.auth.signOut()}
        >
          Sign out
        </Button>
        {!isLoading && !data && <InputProfile uuid={user.id} />}
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
