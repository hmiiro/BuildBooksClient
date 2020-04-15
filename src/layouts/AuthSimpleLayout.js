import React, { useState, useContext } from 'react';
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';

const AuthSimpleLayout = (props) => {
    const [isOpen, setIsOpen] = useState(false);

    const toggle = () => setIsOpen(!isOpen);

    return (
        <div>
            <Navbar color="light" light expand="md">
                <NavbarBrand href="/">BuildBooks</NavbarBrand>
                <NavbarToggler onClick={toggle} />
                <Collapse isOpen={isOpen} navbar>
                    <Nav className="mr-auto" navbar>
                        {/* <NavItem>
                            <NavLink href="/account/login">Login</NavLink>
                        </NavItem>
                        <NavItem>
                            <NavLink href="/account/register">Register</NavLink>
                        </NavItem> */}
                    </Nav>
                </Collapse>
            </Navbar>
        </div>
    );
};

export default AuthSimpleLayout;
