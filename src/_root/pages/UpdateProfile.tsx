import ProfileForm from "@/components/forms/ProfileForm";

const UpdateProfile = () => {
  return (
    <div className="flex flex-1 flex-col p-12 gap-6 max-w-[1124px] mx-auto">
      <div className="flex gap-3">
        <img
          src="/assets/icons/edit.svg"
          alt=""
          className="stroke-black fill-black"
        />
        <h1 className="h1-bold">Edit Profile</h1>
      </div>
      <div className="max-w-[40rem]">
        <ProfileForm />
      </div>
    </div>
  );
};

export default UpdateProfile;
