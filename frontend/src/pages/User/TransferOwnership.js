import { useNavigate } from "react-router-dom";
import { useState } from "react";
import swal from 'sweetalert2';

function TransferOwnership() {
    const navigate = useNavigate();
    const [landId, setLandId] = useState("");
    const [newOwnerHash, setNewOwnerHash] = useState("");
    const [ownerIdentity, setOwnerIdentity] = useState("");
    const [confirmDetails, setConfirmDetails] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!landId || !newOwnerHash || !ownerIdentity) {
            swal.fire({
                title: "Missing Fields",
                text: "Please fill in all fields.",
                icon: "warning",
                confirmButtonColor: '#142854'
            });
            return;
        }
        setLoading(true);
        try {
            const response = await fetch(`/lands/${landId}/transfer`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    newOwner: newOwnerHash
                })
            });
            if (response.ok) {
                swal.fire({
                    title: "Success!",
                    text: "Ownership transfer submitted successfully.",
                    icon: "success",
                    confirmButtonColor: '#142854'
                });
                setLandId("");
                setNewOwnerHash("");
                setOwnerIdentity("");
                setConfirmDetails(false);
            } else {
                const data = await response.json();
                swal.fire({
                    title: "Error",
                    text: data.message || "Failed to transfer ownership.",
                    icon: "error",
                    confirmButtonColor: '#142854'
                });
            }
        } catch (err) {
            swal.fire({
                title: "Error",
                text: err.message || "Failed to transfer ownership.",
                icon: "error",
                confirmButtonColor: '#142854'
            });
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen w-full bg-gray-100 flex flex-row">
            <div className="flex-grow p-4 sm:p-8 pt-16">
                <div className="bg-gray-50 p-6 sm:p-10 max-w-lg mx-auto rounded shadow">
                    <h2 className="text-center text-3xl font-semibold text-gray-900 mb-8">Transfer Land Ownership</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label htmlFor="landId" className="block text-gray-700 text-sm font-medium mb-1">Land ID</label>
                            <input
                                type="text"
                                id="landId"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                value={landId}
                                onChange={e => setLandId(e.target.value)}
                                placeholder="Enter Land ID"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="newOwnerHash" className="block text-gray-700 text-sm font-medium mb-1">New Owner Hash</label>
                            <input
                                type="text"
                                id="newOwnerHash"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                value={newOwnerHash}
                                onChange={e => setNewOwnerHash(e.target.value)}
                                placeholder="Enter new owner's identity hash"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label htmlFor="ownerIdentity" className="block text-gray-700 text-sm font-medium mb-1">Your Identity Hash</label>
                            <input
                                type="text"
                                id="ownerIdentity"
                                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline text-sm"
                                value={ownerIdentity}
                                onChange={e => setOwnerIdentity(e.target.value)}
                                placeholder="Enter your identity hash"
                                required
                            />
                        </div>
                        <div className="mb-6">
                            <label className="inline-flex items-center">
                                <input
                                    type="checkbox"
                                    className="form-checkbox"
                                    checked={confirmDetails}
                                    onChange={e => setConfirmDetails(e.target.checked)}
                                />
                                <span className="ml-2 text-sm">I confirm the details above are correct.</span>
                            </label>
                        </div>
                        <div className="flex justify-between">
                            <button
                                type="button"
                                onClick={() => navigate("/")}
                                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded text-sm"
                                disabled={loading}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={!confirmDetails || loading}
                                className="py-2 px-4 rounded text-sm text-white"
                                style={{
                                    backgroundColor: confirmDetails && !loading ? '#142854' : '#d1d5db',
                                    cursor: confirmDetails && !loading ? 'pointer' : 'not-allowed'
                                }}
                            >
                                {loading ? 'Submitting...' : 'Submit Transfer'}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default TransferOwnership;
