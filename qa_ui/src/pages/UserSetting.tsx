
const Settings = () => {
    return (
        <div className="max-w-xl mx-auto mt-10 p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800">Settings</h2>
            <div className="space-y-4">
                {/* Language Dropdown */}
                <div>
                    <label htmlFor="language" className="block text-gray-700 mb-1">
                        Language
                    </label>
                    <select
                        id="language"
                        className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="en">English</option>
                        <option value="vi">Vietnamese</option>
                    </select>
                </div>
            </div>

            <div className="mt-6">
                <button
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded"
                >
                    Save Settings
                </button>
            </div>
        </div>
    );
};

export default Settings;