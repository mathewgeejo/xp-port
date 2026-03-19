import React from 'react';

export default function MenuBar() {
    return (
        <div className="w-full h-6 bg-white border-b border-black flex items-center justify-between px-2 text-xs font-sans absolute top-0 left-0 z-50">
            <div className="flex items-center space-x-4">
                <span className="font-bold flex items-center">
                    <span className="mr-1 w-3 h-3 bg-black rounded-full inline-block" />
                    Resume
                </span>
                <span className="hover:bg-black hover:text-white px-1 cursor-pointer">File</span>
                <span className="hover:bg-black hover:text-white px-1 cursor-pointer">Image</span>
                <span className="hover:bg-black hover:text-white px-1 cursor-pointer">Layer</span>
                <span className="hover:bg-black hover:text-white px-1 cursor-pointer">Type</span>
                <span className="hover:bg-black hover:text-white px-1 cursor-pointer">Select</span>
                <span className="hover:bg-black hover:text-white px-1 cursor-pointer">Window</span>
            </div>
            <div className="flex items-center space-x-3">
                {/* Connection Icon */}
                <div className="flex space-x-[2px] items-end pb-[2px]">
                    <div className="w-1 h-1 bg-black"></div>
                    <div className="w-1 h-2 bg-black"></div>
                    <div className="w-1 h-3 bg-black"></div>
                    <div className="w-1 h-4 bg-gray-400"></div>
                </div>
                {/* Battery Icon */}
                <div className="flex items-center">
                    <div className="w-4 h-2 border border-black rounded-sm overflow-hidden">
                        <div className="w-3/4 h-full bg-black"></div>
                    </div>
                    <div className="w-[1px] h-1 bg-black ml-[1px]"></div>
                </div>
                <span>Wed 12:57PM</span>
            </div>
        </div>
    );
}
