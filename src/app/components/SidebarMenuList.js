import * as actions from '../actions';

import { Menu } from 'antd';
import React from 'react';
import { useDispatch } from 'react-redux';

export const SidebarMenuList = (props) => {
    const dispatch = useDispatch()

    const onClick = ({ key }) => {
        dispatch(actions.setCurrMenu(key))
    };

    return (
        <Menu theme="dark" mode="inline" defaultSelectedKeys={['1']} onClick={onClick}>
            {props.items && (props.items.map((entry) => (
                <Menu.Item key={entry.key} icon={entry.icon}>
                    {entry.name}
                </Menu.Item>
            )))}
        </Menu>
    );
}