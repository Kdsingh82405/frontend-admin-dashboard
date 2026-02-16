import { useEffect, useState } from "react";
import { getUsers } from "../../api/users";

export default function Dashboard() {
    const [users, setUsers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const data = await getUsers();
                setUsers(data);
            } catch {
                setError("Failed to load users");
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    if (loading) return <div className="p-10">Loading...</div>;
    if (error) return <div className="p-10 text-red-500">{error}</div>;

    return (
        <div className="p-10 bg-gray-100 min-h-screen">
            <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-gray-500">Total Users</h2>
                    <p className="text-3xl font-bold">{users.length}</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-gray-500">Active Users</h2>
                    <p className="text-3xl font-bold">{Math.floor(users.length * 0.7)}</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-gray-500">New Registrations</h2>
                    <p className="text-3xl font-bold">{Math.floor(users.length * 0.3)}</p>
                </div>

                <div className="bg-white p-6 rounded shadow">
                    <h2 className="text-gray-500">Revenue</h2>
                    <p className="text-3xl font-bold">₹{users.length * 500}</p>
                </div>

            </div>
        </div>
    );
}
