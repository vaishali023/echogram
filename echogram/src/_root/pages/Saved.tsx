import GridPostList from "@/components/ui/shared/GridPostList";
import { useGetCurrentUser } from "@/lib/react-query/queriesAndMutations"
import { Models } from "appwrite";
import { Loader } from "lucide-react";

const Saved = () => {

  const { data: currentUser} = useGetCurrentUser();
  const savedPosts = currentUser?.save.map((savePost: Models.Document) => ({
    ...savePost.post,
    creator: {
      imageUrl: currentUser.imageUrl,
    }
  })).reverse();


  return (
    <div className="saved-container">
     <div className="flex w-full gap-2 max-w-5xl">
      <img src='/assets/icons/save.svg'
       alt='Saved post'
       width={36}
       height={36}
       className="invert-white"
       />
       <h2 className="h3-bold text-left w-full md:h2-bold">Saved Posts</h2>
     </div>
    {!currentUser ? (
      <Loader /> 
    ): (
      <ul className="w-full flex justify-center max-w-5xl gap-9">
        {savedPosts.length === 0 ? (
          <p className="text-light-4">No available posts</p>
        ):(
          <GridPostList posts={savedPosts} showStats={false} />
        )}
      </ul>
    )}
    </div>
  )
}

export default Saved
