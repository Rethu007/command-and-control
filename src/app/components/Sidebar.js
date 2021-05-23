import { Layout } from 'antd';
import React from 'react';
import { SidebarMenuList } from './SidebarMenuList';
import { getAppVersion } from '../../utils';
import icon from '../../assets/icon.png';
import styles from './Sidebar.module.css';

export const Sidebar = (props) => {
    const { Sider } = Layout
    const Entries = props.items
    const version = getAppVersion();

    return (
        <Sider width={props.width} className={styles.sider}>
            <div className={styles.header}>
                <img src={icon} alt="" className={styles.logo} />
                Pflegebrille C &amp; C
                <span className={styles.subheader}>Version: {version}</span>
            </div>
            <SidebarMenuList items={Entries} />
        </Sider>
    );
};
