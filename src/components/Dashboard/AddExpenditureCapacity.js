import config from '../../config';
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Modal from 'react-modal';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import apiService from '../services/apiService';
import '../../styles/AddExpenditureCapacity.css'; 

const BASE_URL = config.apiUrl;

const AddExpenditureCapacity = ({ onAddExpenditureCapacity, username, token }) => {
  // State variables
  const [category, setCategory] = useState('');
  const [limit, setLimit] = useState('');
  const [selectedMonth, setSelectedMonth] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [addBudgetMessage, setAddBudgetMessage] = useState('');
  const [capacityData, setCapacityData] = useState([]);
  const navigate = useNavigate();

  const handleAddExpenditureCapacity = async () => {
    try {
      if (typeof onAddExpenditureCapacity !== 'function') {
        console.error('onAddExpenditureCapacity is not a function');
        return;
      }

      const data = { budgetName: category, budgetNumber: limit, selectedMonth: parseInt(selectedMonth, 10) };
      const response = await onAddExpenditureCapacity(data);

      if (response && response.success) {
        setAddBudgetMessage(response.message);

        toast.success(response.message);

        setCategory('');
        setLimit('');
        setSelectedMonth('');
      } else {
        console.error('Failed to add budget capacity:', response ? response.message : 'Unknown error');
        setAddBudgetMessage(response ? response.message : 'Failed to add budget capacity');

        toast.error(response ? response.message : 'Failed to add budget capacity');
      }
    } catch (error) {
      console.error('Error adding budget capacity:', error.message);
      setAddBudgetMessage('Error adding budget capacity');

      toast.error('Error adding budget capacity');
    }
  };

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const capacityEndpoint = selectedMonth
    ? `/budgets/capacity/${selectedMonth}`
    : '/budgets/capacity';

  useEffect(() => {
    const fetchCapacityData = async () => {
      try {
        const response = await apiService.get(capacityEndpoint, token);
        setCapacityData(response.data || []);
      } catch (error) {
        console.error('Error fetching capacity data:', error);
      }
    };

    fetchCapacityData();
  }, [capacityEndpoint, token]);

  return (
    <div className="add-budget-container">
      <h3 className="header">Add Budget with this form</h3>
      <label>
        Select Month:
        <select
          className="select-dropdown"
          value={selectedMonth}
          onChange={(e) => setSelectedMonth(e.target.value)}
        >
          <option value="">Select Month</option>
          <option value="1">January</option>
          <option value="2">February</option>
          <option value="3">March</option>
          <option value="4">April</option>
          <option value="5">May</option>
          <option value="6">June</option>
          <option value="7">July</option>
          <option value="8">August</option>
          <option value="9">September</option>
          <option value="10">October</option>
          <option value="11">November</option>
          <option value="12">December</option>
        </select>
      </label>
      <label>
        Category:
        <input
          className="input-field"
          type="text"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </label>
      <br />
      <label>
        Limit:
        <input
          className="input-field"
          type="text"
          value={limit}
          onChange={(e) => setLimit(e.target.value)}
        />
      </label>
      <br />
      <button className="add-budget-button" onClick={handleAddExpenditureCapacity}>
        Add Budget
      </button>

      <h3 className="header">Capacity Data</h3>
      {capacityData.length > 0 ? (
        <table className="capacity-table">
          <thead>
            <tr>
              <th>Budget Name</th>
              <th>Budget Number</th>
            </tr>
          </thead>
          <tbody>
            {capacityData.map((item) => (
              <tr key={item.budgetname}>
                <td>{item.budgetname}</td>
                <td>{item.budgetnumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p>No capacity added.</p>
      )}

      <Modal
        isOpen={isModalOpen}
        onRequestClose={closeModal}
        contentLabel="Add Budget Message"
        className="modal"
        overlayClassName="overlay"
      >
        <h2>{addBudgetMessage}</h2>
        <button onClick={closeModal}>Close</button>
      </Modal>

      <ToastContainer />
    </div>
  );
};

export default AddExpenditureCapacity;
