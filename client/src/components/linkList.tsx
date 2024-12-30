import "./linkList.css";
import { Link } from "react-router-dom";
import { FaUser, FaSearch } from "react-icons/fa";

const links = [
    { url: "/profile", name: "Profile", icon: <FaUser /> },
    { url: null, name: "Search", icon: <FaSearch /> }
]



const LinkList = () => {
    return (
        <div className="link-list">
            {links.map((link) => {
                return link.url ?
                    (
                        <Link to={link.url} className="link" key={link.name}>
                            {link.icon ? link.icon : <p>{link.name}</p>}
                        </Link>
                    ) :
                    (
                        <div className="link" key={link.name}>
                            {link.icon ? link.icon : <p>{link.name}</p>}
                        </div>
                    );
            })}
        </div>
    );
};

export default LinkList;