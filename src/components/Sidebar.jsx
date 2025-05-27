import React from 'react';
import './Sidebar.css';

const Sidebar = ({ open, setOpen }) => {
  return (
    <>
      <aside className={`sidebar ${open ? 'open' : 'close'} md:hidden`}>
        {/* Sidebar content */}
        <nav className="flex flex-col gap-2 mt-2 md:mt-0">
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-50 font-medium text-gray-200" onClick={() => {setOpen(false);}}>Overview</button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-50 font-medium text-gray-200" onClick={() => {setOpen(false);}}>Tasks</button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-50 font-medium text-gray-200" onClick={() => {setOpen(false);}}>Shopping List</button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-50 font-medium text-gray-200" onClick={() => {setOpen(false);}}>Recipes</button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-50 font-medium text-gray-200" onClick={() => {setOpen(false);}}>About</button>
          <button className="text-left px-4 py-2 rounded hover:bg-indigo-50 font-medium text-gray-200" onClick={() => {setOpen(false);}}>Contact</button>
        </nav>
      </aside>
      {open && <div className="fixed inset-0 bg-black opacity-30 z-10 md:hidden" onClick={() => setOpen(false)}></div>}
    </>
  );
};

export default Sidebar;