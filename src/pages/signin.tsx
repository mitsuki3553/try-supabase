import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/router";
import { Input, Button, IconKey, IconMail } from "@supabase/ui";
import { useForm, Controller } from "react-hook-form";
import toast from "react-hot-toast";

import { supabase } from "src/libs/supabase";

type formData = {
  email: string;
  password: string;
};

export default function Signin() {
  const { replace } = useRouter();
  const session = supabase.auth.session();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const runSignin = async ({ email, password }: formData) => {
    const res = await supabase.auth.signIn({
      email,
      password,
    });
    console.log(res);

    res?.error && replace("/");
    res.error && toast.error("ログインに失敗しました！");
  };

  useEffect(() => {
    //サインインしていればトップページへ遷移
    session && replace("/");
  }, [session]);

  return (
    <div className="h-screen flex center items-center justify-center">
      <div className="sm:max-w-xl bg-white  w-full sm:rounded-lg p-5 shadow">
        <form onSubmit={handleSubmit(runSignin)}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur } }) => (
              <Input
                onBlur={onBlur}
                onChange={onChange}
                type="email"
                label="Email"
                icon={<IconMail />}
                error={errors.email ? errors.email.message : ""}
                placeholder="メールアドレス"
              />
            )}
            rules={{
              required: "必須項目です。",
              pattern: {
                value:
                  /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/,
                message: "メールアドレスが不適切です。",
              },
            }}
          />
          <Controller
            control={control}
            name="password"
            render={({ field: { onChange, onBlur } }) => (
              <Input
                onBlur={onBlur}
                onChange={onChange}
                type="password"
                icon={<IconKey />}
                label="Password"
                error={errors.password ? errors.password.message : ""}
                placeholder="パスワード(8文字以上)"
              />
            )}
            rules={{
              required: "必須項目です。",
              pattern: {
                value: /^[a-z\d]{8,100}$/i,
                message: "パスワードは8文字以上です。",
              },
            }}
          />
          <div className="h-4" />
          <Button block>送信</Button>
          <div className="h-4" />
          <Link href="/signup">
            <a className=" font-bold hover:text-gray-500">
              サインアップはこちら
            </a>
          </Link>
        </form>
      </div>
    </div>
  );
}
