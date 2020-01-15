import React, { useState } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const MenuButton = ({ user }) => {
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const toggle = () => setDropdownOpen(prevState => !prevState);

    const { id, username, discriminator, avatar } = user;
    return (
        <Dropdown color="dark" isOpen={dropdownOpen} toggle={toggle}>
            <DropdownToggle caret>
                Dropdown
            </DropdownToggle>
            <DropdownMenu>
                <DropdownItem disabled>
                    <div>Logged in as <img alt="" style={{width: 30 + 'px'}} className="rounded-circle" src={`https://cdn.discordapp.com/avatars/${id}/a_${avatar}.png?size=128`}/> {username}#{discriminator}</div>
                </DropdownItem>
                <DropdownItem>Logout</DropdownItem>
            </DropdownMenu>
        </Dropdown>
    );
}
export default MenuButton;