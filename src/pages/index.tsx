import { ReactNode, useEffect, useState } from "react";

import { Auth, Button, IconLogOut } from "@supabase/ui";

import { supabase } from "src/libs/supabase";
import { LayoutWrapper } from "src/components/layoutWrapper";
import { InputProfile } from "src/components/modal_contents/input_profile";

type Props = {
  children: ReactNode;
};

const getProfile = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    
  if (!error && data) {
    return data;
  }
  return null;
};

const Container = (props: Props) => {
  const { user } = Auth.useUser();
  const [ data,setData ] = useState<any>(null);
  const [ isLoading, setIsLoading] = useState(true);


  useEffect(()=>{
    async()=>{
      setData(getProfile());
    }
    setIsLoading(false);
  }  ,[]);
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
          {!isLoading && !data && <InputProfile uuid={user.id}/>}
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
        <Container>
        </Container>
      </Auth.UserContextProvider>
    </LayoutWrapper>
  );
};
export default Home;
