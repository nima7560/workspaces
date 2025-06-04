import axios from "axios";

const API_URL = "http://localhost:5000/api/";

// Login User
export const loginUser = async (email, password) => {
  try {
    const response = await axios.post(
      `${API_URL}auth/login`,
      { email, password },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Login Error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Login failed";
  }
};

// Register User
export const registerUser = async (
  cid,
  email,
  phone,
  password,
  confirmPassword
) => {
  try {
    console.log("Registering with data:", {
      cid,
      email,
      phone,
      password,
      confirmPassword,
    });
    const response = await axios.post(
      `${API_URL}auth/register`,
      { cid, email, phone, password, confirmPassword },
      {
        withCredentials: true,
      }
    );
    return response.data;
  } catch (error) {
    console.error("Registration Error:", error.response?.data || error.message);
    throw error.response?.data?.message || "Registration failed";
  }
};

// Register Land
export const registerLand = async (formData) => {
  try {
    const data = new FormData();

    // Append form fields
    data.append("landType", formData.landType);
    data.append("location", formData.location);
    data.append("landSize", formData.landSize);
    data.append("boundaryDetails", formData.boundaryDetails);
    data.append("ownerName", formData.ownerName);
    data.append("cid", formData.cid); // changed from cidNumber
    data.append("contactNumber", formData.contactNumber);
    data.append("emailAddress", formData.emailAddress);
    data.append("ownershipType", formData.ownershipType);
    data.append("coOwners", formData.coOwners);
    data.append("thramNumber", formData.thramNumber); // Ensure thramNumber is sent

    // Append uploaded files
    if (formData.ownershipProof) {
      data.append("ownershipProof", formData.ownershipProof);
    }
    if (formData.thramCopy) {
      data.append("thramCopy", formData.thramCopy);
    }
    if (formData.surveyReport) {
      data.append("surveyReport", formData.surveyReport);
    }
    if (formData.taxClearance) {
      data.append("taxClearance", formData.taxClearance);
    }

    const response = await axios.post(
      `${API_URL}auth/govtland/register`, // Ensure this is the correct endpoint for land registration
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        withCredentials: true,
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Land Registration Error:",
      error.response.data || error.message
    );
    throw error.response?.data?.message || "Land registration failed";
  }
};
export const getGovtLands = async () => {
  try {
    const response = await axios.get(`${API_URL}auth/govtland`, {
      withCredentials: true,
    });
    return response.data.data; // Return the array of land records
  } catch (error) {
    throw error.response?.data || "Fetching government lands failed";
  }
};
