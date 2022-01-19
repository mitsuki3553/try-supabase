import { Button } from "@supabase/ui";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { supabase } from "src/libs/supabase";
// import logo from "public/logo.png";

export const Header = () => {
  const { replace } = useRouter();
  return (
    <header className=" gap-4 py-2 text-gray-600 bg-gray-200">
      {/* <Link href="/">
        <a><Image src={logo} alt="logo" width={75} height={75} /></a>
      </Link> */}
      <Link href="/">
        <a className="text-4xl text-center">
          <h1 className="pt-2 m-2">Post Next</h1>
        </a>
      </Link>
      <span className="block text-right px-4">
        <Button
          onClick={() => {
            supabase.auth.signOut();
            replace("/");
          }}
        >
          サインアウト
        </Button>
      </span>
    </header>
  );
};
