import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { ProfileValidation } from "@/lib/validation";

import { useGetUserById, useUpdateUser } from "@/lib/react-query/queriesAndMutations"
import { useNavigate, useParams } from "react-router-dom"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "@/components/ui/use-toast"

const UpdateProfile = () => {
  const {id} = useParams();
  const {user, setUser } = useUserContext();
  const navigate = useNavigate();
  const {data: currentUser} = useGetUserById(id || '');

  const { mutateAsync: updateUser, isPending: isLoadingUpdate } = useUpdateUser();


  const form = useForm<z.infer<typeof ProfileValidation>>({
    resolver: zodResolver(ProfileValidation),
    defaultValues: {
      file: [],
      name: user.name,
      username: user.username,
      email: user.email,
      bio: user.bio || "",
    },
  });

  const handleUpdate = async(value: z.infer<typeof ProfileValidation>) => {
    const updatedUser = await updateUser({
      userId: currentUser.$id,
      name: value.name,
      bio: value.bio,
      file: value.file,
      imageUrl: currentUser?.imageUrl,
      imageId: currentUser?.imageId,
    });
    if (!updatedUser) {
      toast({
        title: `Update user failed. Please try again.`,
      });
    }

  
  setUser({
    ...user,
    name: updatedUser?.name,
    bio: updatedUser?.bio,
    imageUrl: updatedUser?.imageUrl,
  });
  return navigate(`/profile/${id}`);
};
    
  return (
    <div className="flex flex-1">
      <div className="common-container">
         <div className="flex w-full gap-2 max-w-5xl">
          <img src='/assets/icons/edit.svg'
          alt='Saved post'
          width={36}
          height={36}
          className="invert-white"
          />
          <h2 className="h3-bold text-left w-full md:h2-bold">Edit Profile</h2>
       </div>
      </div>
      
      <Form {...form}>
      <form onSubmit={form.handleSubmit(handleUpdate)} className="space-y-8">
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input placeholder="shadcn" {...field} />
              </FormControl>
              <FormDescription>
                This is your public display name.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>



    </div>
  )
}

export default UpdateProfile
