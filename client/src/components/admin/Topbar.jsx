import React, { useState, useRef, useEffect } from "react";
import {
	FaUserCircle,
	FaSignOutAlt,
	FaCog,
	FaUser,
	FaLifeRing,
} from "react-icons/fa";
import { RiMenuFoldLine } from "react-icons/ri";
import { PiBellRingingFill } from "react-icons/pi";
const AdminTopbar = ({ toggleSidebar }) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false);
	const dropdownRef = useRef();

	useEffect(() => {
		const handleClickOutside = (event) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target)
			) {
				setIsDropdownOpen(false);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const dropdownItems = [
		{
			label: "Profile",
			icon: FaUser,
			url: "/admin/profile",
		},
		{
			label: "Settings",
			icon: FaCog,
			url: "/admin/settings",
		},
		{
			label: "Support",
			icon: FaLifeRing,
			url: "/admin/support",
		},
	];
	return (
		<header className="w-full sticky top-0 z-40 bg-gray-800 shadow-md px-4 py-3 flex items-center justify-between rounded-md">
			<div className="flex items-center space-x-3">
				<div className="md:hidden">
					<button
						onClick={toggleSidebar}
						className="text-white bg-gray-700 p-2 rounded-md"
					>
						<RiMenuFoldLine />
					</button>
				</div>

				<input
					type="text"
					placeholder="Search..."
					className="bg-gray-700 text-white px-3 py-1 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 sm:w-36 w-48 md:w-64"
				/>
			</div>

			<div
				className={`flex items-center space-x-4 relative  ${
					isDropdownOpen ? "translate-x-4" : ""
				}`}
				ref={dropdownRef}
			>
				<button className="relative group text-white">
					<PiBellRingingFill className="text-xl transition-colors duration-300 animate-swing" />

					<span className="absolute top-[-4px] right-1 block w-2 h-2 rounded-full bg-red-500 animate-ping"></span>
				</button>

				<div
					className={`flex items-center space-x-2 cursor-pointer  text-white`}
					onClick={() => setIsDropdownOpen(!isDropdownOpen)}
				>
					<img
						src="https://i.pravatar.cc/40"
						alt="User Avatar"
						className="w-8 h-8 rounded-full object-cover"
					/>
					<span className="hidden md:inline text-sm font-medium bg-testBlue">
						Admin
					</span>
				</div>

				{isDropdownOpen && (
					<div className="absolute top-12 right-0 bg-white shadow-lg rounded-md py-2 w-52 z-50">
						{/* User Info */}
						<div className="flex items-center px-4 py-3  border-b border-gray-200 flex-col justify-center">
							<img
								src="https://i.pravatar.cc/40"
								alt="User Avatar"
								className="w-10 h-10 rounded-full object-cover"
							/>
							<div className="flex flex-col items-center">
								<p className="text-sm font-semibold text-gray-800">
									Admin
								</p>
								<p className="text-xs text-gray-500">
									admin@example.com
								</p>
							</div>
						</div>

						{dropdownItems.map((item, index) => (
							<a
								href={item.url}
								key={index}
								className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-gray-800"
							>
								<item.icon className="mr-2" />
								{item.label}
							</a>
						))}
						<hr className="my-1" />
						<button className="w-full flex items-center px-4 py-2 text-sm hover:bg-gray-100 text-red-600">
							<FaSignOutAlt className="mr-2" /> Logout
						</button>
					</div>
				)}
			</div>
		</header>
	);
};

export default AdminTopbar;
