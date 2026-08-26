import API from "./AuthApi";

// ==========================================
// GET PROFILE
// ==========================================

export const getProfile = async () => {
  const response = await API.get(
    "/api/auth/profile"
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
    "/api/auth/profile",
    {
      name: profileData.name,
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
    "/api/auth/password",
    passwordData
  );

  return response.data;
};