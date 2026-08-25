import API from "./AuthApi";

// GET current user profile
export const getProfile = async () => {
  const response = await API.get("/auth/profile");

  return response.data;
};

// UPDATE current user profile
export const updateProfile = async (profileData) => {
  const response = await API.put(
    "/auth/profile",
    profileData
  );

  return response.data;
};