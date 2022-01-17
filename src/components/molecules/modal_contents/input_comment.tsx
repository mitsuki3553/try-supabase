import { useCallback, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import toast from "react-hot-toast";

import { supabase } from "src/libs/supabase";
import { Modal } from "src/components/molecules/headless_ui/modal";
import { Button } from "@supabase/ui";

const insertProfile = async (username: string, uuid: string) => {
  const { error } = await supabase
    .from("profiles")
    .insert([{ username, id: uuid, created_at: new Date() }]);

  if (error) {
    toast.error(error.message);
  }
};

type Props = {
  uuid: string;
};

export const InputComment = (props: Props) => {
  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleProfileSubmit = async (data: { comment: string }) => {
    alert(`${data.comment}を投稿予定！`);
    setIsOpen(false);
  };
  //デフォルトの表示
  if(!isOpen){
    return <Button onClick={()=>{setIsOpen((prev)=>!prev)}}>コメント</Button>;
  }

  //"コメント"が押されたときの表示
  return (
    <>
      <Button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        コメント
      </Button>
      <Modal
        title="投稿するコメント"
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <form onSubmit={handleSubmit(handleProfileSubmit)}>
          <div>コメント：</div>
          <input {...register("comment", { required: true })} />
          <input type="submit" />
        </form>
      </Modal>
    </>
  );
};
