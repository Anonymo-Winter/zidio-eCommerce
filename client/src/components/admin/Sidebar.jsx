import React, { useState, useEffect } from "react";
import {
	FaUser,
	FaChartBar,
	FaSignOutAlt,
	FaBoxOpen,
	FaUsersCog,
	FaInstagram,
	FaFacebook,
	FaLinkedin,
	FaTwitter,
} from "react-icons/fa";
import { TbShoppingBag } from "react-icons/tb";
import { AiFillProduct } from "react-icons/ai";
import { RiMenuUnfold2Fill, RiMenuFold2Fill } from "react-icons/ri";
import {
	MdSettings,
	MdHelpOutline,
	MdHeadsetMic,
	MdOutlinePrivacyTip,
} from "react-icons/md";
import { useLocation } from "react-router-dom";

const Sidebar = ({ isOpen, setIsOpen, toggleSidebar }) => {
	const location = useLocation();

	useEffect(() => {
		const handleResize = () => {
			if (window.innerWidth > 768) {
				setIsOpen(true);
			} else {
				setIsOpen(false);
			}
		};

		window.addEventListener("resize", handleResize);
		handleResize();

		return () => window.removeEventListener("resize", handleResize);
	}, []);

	const NavItem = [
		{
			attribute: "Main Home",
			pages: [
				{
					label: "Dashboard",
					icon: AiFillProduct,
					url: "/",
				},
			],
		},
		{
			attribute: "Pages",
			pages: [
				{
					label: "Orders",
					icon: TbShoppingBag,
					url: "/orders",
				},
				{
					label: "Products",
					icon: FaBoxOpen,
					url: "/products",
				},
				{
					label: "Analytics",
					icon: FaChartBar,
					url: "/analytics",
				},
				{
					label: "Customers",
					icon: FaUser,
					url: "/customers",
				},
			],
		},
		{
			attribute: "Setting",
			pages: [
				{
					label: "Settings",
					icon: MdSettings,
					url: "/settings",
				},
				{
					label: "Users",
					icon: FaUsersCog,
					url: "/users",
				},
			],
		},
		{
			attribute: "Support",
			pages: [
				{
					label: "Help Center",
					icon: MdHelpOutline,
					url: "/help",
				},
				{
					label: "FAQs",
					icon: MdHeadsetMic,
					url: "/faqs",
				},
				{
					label: "Privacy Policy",
					icon: MdOutlinePrivacyTip,
					url: "/privacy",
				},
			],
		},
		{
			attribute: "Contact us",
			pages: [
				{
					label: "",
					url: "https://www.facebook.com",
					icon: FaFacebook,
				},
				{
					label: "",
					url: "https://www.instragram.com",
					icon: FaInstagram,
				},
				{
					label: "",
					url: "https://www.linkdin.com",
					icon: FaLinkedin,
				},
				{
					label: "",
					url: "https://www.x.com",
					icon: FaTwitter,
				},
			],
		},
	];

	return (
		<div
			className={`${
				isOpen ? "w-64 p-5" : "w-0 p-0"
			} bg-gray-800 h-screen overflow-y-scroll transition-all duration-300 fixed md:relative z-50`}
		>
			<div className="flex items-center justify-between p-4">
				<h1
					className={`${
						isOpen ? "block" : "hidden"
					} text-xl font-bold`}
				>
					Admin Panel
				</h1>
				<button
					onClick={toggleSidebar}
					className="text-white focus:outline-none md:hidden"
				>
					<RiMenuUnfold2Fill />
				</button>
			</div>

			{NavItem.map((item, index) => (
				<div key={index} className="mt-4">
					<h2 className="text-gray-400 text-sm px-2 uppercase font-bold">
						{item.attribute}
					</h2>
					<ul
						className={`mt-2 ${
							item.pages[0].label ? "block" : "flex"
						}`}
					>
						{item.pages.map((page, index) => {
							const isActive = location.pathname === page.url;
							return (
								<li
									key={index}
									className={`flex items-center p-2 transition font-semibold cursor-pointer hover:text-blue-500 ${
										isActive
											? "text-blue-400"
											: "text-white"
									}`}
								>
									{page.label ? (
										<a
											href={page.url}
											className="flex items-center w-full"
										>
											<page.icon className="text-xl" />
											<span
												className={`${
													isOpen ? "ml-4" : "hidden"
												} md:block`}
											>
												{page.label}
											</span>
										</a>
									) : (
										<a
											href={page.url}
											target="_blank"
											rel="noopener noreferrer"
											className="inline"
										>
											<page.icon className="text-xl" />
										</a>
									)}
								</li>
							);
						})}
					</ul>
				</div>
			))}

			<button className="mt-4 flex items-center p-2 text-red-500 hover:text-red-400 transition font-semibold">
				<FaSignOutAlt className="text-xl" />
				<span className="text-sm px-2 uppercase font-bold">Logout</span>
			</button>
		</div>
	);
};

export default Sidebar;
