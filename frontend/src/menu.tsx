import React from 'react'
import { Collapse, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap'
import { Link } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'

import { useAuthContext } from './auth-provider'
import EditUserButton from './edit-user-button'

const Header: React.FC = () => {
  const { userId, setToken } = useAuthContext()

  const [isOpen, setIsOpen] = React.useState<boolean>(false)

  return (
    <Navbar color="light" light expand="md">
      <NavbarBrand tag={Link} to="/">
        go-stack
      </NavbarBrand>
      <NavbarToggler onClick={() => setIsOpen(!isOpen)} />
      <Collapse isOpen={isOpen} navbar>
        <Nav className="container-fluid" navbar>
          {userId ? (
            <>
              <NavItem>
                <NavLink tag={Link} to="/">
                  <FormattedMessage id="menu.list-todo" defaultMessage="List TODO" />
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink tag={Link} to="/create-todo">
                  <FormattedMessage id="menu.create-todo" defaultMessage="Create TODO" />
                </NavLink>
              </NavItem>
              <Nav className="ms-auto">
                <EditUserButton />
                <NavItem className="ms-auto">
                  <NavLink tag={Link} to="/login" onClick={() => setToken(null)}>
                    <FormattedMessage id="menu.log-out" defaultMessage="Log out" />
                  </NavLink>
                </NavItem>
              </Nav>
            </>
          ) : (
            <>
              <NavItem>
                <NavLink tag={Link} to="/">
                  <FormattedMessage id="menu.sign-up" defaultMessage="Sign up" />
                </NavLink>
              </NavItem>
              <NavItem className="ms-auto">
                <NavLink tag={Link} to="/login">
                  <FormattedMessage id="menu.log-in" defaultMessage="Log in" />
                </NavLink>
              </NavItem>
            </>
          )}
        </Nav>
      </Collapse>
    </Navbar>
  )
}

export default Header
