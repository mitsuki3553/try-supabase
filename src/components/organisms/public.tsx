import { Button } from "@supabase/ui";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { supabase } from "src/libs/supabase";
import { convertDate } from "src/components/functions/convertDate";
import {
  deletePosts,
  getCommentsCount,
  getPosts,
  getProfile,
  insertPost,
} from "src/components/functions/supabase";
import { InputProfile } from "src/components/molecules/modal_contents/input_profile";
import { InputComment } from "src/components/molecules/modal_contents/input_comment";

type Profile = {
  avatar_url: string;
  id: string;
  updated_at: string;
  username: string;
};

type PostsWithProfile = {
  user_id: string;
  post_id: number;
  posts: string;
  created_at: string;
  updated_at: string;
  public: boolean;
  profiles: Profile;
};

type CommentCount = {
  comment_count: number;
};

export const Public = () => {
  const session = supabase.auth.session();
  const { replace } = useRouter();
  const { register, handleSubmit, setValue } = useForm({
    mode: "onSubmit",
    reValidateMode: "onChange",
  });

  const [profile, setProfile] = useState<Profile | undefined>(undefined);
  const [posts, setPosts] = useState<
    (PostsWithProfile & CommentCount)[] | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (session) {
      const fetchData = async () => {
        const fetchedProfile = await getProfile(session.user!.id);
        await commonFetch();
        setProfile(fetchedProfile?.shift());
      };
      fetchData();
    } else {
      //localstrageにログイン情報がなければログイン画面へ
      replace("/signin");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session]);

  //投稿したときの処理
  const handlePost = async (data: { post: string }) => {
    setIsLoading(true);
    await insertPost(data.post, session?.user?.id!);
    await commonFetch();
    setValue("post", "");
  };

  //削除したときの処理
  const handleDelete = async (user_id: string, post_id: number) => {
    setIsLoading(true);
    await deletePosts(user_id, post_id);
    await commonFetch();
  };

  const commonFetch = async () => {
    const posts = await getPosts();
    const postsCount = await Promise.all(
      posts!.map(async (item) => {
        const count = await getCommentsCount(item.post_id);
        return { ...item, ...count };
      })
    );
    postsCount && setPosts(postsCount.reverse());
    setIsLoading(false);
  };

  return (
    <div className="flex justify-center mt-16">
      <div className="sm:max-w-xl bg-white  w-full sm:rounded-lg p-5 shadow">
        <form className="mt-2" onSubmit={handleSubmit(handlePost)}>
          <textarea
            placeholder="ここから投稿してね！"
            className="w-full border-2 rounded-lg"
            {...register("post", { required: true })}
          />
          <Button role="submit" block loading={isLoading}>
            投稿！
          </Button>
        </form>
        <div className="flex flex-col my-4">
          {posts?.map((post) => {
            return (
              <div key={post.post_id} className="border mt-2 bg-purple-200">
                <p className="font-bold mx-2">{post.profiles.username}</p>
                <p className="text-right ml-auto mr-2">
                  {convertDate(post.created_at)}
                </p>
                <CommentModal post={post.posts} postId={post.post_id} userName={post.profiles.username}/>
                <p className="cursor-pointer">
                  コメント数：{post.comment_count}
                </p>

                <div className="flex justify-between px-4"></div>
                <InputComment uuid={session?.user?.id!} postId={post.post_id} />
                {post.user_id === session!.user!.id && (
                  <Button
                    onClick={() => {
                      handleDelete(post.user_id, post.post_id);
                    }}
                    className="mx-2"
                    danger
                  >
                    削除
                  </Button>
                )}
              </div>
            );
          })}
        </div>
        {!isLoading && !profile && <InputProfile uuid={session?.user?.id!} />}
      </div>
    </div>
  );
};

import { Modal } from "src/components/molecules/headless_ui/modal";
import { useCallback } from "react";

type Props = {
  post: string;
  postId: number;
  userName: string;
};

const noUser = {
  avatar_url: "",
  id: "",
  updated_at: "",
  username: "NoName"
}

type CommentsWithProfiles = {
  profile:Profile;
} & Comment

const CommentModal = (props: Props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [comments, setComments] = useState<CommentsWithProfiles[] | undefined>(undefined);

  const closeModal = useCallback(() => setIsOpen(false), []);

  return (
    <>
      <p
        className="bg-purple-100 rounded p-4 cursor-pointer"
        onClick={async () => {
          const comments = await getComments(props.postId);
          if(comments){
            const commentsWithProfiles =   await Promise.all(
              comments.map(async(comment)=>{
              const profileArr = await getProfile(comment.comment_user_id) ;
              const profile = (profileArr && profileArr.length) ? profileArr[0] : noUser;
              return profile && {...comment,profile:profile}  
            }))
            setComments(commentsWithProfiles);
          }          
          setIsOpen(true);
        }}
      >
        {props.post}
      </p>
      <Modal isOpen={isOpen} closeModal={closeModal} title="Comment">
        {comments?.map((comment) => {
          return (
            <div key={comment.comment_id} className="m-4 bg-green-100 rounded-sm">
              <div className="flex justify-between px-4">
                <div>{comment.profile.username}</div>
                <div>{convertDate(comment.created_at)}</div>
              </div>
              <p className="bg-purple-100 rounded p-4">
                {comment.comment}
              </p>
            </div>
          );
        })}
        <Button onClick={closeModal}>閉じる</Button>
      </Modal>
    </>
  );
};

//コメントをGETする
export const getComments = async (id: number) => {
  const { data, error } = await supabase
    .from<Comment>("comment_table")
    .select("*")
    .eq("post_id", id);

  if (!error && data) {
    return data;
  }

  console.error(error);
  // error && toast.error("情報取得に失敗しました…");
  return null;
};

type Comment = {
  comment_id: number;
  comment_user_id: string;
  post_id: number;
  created_at: string;
  updated_at: string;
  comment: string;
  profiles: Profile;
};
