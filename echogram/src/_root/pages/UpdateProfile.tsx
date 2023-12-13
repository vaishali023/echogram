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

import { useGetUserById } from "@/lib/react-query/queriesAndMutations"

const UpdateProfile = () => {
  const {data: currentUser} = useGetUserById(id || '');

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
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
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
