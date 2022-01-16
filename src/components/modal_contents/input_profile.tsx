import { useCallback, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";
import toast from "react-hot-toast";

import { supabase } from "src/libs/supabase";
import { Modal } from "src/components/headless_ui/modal";

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

export const InputProfile = (props: Props) => {
  const { register, handleSubmit } = useForm<UseFormRegisterReturn>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    criteriaMode: "firstError",
  });
  const [isOpen, setIsOpen] = useState(true);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleProfileSubmit = async (data: { name: string }) => {
    insertProfile(data.name, props.uuid);
    setIsOpen(false);
  };

  return (
    <>
      <Modal
        title="ユーザープロフィール"
        isOpen={isOpen}
        closeModal={closeModal}
      >
        <form onSubmit={handleSubmit(handleProfileSubmit)}>
          <div>名前：</div>
          <input {...register("name", { required: true })} />
          <input type="submit" />
        </form>
      </Modal>
    </>
  );
};
