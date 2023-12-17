import * as z from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
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
import ProfileUploader from "@/components/ui/shared/ProfileUploader"
import { Textarea } from "@/components/ui/textarea"
import { Loader } from "lucide-react"

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
    if (!currentUser) {
      // the scenario where currentUser is undefined or null
      console.error("Current user not found");
      return; 
    }
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
      <form 
          onSubmit={form.handleSubmit(handleUpdate)} 
          className="flex flex-col gap-7 w-full mt-4 max-w-5xl">
        <FormField
          control={form.control}
          name="file"
          render={({ field }) => (
            <FormItem className="flex">
              <FormControl>
                <ProfileUploader  fieldChange={field.onChange} mediaUrl={currentUser?.imageUrl} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
       
       <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shadcn-form_label">Username</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} disabled />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

       <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shadcn-form_label">Email</FormLabel>
              <FormControl>
                <Input type="text" className="shad-input" {...field} disabled/>
              </FormControl>
            
              <FormMessage />
            </FormItem>
          )}
        />

          <FormField
          control={form.control}
          name="bio"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="shadcn-form_label">Bio</FormLabel>
              <FormControl>
               <Textarea className="shad-textarea custom-scollbar" {...field}/>
              </FormControl>
            
              <FormMessage className="shad-form_message"/>
            </FormItem>
          )}
        />
        <div className="flex gap-4 items-center justify-end">
        <Button type="button" className="shad-button_dark_4" 
        onClick={()=> navigate(-1)}
        >Cancel</Button>
        <Button 
        type="submit" className="shad-button_primary whitespace-nowrap"
        disabled={isLoadingUpdate}
        {...isLoadingUpdate && <Loader/>}> Update Profile
        </Button>
        </div>
        
      </form>
    </Form>



    </div>
  )
}

export default UpdateProfile
