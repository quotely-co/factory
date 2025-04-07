import React from 'react'

const InvalidSubdomainError = () => {
    const handleRedirect = () => {
        window.location.href = "https://quotely.shop";
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white">
            <div className="p-8 bg-white rounded-lg  max-w-md w-full text-center">
                <svg
                    className="w-16 h-16 text-red-500 mx-auto mb-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
                <h1 className="text-xl font-bold text-gray-800 mb-2">Invalid Subdomain</h1>
                <p className="text-gray-600 mb-6">
                    The subdomain you're trying to access doesn't exist or isn't authorized.
                </p>
                <button
                    onClick={handleRedirect}
                    className="px-4 py-2 bg-black text-white rounded hover:bg-gray-800 transition-colors hover:cursor-pointer"
                >
                    Go to Home
                </button>
            </div>
        </div>
    );
};

export default InvalidSubdomainError
