"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, ChangeEvent } from "react";
import { useRouter } from "next/navigation";

interface EditProfileModalProps {
  currentUsername: string;
  currentProfileImage: string;
  onClose: () => void;
  onSave: (newUsername: string, newProfileImage: File | null) => Promise<boolean>;
}

function EditProfileModal({
  currentUsername,
  currentProfileImage,
  onClose,
  onSave,
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
    reader.onloadend = () => setPreviewImage(reader.result as string);
    reader.readAsDataURL(profileImageFile);
  }, [profileImageFile, currentProfileImage]);

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (!username.trim()) {
      setErrorMessage("Username cannot be empty.");
      return;
    }
    setErrorMessage(null);
    setIsSaving(true);
    const success = await onSave(username.trim(), profileImageFile);
    setIsSaving(false);
    if (success) setShowSuccessPopup(true);
    else setErrorMessage("Failed to update profile. Please try again.");
  };

  return (
    <>
      <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={onClose} />
      <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
        <div
          className="bg-gray-900 text-white rounded-lg shadow-xl max-w-md w-full p-6 relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-3 right-3 text-gray-400 hover:text-white text-2xl"
          >
            &times;
          </button>
          <h2 className="text-2xl font-bold mb-4">Edit Profile</h2>

          <div className="mb-4 flex flex-col items-center">
            <div className="w-24 h-24 rounded-full overflow-hidden mb-2 border-2 border-gray-700">
              <img
                src={previewImage}
                alt="Profile Preview"
                className="object-cover w-full h-full"
              />
            </div>
            <label
              htmlFor="profileImageInput"
              className="cursor-pointer text-orange-400 hover:text-orange-500"
            >
              Change Profile Image
            </label>
            <input
              type="file"
              id="profileImageInput"
              accept="image/*"
              className="hidden"
              onChange={handleImageChange}
              disabled={isSaving}
            />
          </div>

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

          {errorMessage && (
            <p className="text-red-500 mb-4 text-center">{errorMessage}</p>
          )}

          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              disabled={isSaving}
              className="bg-gray-700 hover:bg-gray-600 px-4 py-2 rounded-md"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              disabled={isSaving}
              className="bg-orange-400 hover:bg-orange-500 px-4 py-2 rounded-md font-semibold"
            >
              {isSaving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>
      </div>

      {showSuccessPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-900 text-white rounded-lg shadow-xl max-w-sm w-full p-6 text-center">
            <h3 className="text-xl font-bold mb-4">Profile updated successfully!</h3>
            <button
              onClick={() => {
                setShowSuccessPopup(false);
                onClose();
              }}
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

export default function Navbar() {
  const [searchTerm, setSearchTerm] = useState("");
  const [username, setUsername] = useState<string | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [editProfileOpen, setEditProfileOpen] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState("/assets/profile.jpg");
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedProfileImage = localStorage.getItem("profileImage");
    if (storedUsername) setUsername(storedUsername);
    if (storedProfileImage) setProfileImageUrl(storedProfileImage);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.push(`/?q=${encodeURIComponent(searchTerm.trim())}`);
      setSearchTerm("");
      setMobileMenuOpen(false);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    setUsername(null);
    setDropdownOpen(false);
    setMobileMenuOpen(false);
    router.push("/login");
  };

  const handleSaveProfile = async (
    newUsername: string,
    newProfileImage: File | null
  ): Promise<boolean> => {
    const email = localStorage.getItem("email");
    if (!email) {
      console.error("Email not found in localStorage");
      return false;
    }
    try {
      let base64Image = null;
      if (newProfileImage) {
        base64Image = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(reader.result as string);
          reader.onerror = reject;
          reader.readAsDataURL(newProfileImage);
        });
      }
      const res = await fetch("/api/user/update", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, newUsername, newImage: base64Image }),
      });
      const data = await res.json();
      if (!res.ok) {
        console.error("Update failed:", data.message);
        return false;
      }
      localStorage.setItem("username", data.user.username);
      setUsername(data.user.username);
      if (data.user.profileImage) {
        localStorage.setItem("profileImage", data.user.profileImage);
        setProfileImageUrl(data.user.profileImage);
      }
      return true;
    } catch (error) {
      console.error("Error updating profile:", error);
      return false;
    }
  };

  return (
    <>
      <nav className="bg-black text-white px-4 py-3 shadow-lg fixed w-full z-50">
        <div className="container mx-auto flex justify-between items-center relative">
          <Link href="/">
            <div
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center cursor-pointer hover:scale-105 transition-transform duration-200"
            >
              <Image
                src="/assets/logo.png"
                alt="Logo"
                width={80}
                height={80}
                className="rounded-md"
              />
            </div>
          </Link>

          {/* Desktop menu */}
          <div className="hidden md:flex items-center space-x-6">
            <Link href="/">
              <span className="flex items-center space-x-2 text-white font-medium text-lg py-2 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-700 cursor-pointer">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M2.25 12l8.954-8.955a1.125 1.125 0 011.59 0L21.75 12M4.5 20.25V12h15v8.25"
                  />
                </svg>
                <span>Home</span>
              </span>
            </Link>

            {username && (
              <Link href="/reviews">
                <span className="flex items-center space-x-2 text-white font-medium text-lg py-2 px-4 rounded-md transition-all duration-200 ease-in-out hover:bg-gray-700 cursor-pointer">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"
                    />
                  </svg>
                  <span>Reviews</span>
                </span>
              </Link>
            )}

            <form onSubmit={handleSearch} className="relative flex items-center">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-4 pr-10 py-2 rounded-full bg-gray-800 text-white w-40 hover:w-60 focus:w-60 transition-all duration-300"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-5 h-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1016.65 16.65z"
                  />
                </svg>
              </button>
            </form>

            {!username ? (
              <Link href="/login">
                <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-md">
                  Login
                </button>
              </Link>
            ) : (
              <div className="relative">
                <button
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                  className="w-10 h-10 rounded-full overflow-hidden bg-gray-700"
                >
                  <Image src={profileImageUrl} alt="Profile" width={40} height={40} />
                </button>
                {dropdownOpen && (
                  <div className="absolute right-0 mt-2 w-44 bg-gray-800 text-white rounded shadow-lg z-50">
                    <p className="px-4 py-2 font-semibold border-b">Hello, {username}</p>
                    <button
                      onClick={() => {
                        setEditProfileOpen(true);
                        setDropdownOpen(false);
                      }}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      Edit Profile
                    </button>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 hover:bg-gray-600"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Hamburger Button for Mobile */}
          <button
            className="md:hidden text-gray-300 hover:text-white focus:outline-none"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? (
              // X icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            ) : (
              // Hamburger icon
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-8 w-8"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {mobileMenuOpen && (
          <div className="md:hidden fixed inset-0 bg-black bg-opacity-90 z-40 flex flex-col items-center pt-20 space-y-8 text-white text-xl">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className="flex items-center space-x-2 hover:text-orange-400 text-2xl font-semibold"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-7 h-7"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12l8.954-8.955a1.125 1.125 0 011.59 0L21.75 12M4.5 20.25V12h15v8.25"
                />
              </svg>
              <span>Home</span>
            </Link>

            {username && (
              <Link
                href="/reviews"
                onClick={() => setMobileMenuOpen(false)}
                className="flex items-center space-x-2 hover:text-orange-400 text-2xl font-semibold"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-7 h-7"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.683-1.539 1.118l-2.8-2.034a1 1 0 00-1.176 0l-2.8 2.034c-.784.565-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.381-1.81.588-1.81h3.462a1 1 0 00.95-.69l1.07-3.292z"
                  />
                </svg>
                <span>Reviews</span>
              </Link>
            )}

            <form onSubmit={handleSearch} className="w-4/5">
              <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-3 py-2 rounded-full bg-gray-800 text-white"
              />
            </form>

            {!username ? (
              <Link href="/login">
                <button className="bg-orange-400 hover:bg-orange-500 text-white font-semibold py-2 px-6 rounded-md">
                  Login
                </button>
              </Link>
            ) : (
              <div className="flex flex-col items-center space-y-4">
                <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-gray-700">
                  <Image src={profileImageUrl} alt="Profile" width={96} height={96} />
                </div>
                <p className="font-semibold">Hello, {username}</p>
                <button
                  onClick={() => {
                    setEditProfileOpen(true);
                    setMobileMenuOpen(false);
                  }}
                  className="bg-gray-700 hover:bg-gray-600 w-40 py-2 rounded-md"
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-600 hover:bg-red-700 w-40 py-2 rounded-md"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        )}
      </nav>

      {editProfileOpen && (
        <EditProfileModal
          currentUsername={username || ""}
          currentProfileImage={profileImageUrl}
          onClose={() => setEditProfileOpen(false)}
          onSave={handleSaveProfile}
        />
      )}
    </>
  );
}
