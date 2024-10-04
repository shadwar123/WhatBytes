
import { Link, useLocation, useNavigate } from 'react-router-dom';

const Nav = ({ loggedIn, onLogout }) => {
    const location = useLocation();
    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.removeItem('email');
        navigate('/login');
        onLogout(); // Ensure the parent component is aware of the logout
    };

    return (
        <div className="flex items-center justify-between bg-gray-800 shadow-md p-4">
            <Link to="/" className='px-4 font-bold text-3xl text-white'>Dashboard</Link>

            <ul className='flex space-x-6'>
                {/* Conditionally render links based on the loggedIn state */}
                {loggedIn && (
                    <>
                        <Link to='/change_password' className={`flex items-center text-white ${location.pathname === '/change_password' ? 'font-bold' : 'hover:text-gray-300'}`}>
                            Change Password
                        </Link>
                        <Link to='/profile' className={`flex items-center text-white ${location.pathname === '/profile' ? 'font-bold' : 'hover:text-gray-300'}`}>
                            Profile
                        </Link>
                    </>
                )}
            </ul>

            <div className="flex items-center space-x-6">
                {!localStorage.getItem('email') ? (
                    <>
                        <Link className={`link text-white ${location.pathname === '/login' ? "font-bold" : "hover:text-gray-300"}`} to='/login'>Login</Link>
                        <Link className={`link text-white ${location.pathname === '/signup' ? "font-bold" : "hover:text-gray-300"}`} to='/signup'>Signup</Link>
                    </>
                ) : (
                    <h5 className="nav_logout text-white cursor-pointer hover:text-gray-300" onClick={handleLogout}>Logout</h5>
                )}
            </div>
        </div>
    );
};

export default Nav;
