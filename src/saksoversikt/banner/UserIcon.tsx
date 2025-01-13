import React from "react";

const UserIcon: React.FC = () => {
    return (
        <svg
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 32 32"
            className="saksoversikt-userIcon"
            pointerEvents="none"
        >
            <title>person</title>
            <path
                fill="#3E3832"
                fillRule="evenodd"
                stroke="none"
                strokeWidth="1"
                d="M16 0C7.163 0 0 7.163 0 16s7.163 16 16 16 16-7.163 16-16A16 16 0 0016 0zM1.333 16a14.667 14.667 0 1125.427 9.947 31.107 31.107 0 00-5.72-2.44l-1.667-.614V20.4a8.333 8.333 0 003.387-6.933c0-4.414-3.04-8-6.76-8-3.72 0-6.76 3.586-6.76 8a8.307 8.307 0 003.547 7.04v2.386l-1.694.614a31.88 31.88 0 00-5.76 2.48 14.667 14.667 0 01-4-9.987zm9.187-2.533C10.52 9.813 12.973 6.8 16 6.8c3.027 0 5.48 3.067 5.48 6.667 0 3.6-2.453 6.666-5.48 6.666-3.027 0-5.48-3.013-5.48-6.666zM6.24 26.92a31.413 31.413 0 015.333-2.2l2.134-.787a.64.64 0 00.413-.6v-2.186c1.266.46 2.654.46 3.92 0v2.173a.64.64 0 00.413.6l2.094.773a30.667 30.667 0 015.253 2.254 14.667 14.667 0 01-19.56-.027z"
                transform="translate(-276 -203) translate(-1 187) translate(277 16)"
            />
        </svg>
    );
};

export default UserIcon;
