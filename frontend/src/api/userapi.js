import API from "./AuthApi";

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async () => {
  const response =
    await API.get("/user/profile");

  return response.data;
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (
  profileData
) => {
  const response =
    await API.put(
      "/user/profile",
      profileData
    );

  return response.data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (
  passwordData
) => {
  const response =
    await API.put(
      "/user/password",
      passwordData
    );

  return response.data;
};