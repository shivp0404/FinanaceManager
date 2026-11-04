
"use client";

import { useState } from "react";
import updateProfileAction from "@/actions/profile.action";

type ProfileDetailsProps = {
  user: {
    id: number;
    name: string;
    email: string;
    createdAt: Date;
  };
};

export default function ProfileDetails({
  user,
}: ProfileDetailsProps) {
  const [isEditing, setIsEditing] = useState(false);

  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);

  const createdDate = new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  }).format(user.createdAt);

  function handleCancel() {
    setName(user.name);
    setEmail(user.email);
    setIsEditing(false);
  }

  return (
    <div className="max-w-3xl space-y-6">

      <div>
        <h1 className="text-2xl font-bold">My Profile</h1>
        <p className="text-sm text-slate-500">
          Manage your personal information.
        </p>
      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">

        <div className="flex justify-between items-center">
          <h2 className="text-lg font-semibold">
            Personal Information
          </h2>

          {!isEditing && (
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className="rounded-lg bg-slate-900 px-4 py-2 text-sm text-white"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form
            className="mt-6 space-y-5"
            action={async (formData) => {
              const result = await updateProfileAction(formData);

              if (result.success) {
                setIsEditing(false);
                window.location.reload();
              } else {
                alert(result.message);
              }
            }}
          >

            <div>
              <label className="block text-sm mb-2">
                Full Name
              </label>

              <input
                type="text"
                name="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div>
              <label className="block text-sm mb-2">
                Email Address
              </label>

              <input
                type="email"
                name="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-lg border p-3"
                required
              />
            </div>

            <div className="flex justify-end gap-3">
              <button
                type="button"
                onClick={handleCancel}
                className="rounded-lg border px-4 py-2"
              >
                Cancel
              </button>

              <button
                type="submit"
                className="rounded-lg bg-slate-900 px-4 py-2 text-white"
              >
                Save Changes
              </button>
            </div>

          </form>
        ) : (
          <div className="mt-6 grid gap-5 sm:grid-cols-2">

            <div>
              <p className="text-sm text-slate-500">Full Name</p>
              <p className="mt-1 font-medium">{user.name}</p>
            </div>

            <div>
              <p className="text-sm text-slate-500">Email Address</p>
              <p className="mt-1 font-medium">{user.email}</p>
            </div>

          </div>
        )}

      </div>

      <div className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold">
          Account Information
        </h2>

        <div className="mt-5">
          <p className="text-sm text-slate-500">
            Account Created
          </p>
          <p className="mt-1 font-medium">{createdDate}</p>
        </div>
      </div>

    </div>
  );
}
