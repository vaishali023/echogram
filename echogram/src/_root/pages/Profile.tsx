
const Profile = () => {

  const {data:currentUser} = useGetUserById(id || '');

  return (
    <div className="profile-container">
      <div className="profile-inner-container">
        <div className="flex xl:flex-row flex-col max-xl:items-center flex-1 gap-7">
          <img src={
              currentUser.imageUrl || "/assets/icons/profile-placeholder.svg"
            }
            alt="profile"
            className="w-28 h-28 lg:h-36 lg:w-36 rounded-full" />
        </div>
      </div>
      
    </div>
  )
}

export default Profile
