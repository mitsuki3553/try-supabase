import { Button } from "@supabase/ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "src/libs/supabase";
// import logo from "public/logo.png";

export const Header = () => {
  const session = supabase.auth.session();
  
  const { replace } = useRouter();
  return (
    <header className=" gap-4 py-2 text-gray-600 bg-gray-200 grid grid-cols-3">
      {/* <Link href="/">
        <a><Image src={logo} alt="logo" width={75} height={75} /></a>
      </Link> */}
      <div className="col-start-2">
      <Link href="/">
        <a className="text-4xl text-center ">
          <h1 className="pt-2 m-2">Post Next</h1>
        </a>
      </Link>
      </div>
      <span className="block text-right px-4 my-auto">
        {session && <Button
          onClick={() => {
            supabase.auth.signOut();
            replace("/");
          }}
        >
          サインアウト
        </Button>}
      </span>
    </header>
  );
};
