import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css'; 
import { useRouter } from 'next/router';

const EmployeeTable = ({ hideAddButton }) => {
  const [employees, setEmployees] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editRfidTag, setEditRfidTag] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        const response = await axios.get('/api/employees');
        setEmployees(response.data);
      } catch (error) {
        console.error('Error fetching employee data:', error);
      }
    };

    fetchEmployees();
  }, []);

  // Xóa công nhân
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this employee?')) return;
    try {
      await axios.delete(`/api/employees/${id}`);
      setEmployees(employees.filter(emp => emp.id !== id));
    } catch (error) {
      console.error('Error deleting employee:', error);
    }
  };

  // Bắt đầu chỉnh sửa
  const handleEdit = (employee) => {
    setEditingId(employee.id);
    setEditName(employee.name);
    setEditRfidTag(employee.rfidTag);
  };

  // Lưu chỉnh sửa
  const handleSave = async (id) => {
    try {
      const response = await axios.put(`/api/employees/${id}`, {
        name: editName,
        rfidTag: editRfidTag,
      });
      setEmployees(employees.map(emp =>
        emp.id === id ? response.data : emp
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating employee:', error);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setEditingId(null);
  };

  return (
  <div>
    <h1>Employee List</h1>
    <table className={styles.table}>
      <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>RFID Tag</th>
          {!hideAddButton && <th>Actions</th>}
        </tr>
      </thead>
      <tbody>
        {employees.map((employee, index) => (
          <tr key={employee.id}>
            <td>{index + 1}</td>
            <td>
              {editingId === employee.id ? (
                <input
                  value={editName}
                  onChange={e => setEditName(e.target.value)}
                />
              ) : (
                employee.name
              )}
            </td>
            <td>
              {editingId === employee.id ? (
                <input
                  value={editRfidTag}
                  onChange={e => setEditRfidTag(e.target.value)}
                />
              ) : (
                employee.rfidTag
              )}
            </td>
            {!hideAddButton && (
              <td>
                {editingId === employee.id ? (
                  <>
                    <button onClick={() => handleSave(employee.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(employee)}>Edit</button>
                    <button onClick={() => handleDelete(employee.id)}>Delete</button>
                  </>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
    {!hideAddButton && (
      <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
        <button onClick={() => router.push('/add-employees')} style={{padding: "8px 16px"}}>Add</button>
      </div>
    )}
  </div>
);
};
export default EmployeeTable;