import logo from '../assets/images/logo_all.svg';
import logo_plane from '../assets/images/logo_plane.svg';

function Navbar() {

    return (
        <div className="navbar">
            <div className="logo">
                <img src={logo_plane} alt="logo" className="logo-image" />
            </div>
            <nav>
                <ul>
                    {/* <li><h1>Flyaway</h1></li> */}
                    <li><a href="/about">Flights</a></li>
                    <li><a href="/contact">Hotels</a></li>
                    <li><a href="/destination">Destination</a></li>
                    <li><a href="/carhire">Car Hire</a></li>
                </ul>
            </nav>
            <div className="login">
                <li><a href="/about">login</a></li>
                <li><a href="/contact">Hotels</a></li>
            </div>
        </div>
    );
}

export default Navbar;