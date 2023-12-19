import Loader from "@/components/ui/shared/Loader";
import UserCard from "@/components/ui/shared/UserCard";
import { useToast } from "@/components/ui/use-toast";
import { useGetUsers } from "@/lib/react-query/queriesAndMutations";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";

const AllUsers = () => {
  const { toast } = useToast();
  const {
    data: users,
    fetchNextPage,
    hasNextPage,
    isError: isErrorCreators,
  } = useGetUsers();

  useEffect(() => {
    if (isErrorCreators) {
      toast({ title: "Something went wrong." });
    }
  }, [isErrorCreators, toast]);

  const creators = users?.pages.flatMap(page => page?.documents || []) || [];
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, fetchNextPage]);

  const noMoreUsers = !hasNextPage && creators.length === 0;
  const isLoading = !noMoreUsers && hasNextPage && inView;

  return (
    <div className="common-container">
      <div className="user-container">
        <h2 className="h3-bold md:h2-bold text-left w-full">All Users</h2>
        {noMoreUsers && <p>No more users</p>}
        <ul className="user-grid">
          {creators.map((creator, index) => (
            <li key={creator?.$id || index} className="flex-1 min-w-[200px] w-full">
              <UserCard user={creator} />
            </li>
          ))}
        </ul>
        {isLoading && (
          <div ref={ref}>
            {/* Loader when there are more profiles and inView */}
            <Loader />
          </div>
        )}
      </div>
    </div>
  );
}

export default AllUsers
