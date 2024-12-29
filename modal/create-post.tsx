import { SearchUser } from "@/components/common/search-user";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { ADD_POST } from "@/graphql/mutation";
import { GET_ACTIVE_USER, GET_POSTS } from "@/graphql/query";
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from "@/store/store";
import { Post } from "@/types/post";
import { GetUserByIdRes } from "@/types/user";
import { useMutation, useQuery } from "@apollo/client";
import { faAdd, faClose, faImages } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Field, Form, Formik, FormikProps } from "formik";
import { nanoid } from "nanoid";
import { ChangeEvent, useRef, useState } from "react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
};

type CreatePost = Omit<Post, "tags" | "location"> & { tags: string[] };

const CreatePost = ({ isOpen, onClose }: Props) => {
  const { toast } = useToast();
  const form = useRef<FormikProps<CreatePost>>(null);
  const [currentImage, setCurrentImage] = useState<number>(0);
  const userId = useAppStore((state) => state.user);
  const { data: activeUser } = useQuery<GetUserByIdRes>(GET_ACTIVE_USER, { variables: { id: userId }, skip: !userId });

  const [createPost, { loading }] = useMutation(ADD_POST, {
    refetchQueries: [{ query: GET_POSTS, variables: { id: userId } }],
    awaitRefetchQueries: true,
  });

  const onPost = async (values: CreatePost) => {
    if (loading) return;
    try {
      await createPost({ variables: values });
      onClose();
    } catch (error) {
      toast({ title: "Failed to create post", description: "Please try again", variant: "destructive" });
      console.log(error);
    }
  };

  const onAddMoreImage = (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files || [];

    const existingUrls = form.current?.values.media || [];

    const urlList: string[] = existingUrls;
    for (const file of files) {
      const url = URL.createObjectURL(file);
      urlList.push(url);
    }

    form?.current?.setFieldValue("media", urlList);
    setCurrentImage(urlList.length - 1);
    e.target.files = null;
  };

  const processFilesAsync = async (files: FileList) => {
    const existingUrls = form.current?.values.media || [];
    const urlList: string[] = [...existingUrls];

    const readFileAsDataURL = (file: File): Promise<string> =>
      new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = () => reject(new Error("Failed to read file"));
        reader.readAsDataURL(file);
      });

    try {
      const base64List = await Promise.all(Array.from(files).map((file) => readFileAsDataURL(file)));
      urlList.push(...base64List);
      form?.current?.setFieldValue("media", urlList);
    } catch (error) {
      toast({ title: "Failed to process file", description: "Please try again", variant: "destructive" });
      console.error("Error processing files:", error);
    }
  };

  const onUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) await processFilesAsync(files);

    e.target.files = null;
    setCurrentImage(0);
  };

  const onRemoveImage = () => {
    const images = form?.current?.values.media;

    const filtered = images?.filter((item, i) => i !== currentImage);
    form.current?.setFieldValue("media", filtered);
  };

  const initialvalues: CreatePost = {
    caption: "",
    createdBy: userId || "",
    id: nanoid(),
    media: [],
    tags: [],
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-white gap-0 max-w-4xl w-max outline-none rounded-2xl ">
        <h2 className="font-bold text-lg mb-3">Create post</h2>
        <Formik innerRef={form} initialValues={initialvalues} onSubmit={onPost}>
          {({ values, setFieldValue }) => {
            const onChangeTags = (id: string) => {
              const index = values.tags.findIndex((item) => item === id);
              const updated = index === -1 ? [...values.tags, id] : values.tags?.filter((item) => item !== id);
              setFieldValue("tags", updated);
            };

            return (
              <Form className="w-max flex items-center justify-start gap-5">
                {!values.media?.length ? (
                  <>
                    <label htmlFor="image-upload" className="cursor-pointer">
                      <div className="bg-gray-100 w-[28rem] aspect-square rounded-lg flex flex-col items-center justify-center border-2  border-dashed">
                        <FontAwesomeIcon icon={faImages} size="2xl" />
                        <h4 className="font-bold mt-4 text-gray-600">Add photos / videos</h4>
                        <p className="text-gray-400 text-sm">Add a photo to your post to make it more catchy</p>
                      </div>
                    </label>
                    <input type="file" accept="image/*" id="image-upload" className="hidden" onChange={onUpload} multiple />
                  </>
                ) : (
                  <div className="w-[28rem] aspect-square rounded-lg flex flex-col items-center justify-center overflow-hidden relative border">
                    <div onClick={onRemoveImage} className="absolute top-2 right-2 bg-black/20 w-6 h-6 flex items-center justify-center rounded-full cursor-pointer hover:bg-black/30 transition">
                      <FontAwesomeIcon icon={faClose} size="xs" />
                    </div>
                    <img src={values.media?.at(currentImage)} alt="" />

                    <div className="flex items-center gap-2 absolute bottom-2 right-2 z-10 backdrop-blur-sm p-2 rounded-sm bg-black/25">
                      {values.media?.map((item, i) => (
                        <img key={item} onClick={() => setCurrentImage(i)} src={item} alt="" className="w-16 h-16 border rounded-md cursor-pointer" />
                      ))}
                      <label htmlFor="add-image" className=" bg-white w-8 h-8 rounded-full flex items-center justify-center cursor-pointer hover:bg-gray-100 transition">
                        <FontAwesomeIcon icon={faAdd} />
                      </label>
                      <input type="file" accept="image/*" id="add-image" className="hidden" multiple onChange={onAddMoreImage} />
                    </div>
                  </div>
                )}

                <div className="w-[20rem] h-full flex flex-col">
                  <div className="flex gap-2 items-center mb-2">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={activeUser?.user.avatar} />
                      <AvatarFallback>{activeUser?.user?.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <p className="text-sm text-gray-600 font-semibold">Alice newman</p>
                  </div>
                  <Field as="textarea" name="caption" placeholder="What's happening?" className="w-full bg-gray-100 rounded-md p-2 focus:outline-none resize-none mb-3" rows={5} />
                  {/* <Field as={Input} name="location" placeholder="Add a location" className="mb-3 py-4" /> */}
                  <SearchUser values={values.tags} onChange={onChangeTags} />
                  <Button className="mt-auto rounded-lg">{loading ? <Spinner /> : "Post"}</Button>
                </div>
              </Form>
            );
          }}
        </Formik>
      </DialogContent>
    </Dialog>
  );
};

export default CreatePost;
