"use client";

import { useEffect, useState } from "react";
import Select from "react-select";

export default function SendKudos({
  orgId,
  senderName,
  myDeptName = "No Department",
}: {
  orgId: string;
  senderName: string;
  myDeptName?: string;
}) {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [recipients, setRecipients] = useState<
    { label: string; value: string }[]
  >([]);
  const [users, setUsers] = useState<{ id: string; name: string }[]>([]);
  const [usersLoaded, setUsersLoaded] = useState(false);
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || usersLoaded) return;

    const loadUsers = async () => {
      try {
        const res = await fetch(`/api/org/${orgId}/users`);
        const data = await res.json();
        setUsers(data);
        setUsersLoaded(true);
      } catch (err) {
        console.error("Failed to load users", err);
      }
    };

    loadUsers();
  }, [open, usersLoaded, orgId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    setStatus(null);

    const res = await fetch(`/api/org/${orgId}/kudos`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        message,
        recipients: recipients.map((r) => r.value),
      }),
    });

    if (res.ok) {
      setMessage("");
      setRecipients([]);
      setStatus("Kudos sent!");
      setTimeout(() => {
        setOpen(false);
        setLoading(false);
      }, 1500);
    } else {
      setStatus("Failed to send kudos");
      setLoading(false);
    }
  };

  const options = users.map((user) => ({ label: user.name, value: user.id }));

  return (
    <div className="mb-6">
      <button
        onClick={() => setOpen((prev) => !prev)}
        className="bg-blue-500 cursor-pointer text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        {open ? "Cancel" : "+ Send Kudos"}
      </button>

      {open && (
        <div className="mt-4 p-4 border border-black rounded-lg bg-white shadow">
          <div className="flex justify-between items-start mb-3">
            <h2 className="text-lg font-semibold">Send Kudos</h2>
            <button
              onClick={() => setOpen(false)}
              className="text-xl cursor-pointer font-bold text-black hover:opacity-80"
              aria-label="Close"
            >
              &times;
            </button>
          </div>

          {status && (
            <p className="mb-2 text-sm text-blue-600 font-medium">{status}</p>
          )}

          <p className="mb-2 text-sm text-gray-700">
            From: {senderName} <span className="italic">({myDeptName})</span>
          </p>

          <form onSubmit={handleSubmit}>
            <fieldset disabled={loading}>
              <label className="block mb-1 font-medium">To:</label>
              <Select
                isMulti
                options={options}
                value={recipients}
                onChange={(selected) =>
                  setRecipients(selected as { label: string; value: string }[])
                }
                className="mb-3"
                styles={{
                  control: (base, state) => ({
                    ...base,
                    borderColor: "black",
                    boxShadow: state.isFocused ? "0 0 0 1px black" : "none",
                    "&:hover": {
                      borderColor: "black",
                    },
                  }),
                }}
              />

              <label className="block mb-1 font-medium">Message:</label>
              <textarea
                className="w-full border rounded border-black p-2 h-38 focus:outline-none  focus:ring-1 resize-y"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                required
                maxLength={800}
                placeholder="Write your message here..."
                rows={6}
                aria-label="Kudos message"
              />
              <p
                className={`text-sm text-right ${
                  message.length === 800
                    ? "text-red-600 font-semibold"
                    : message.length >= 700
                    ? "text-orange-500"
                    : "text-gray-500"
                } ${message.length > 500 ? "block" : "hidden"}`}
              >
                {message.length}/800 characters
              </p>

              <button
                type="submit"
                disabled={loading}
                className={`bg-blue-500 mt-3 text-white px-4 py-2 rounded hover:bg-blue-600 ${
                  loading ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
                }`}
              >
                {loading ? "Sending..." : "Send"}
              </button>
            </fieldset>
          </form>
        </div>
      )}
    </div>
  );
}
