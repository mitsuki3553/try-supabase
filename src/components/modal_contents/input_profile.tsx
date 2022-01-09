import { useForm, UseFormRegisterReturn } from "react-hook-form";

import { supabase } from "src/libs/supabase";
import { Modal } from "src/components/headless_ui/modal";
import { useCallback, useState } from "react";

const insertProfile = async(username:string,uuid:string)=> {    
    const { error } = await supabase
      .from("profiles")
      .insert([{ username ,id:uuid}]);
      
}

type Props = {
    uuid:string;
}

export const InputProfile = (props:Props) => {
  const { register, handleSubmit, getValues } = useForm<UseFormRegisterReturn>({
    mode: "onSubmit",
    reValidateMode: "onChange",
    defaultValues: {},
    criteriaMode: "firstError",
  });
  const [isOpen, setIsOpen] = useState(true);
  const closeModal = useCallback(() => setIsOpen(false),[]);


  const handleProfileSubmit = async (data: { name: string }) => {
    insertProfile(data.name, props.uuid);
    setIsOpen(false);
  };

  return (
    <Modal title="ユーザー情報" isOpen={isOpen} closeModal={closeModal}>
      <form onSubmit={handleSubmit(handleProfileSubmit)}>
        <div>名前：</div>
        <input {...register("name", { required: true })} />
        <input type="submit" />
      </form>
    </Modal>
  );
}