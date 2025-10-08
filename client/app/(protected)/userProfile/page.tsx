"use client";

import { useAuthStore } from "@/store/useAuthStore";
const UserProfilePage = () => {

  // The layout already handles loading and redirection,
  // but it's good practice to have a fallback.
const {user} = useAuthStore();
 
  
  return (
    <div className="bg-white p-8 rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Profile Information</h2>
      <div className="space-y-4">
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
        {/* You can add more user details here, like address, once it's in the user object */}
      </div>
    </div>
  );
};

export default UserProfilePage;