import { useCallback, useState } from "react";
import { useForm, UseFormRegisterReturn } from "react-hook-form";

import { Modal } from "src/components/molecules/headless_ui/modal";
import { insertProfile } from "src/components/functions/supabase";

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
