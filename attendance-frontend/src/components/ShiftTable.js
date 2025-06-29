import React, { useEffect, useState } from 'react';
import axios from 'axios';
import styles from '../styles/Home.module.css';
import { useRouter } from 'next/router';

const ShiftTable = ({ hideAddButton }) => {
  const [shifts, setShifts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [editName, setEditName] = useState('');
  const [editStartTime, setEditStartTime] = useState('');
  const [editEndTime, setEditEndTime] = useState('');
  const [editPlannedQuantity, setEditPlannedQuantity] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchShifts = async () => {
      try {
        const response = await axios.get('/api/shifts');
        setShifts(response.data);
      } catch (error) {
        console.error('Error fetching shifts:', error);
      }
    };
    fetchShifts();
  }, []);

  // Xoá shift
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this shift?')) return;
    try {
      await axios.delete(`/api/shifts/${id}`);
      setShifts(shifts.filter(shift => shift.id !== id));
    } catch (error) {
      console.error('Error deleting shift:', error);
    }
  };

  function toDatetimeLocal(dtString) {
    if (!dtString) return '';
    const dt = new Date(dtString);
    dt.setMinutes(dt.getMinutes() - dt.getTimezoneOffset());
    return dt.toISOString().slice(0, 16);
  }

  // Bắt đầu chỉnh sửa
  const handleEdit = (shift) => {
    setEditingId(shift.id);
    setEditName(shift.name);
    setEditStartTime(toDatetimeLocal(shift.startTime));
    setEditEndTime(toDatetimeLocal(shift.endTime));
    setEditPlannedQuantity(shift.plannedQuantity);
  };

  // Lưu chỉnh sửa
  const handleSave = async (id) => {
    const fixedStartTime = editStartTime.length === 16 ? editStartTime + ':00' : editStartTime;
    const fixedEndTime = editEndTime.length === 16 ? editEndTime + ':00' : editEndTime;
    try {
      const response = await axios.put(`/api/shifts/${id}`, {
        name: editName,
        startTime: fixedStartTime,
        endTime: fixedEndTime,
        plannedQuantity: Number(editPlannedQuantity),
      });
      setShifts(shifts.map(shift =>
        shift.id === id ? response.data : shift
      ));
      setEditingId(null);
    } catch (error) {
      console.error('Error updating shift:', error);
    }
  };

  // Hủy chỉnh sửa
  const handleCancel = () => {
    setEditingId(null);
  };

  return (
    <div>
      <h1>Shift Management</h1>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>STT</th>
            <th>Name</th>
            <th>Start Time</th>
            <th>End Time</th>
            <th>Planned Quantity</th>
            {!hideAddButton && <th>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {shifts.map((shift, index) => (
            <tr key={shift.id}>
              <td>{index + 1}</td>
              <td>
                {editingId === shift.id ? (
                  <input
                    value={editName}
                    onChange={e => setEditName(e.target.value)}
                  />
                ) : (
                  shift.name
                )}
              </td>
              <td>
                {editingId === shift.id ? (
                  <input
                    type="datetime-local"
                    value={editStartTime}
                    onChange={e => setEditStartTime(e.target.value)}
                  />
                ) : (
                  new Date(shift.startTime).toLocaleString()
                )}
              </td>
              <td>
                {editingId === shift.id ? (
                  <input
                    type="datetime-local"
                    value={editEndTime}
                    onChange={e => setEditEndTime(e.target.value)}
                  />
                ) : (
                  new Date(shift.endTime).toLocaleString()
                )}
              </td>
              <td>
                {editingId === shift.id ? (
                  <input
                    type="number"
                    value={editPlannedQuantity}
                    onChange={e => setEditPlannedQuantity(e.target.value)}
                  />
                ) : (
                  shift.plannedQuantity
                )}
              </td>
              {!hideAddButton && (
              <td>
                {editingId === shift.id ? (
                  <>
                    <button onClick={() => handleSave(shift.id)}>Save</button>
                    <button onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <button onClick={() => handleEdit(shift)}>Edit</button>
                    <button onClick={() => handleDelete(shift.id)}>Delete</button>
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
        <button onClick={() => router.push('/add-shift')} style={{padding: "8px 16px"}}>Add</button>
      </div>
      )}
    </div>
  );
};

export default ShiftTable;