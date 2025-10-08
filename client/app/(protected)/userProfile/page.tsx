"use client";

import { useAuthStore } from "@/store/useAuthStore";

const UserProfilePage = () => {
  const { user } = useAuthStore();

  // The layout already handles loading and redirection,
  // but it's good practice to have a fallback.
  if (!user) {
    return null;
  }

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