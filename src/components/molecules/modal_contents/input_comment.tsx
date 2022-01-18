import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { Button } from "@supabase/ui";

import { Modal } from "src/components/molecules/headless_ui/modal";
import { insertComment } from "src/components/functions/supabase";

type Props = {
  uuid: string;
  postId: number;
};

export const InputComment = (props: Props) => {
  const { register, handleSubmit } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = useCallback(() => setIsOpen(false), []);

  const handleProfileSubmit = async (data: { comment: string }) => {
    insertComment(props.uuid, props.postId, data.comment);
    setIsOpen(false);
  };
  //デフォルトの表示
  if (!isOpen) {
    return (
      <Button
        onClick={() => {
          setIsOpen((prev) => !prev);
        }}
      >
        コメント
      </Button>
    );
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
      <Modal title="投稿するコメント" isOpen={isOpen} closeModal={closeModal}>
        <form onSubmit={handleSubmit(handleProfileSubmit)}>
          <div>コメント：</div>
          <input {...register("comment", { required: true })} />
          <input type="submit" />
        </form>
      </Modal>
    </>
  );
};
