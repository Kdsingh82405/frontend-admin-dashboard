import { useEffect, useState, useMemo } from "react";
import { getUsers } from "../../api/users";
import { indianUsers } from "../../utils/indianUsers";
import UserRow from "../../components/UserRow.tsx";

export default function Users() {
  const [users, setUsers] = useState<any[]>([]);
  const [search, setSearch] = useState("");

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5;

  // Filter & Sort
  const [statusFilter, setStatusFilter] = useState("all");
  const [sortOrder, setSortOrder] = useState("asc");

  // Modal states
  const [showModal, setShowModal] = useState(false);
  const [editingUser, setEditingUser] = useState<any>(null);

  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newCity, setNewCity] = useState("");

  // Fetch users
  useEffect(() => {
    const fetchUsers = async () => {
      const data = await getUsers();

      const apiUsers = data.slice(0, 5).map((u: any, i: number) => ({
        ...u,
        status: i % 2 === 0 ? "active" : "inactive",
      }));

      setUsers([...indianUsers, ...apiUsers]);
    };
    fetchUsers();
  }, []);

  // 🔥 Optimized Search + Filter + Sort
  const filteredUsers = useMemo(() => {
    return users
      .filter((user) =>
        user.name.toLowerCase().includes(search.toLowerCase())
      )
      .filter((user) =>
        statusFilter === "all" ? true : user.status === statusFilter
      )
      .slice() // prevent mutation bug
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.name.localeCompare(b.name)
          : b.name.localeCompare(a.name)
      );
  }, [users, search, statusFilter, sortOrder]);

  // Pagination logic
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstUser, indexOfLastUser);

  // Delete user
  const deleteUser = (id: number) => {
    if (confirm("Are you sure you want to delete this user?")) {
      setUsers((prev) => prev.filter((user) => user.id !== id));
    }
  };

  // Open edit modal
  const editUser = (user: any) => {
    setEditingUser(user);
    setNewName(user.name);
    setNewEmail(user.email);
    setNewCity(user.address.city);
    setShowModal(true);
  };

  // Add or Update user
  const saveUser = () => {
    if (!newName || !newEmail || !newCity) return;

    if (editingUser) {
      setUsers((prev) =>
        prev.map((u) =>
          u.id === editingUser.id
            ? { ...u, name: newName, email: newEmail, address: { city: newCity } }
            : u
        )
      );
      setEditingUser(null);
    } else {
      const newUser = {
        id: Date.now(),
        name: newName,
        email: newEmail,
        address: { city: newCity },
        status: "active",
      };
      setUsers((prev) => [newUser, ...prev]);
    }

    setShowModal(false);
    setNewName("");
    setNewEmail("");
    setNewCity("");
  };

  return (
    <div className="p-4 sm:p-6 lg:p-10">
      <h1 className="text-xl sm:text-2xl font-bold mb-4">Users</h1>

      {/* Add Button */}
      <button
        onClick={() => {
          setEditingUser(null);
          setShowModal(true);
        }}
        className="bg-green-600 text-white px-4 py-2 rounded w-full sm:w-auto mb-3 sm:mb-4"
      >
        Add User
      </button>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between mb-4">
        <input
          className="border p-2 w-full sm:w-60"
          placeholder="Search user..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="flex flex-col sm:flex-row gap-3">
          <select
            className="border p-2"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>

          <select
            className="border p-2"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="asc">Name A-Z</option>
            <option value="desc">Name Z-A</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-[600px] w-full border">
          <thead className="bg-gray-200">
            <tr>
              <th className="p-2 border">Name</th>
              <th className="p-2 border">Email</th>
              <th className="p-2 border">City</th>
              <th className="p-2 border">Status</th>
              <th className="p-2 border">Action</th>
            </tr>
          </thead>

          <tbody>
            {currentUsers.map((user) => (
              <UserRow
                key={user.id}
                user={user}
                onEdit={editUser}
                onDelete={deleteUser}
              />
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex flex-wrap justify-center mt-4 gap-3">
        <button
          disabled={currentPage === 1}
          onClick={() => setCurrentPage((p) => p - 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Prev
        </button>

        <span className="font-semibold">Page {currentPage}</span>

        <button
          disabled={indexOfLastUser >= filteredUsers.length}
          onClick={() => setCurrentPage((p) => p + 1)}
          className="px-3 py-1 bg-gray-300 rounded disabled:opacity-50"
        >
          Next
        </button>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center px-4">
          <div className="bg-white p-6 rounded w-full max-w-sm">
            <h2 className="text-xl font-bold mb-3">
              {editingUser ? "Edit User" : "Add User"}
            </h2>

            <input
              className="border w-full p-2 mb-2"
              placeholder="Name"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
            />
            <input
              className="border w-full p-2 mb-2"
              placeholder="Email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
            />
            <input
              className="border w-full p-2 mb-4"
              placeholder="City"
              value={newCity}
              onChange={(e) => setNewCity(e.target.value)}
            />

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="px-3 py-1 border rounded"
              >
                Cancel
              </button>
              <button
                onClick={saveUser}
                className="bg-blue-600 text-white px-3 py-1 rounded"
              >
                {editingUser ? "Update" : "Add"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
