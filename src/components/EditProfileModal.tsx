"use client";

import React, { useState, useEffect, ChangeEvent } from "react";

interface EditProfileModalProps {
  currentUsername: string;
  currentProfileImage: string;
  onClose: () => void;
  email: string; // 🟡 pass user's email to identify in DB
}

export default function EditProfileModal({
  currentUsername,
  currentProfileImage,
  onClose,
  email,
}: EditProfileModalProps) {
  const [username, setUsername] = useState(currentUsername);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState(currentProfileImage);
  const [isSaving, setIsSaving] = useState(false);
  const [showSuccessPopup, setShowSuccessPopup] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    if (!profileImageFile) {
      setPreviewImage(currentProfileImage);
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(profileImageFile);
  }, [profileImageFile, currentProfileImage]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleUpdate = async () => {
    if (!username || !email) {
      setErrorMessage("Username or email missing.");
      return;
    }

    setIsSaving(true);
    setErrorMessage(null);

    try {
      let imageBase64 = previewImage;

      // Optional: If new image was selected, ensure it's base64 string
      if (profileImageFile) {
        const reader = new FileReader();
        reader.readAsDataURL(profileImageFile);
        await new Promise<void>((resolve) => {
          reader.onload = () => {
            imageBase64 = reader.result as string;
            resolve();
          };
        });
      }

      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          newUsername: username,
          newImage: imageBase64,
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to update profile");

      // Update localStorage
      localStorage.setItem("username", data.user.username);
      if (data.user.profileImage) {
        localStorage.setItem("profileImage", data.user.profileImage);
      }

      setShowSuccessPopup(true);
    } catch (error) {
      console.error(error);
      setErrorMessage("Failed to update profile.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleSuccessOk = () => {
    setShowSuccessPopup(false);
    onClose();
    window.location.reload(); // 🔁 reload to reflect changes everywhere
  };

  return (
    <>
      {/* Overlay */}
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />

      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-gray-900 text-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl font-bold"
          >
            &times;
          </button>

          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

          {/* Profile image preview */}
          <div className="mb-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-700">
              <img src={previewImage} alt="Profile Preview" className="object-cover w-full h-full" />
            </div>
            <label htmlFor="profileImageInput" className="cursor-pointer text-orange-400 hover:text-orange-500">
              Change Profile Image
            </label>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
            />
          </div>

          {/* Username input */}
          <div className="mb-4">
            <label htmlFor="usernameInput" className="block mb-1 font-semibold">
              Username
            </label>
            <input
              id="usernameInput"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-3 py-2 rounded-md bg-gray-800 border border-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-orange-400"
              placeholder="Enter new username"
              disabled={isSaving}
            />
          </div>

          {errorMessage && <p className="text-red-500 mb-4 text-center">{errorMessage}</p>}

          <div className="flex justify-end space-x-4">
            <button onClick={onClose} disabled={isSaving} className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md">
              Cancel
            </button>
            <button
              onClick={handleUpdate}
              disabled={isSaving}
              className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-md font-semibold"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {/* Success popup */}
      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Profile updated successfully!</h3>
            <button
              onClick={handleSuccessOk}
              className="bg-orange-400 hover:bg-orange-500 px-6 py-2 rounded-md font-semibold"
            >
              Okay
            </button>
          </div>
        </div>
      )}
    </>
  );
}
