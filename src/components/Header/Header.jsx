import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from '../../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import LoginModal from '../modals/LoginModal';
import SignupModal from '../modals/SignupModal';
import './Header.css';
import { MdMenu, FaTasks, FaShoppingCart, FaBookmark, FaUtensils } from '../../utils/Icons';

const Header = ({ onHamburgerClick }) => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showLogin, setShowLogin] = useState(false);
  const [showSignup, setShowSignup] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const dropdownRef = React.useRef(null);
  const [userProfile, setUserProfile] = useState(null);

  const handleLogoClick = () => {
    navigate(isAuthenticated ? '/' : '/login');
  };

  const handleGetStartedClick = () => {
    setShowSignup(true);
  };

  const handleAvatarClick = () => {
    if (isAuthenticated) {
      dispatch(logout());
      navigate('/login');
    } else {
      setShowLogin(true);
    }
  };

  const handleSwitchToLogin = () => {
    setShowSignup(false);
    setShowLogin(true);
  };

  const handleSwitchToSignup = () => {
    setShowLogin(false);
    setShowSignup(true);
  };

  const handleDropdownToggle = () => {
    setDropdownOpen((prev) => !prev);
  };

  const handleHamburgerClick = () => {
    onHamburgerClick();
  };

  React.useEffect(() => {
    if (!dropdownOpen) return;
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    const handleScroll = () => {
      setDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    window.addEventListener('scroll', handleScroll, true);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      window.removeEventListener('scroll', handleScroll, true);
    };
  }, [dropdownOpen]);

  React.useEffect(() => {
    if (isAuthenticated && !userProfile) {
      import('../../services/auth').then(({ getUserProfile }) => {
        getUserProfile().then((profile) => {
          setUserProfile(profile);
        }).catch(() => {
          setUserProfile(null);
        });
      });
    }
  }, [isAuthenticated, userProfile]);

  return (
    <header className="header z-0">
      <div className="header-container flex items-center justify-between">
        <div className="flex-row items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>

          <span className="text-3xl font-bold text-blue-300 tracking-tight">Tasket-Links</span>
        </div>

        <nav className="nav hidden md:block">
          <ul className="flex gap-4 items-center">
            <li className="relative" ref={dropdownRef}>
              <button className="flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 focus:outline-none" type="button" onClick={handleDropdownToggle} aria-expanded={dropdownOpen} aria-haspopup="true">
                <span className="font-semibold">Create</span>
                <svg className="w-4 h-4 ml-1" as={FaTasks} />
              </button>
              {dropdownOpen && (
                <div className="absolute top-8 left-0 mt-2 w-64 bg-white text-gray-900 rounded shadow-lg z-50 transition-opacity duration-200">
                  <ul className='flex-col'>
                    <li className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/dashboard?type=task'); setDropdownOpen(false); }}>
                      <span className="mt-1"><FaTasks size={24} /></span>
                      <div>
                        <div className="font-medium">Task</div>
                        <div className="text-xs text-gray-500">Create and manage your tasks efficiently.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/dashboard?type=shopping'); setDropdownOpen(false); }}>
                      <span className="mt-1"><FaShoppingCart size={24} /></span>
                      <div>
                        <div className="font-medium">Shopping</div>
                        <div className="text-xs text-gray-500">Create and organize shopping lists.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/dashboard?type=bookmark'); setDropdownOpen(false); }}>
                      <span className="mt-1"><FaBookmark size={24} /></span>
                      <div>
                        <div className="font-medium">Bookmark</div>
                        <div className="text-xs text-gray-500">Save and organize your favorite links.</div>
                      </div>
                    </li>
                    <li className="flex items-start gap-3 p-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/dashboard?type=recipe'); setDropdownOpen(false); }}>
                      <span className="mt-1"><FaUtensils size={24} /></span>
                      <div>
                        <div className="font-medium">Recipe</div>
                        <div className="text-xs text-gray-500">Collect and manage your recipes.</div>
                      </div>
                    </li>
                  </ul>
                </div>
              )}
            </li>
            <li>
              <a href="/about">About</a>
            </li>
            <li>
              <a href="/contact">Contact</a>
            </li>
            {!isAuthenticated && (
              <li>
                <button
                  className="bg-pink-600 hover:bg-pink-700 text-white font-semibold px-6 py-2 rounded-lg shadow transition"
                  onClick={handleGetStartedClick}
                >
                  Get Started
                </button>
              </li>
            )}
            <li>
              <span className="flex items-center">
                <span
                  className="avatar border-2 border-gray-300 rounded-full overflow-hidden cursor-pointer"
                  style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 40, height: 40, background: '#f3f4f6', color: '#374151', fontWeight: 'bold', fontSize: 20 }}
                  onClick={() => setProfileDropdownOpen((prev) => !prev)}
                >
                  {isAuthenticated && userProfile && userProfile.email ? (
                    userProfile.email.charAt(0).toUpperCase()
                  ) : (
                    <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
                      <svg width="24" height="24" fill="currentColor" viewBox="0 0 24 24"><path d="M12 12c2.7 0 5-2.3 5-5s-2.3-5-5-5-5 2.3-5 5 2.3 5 5 5zm0 2c-3.3 0-10 1.7-10 5v3h20v-3c0-3.3-6.7-5-10-5z" /></svg>
                    </span>
                  )}
                </span>
              </span>
              {profileDropdownOpen && (
                <div className="absolute top-16 right-4 mt-2 w-64 bg-white text-gray-900 rounded shadow-lg z-50 transition-opacity duration-200 border border-gray-200">
                  <ul className="flex flex-col">
                    <li className="h-14 gap-2 flex flex-col justify-center px-4 py-2 border-b border-gray-100">
                      <p className="font-semibold">Signed in as</p>
                      <p className="font-semibold">{userProfile ? userProfile.email : 'Guest'}</p>
                    </li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/dashboard'); setProfileDropdownOpen(false); }}>Dashboard</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/settings'); setProfileDropdownOpen(false); }}>My Settings</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/analytics'); setProfileDropdownOpen(false); }}>Analytics</li>
                    <li className="px-4 py-2 hover:bg-gray-100 cursor-pointer" onClick={() => { navigate('/help'); setProfileDropdownOpen(false); }}>Help & Feedback</li>
                    {isAuthenticated && userProfile && userProfile.isAdmin &&
                      <li className="px-4 py-2 hover:bg-red-100 text-red-600 font-semibold cursor-pointer"
                        onClick={() => {
                          dispatch(logout());
                          navigate('/');
                          setProfileDropdownOpen(false);
                          window.location.reload();
                        }}
                      >
                        Log Out
                      </li>
                    }
                  </ul>
                </div>
              )}
            </li>
            {/* Show login button only if not authenticated */}
            {!isAuthenticated && (
              <li>
                <button
                  className="avatar-btn flex items-center gap-2 px-4 py-2 rounded hover:bg-gray-700 focus:outline-none"
                  onClick={handleAvatarClick}
                >
                  <span className="font-semibold">Login</span>
                </button>
              </li>
            )}
          </ul>
        </nav>
      </div>
      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} onSwitchToSignup={handleSwitchToSignup} />
      <SignupModal isOpen={showSignup} onClose={() => setShowSignup(false)} onSwitchToLogin={handleSwitchToLogin} />

      {/* Hamburger button for mobile */}
      <div className="hamburger-menu" onClick={handleHamburgerClick}>
        <MdMenu size={28} />
      </div>
    </header>
  );
};

export default Header;
