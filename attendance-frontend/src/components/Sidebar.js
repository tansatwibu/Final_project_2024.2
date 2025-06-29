import React from 'react';
import Link from 'next/link';
import styles from '../styles/Sidebar.module.css'; // Assuming you will create a CSS module for styling

const Sidebar = () => {
  return (
    <div className={styles.sidebar}>
      <h2>Navigation</h2>
      <ul>
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/employees">Employees</Link>
        </li>
        <li>
          <Link href="/shifts">Shifts</Link>
        </li>
        <li>
          <Link href="/products">Products</Link>
        </li>
        <li>
          <Link href="/attendance">Attendance</Link>
        </li>
        <li>
          <Link href="/production">Production</Link>
        </li>
      </ul>
    </div>
  );
};

export default Sidebar;