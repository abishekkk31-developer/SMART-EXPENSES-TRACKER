import API from "./AuthApi";

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async () => {
  const response = await API.get(
    "/api/user/profile"
  );

  return response.data;
};

// ==========================================
// UPDATE PROFILE
// ==========================================

export const updateProfile = async (
  profileData
) => {
  const response = await API.put(
    "/api/user/profile",
    {
      name: profileData.name,
      email: profileData.email,
    }
  );

  return response.data;
};

// ==========================================
// CHANGE PASSWORD
// ==========================================

export const changePassword = async (
  passwordData
) => {
  const response = await API.put(
    "/api/user/password",
    {
      currentPassword:
        passwordData.currentPassword,

      newPassword:
        passwordData.newPassword,
    }
  );

  return response.data;
};