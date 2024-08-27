import React, { useEffect, useState } from 'react';
import api from '../../api';
import './OrderList.css';

const OrderList = () => {
    // HOOKS
    const [orders, setOrders] = useState([]);
    const [expandedOrderId, setExpandedOrderId] = useState(null);
    const [orderDetails, setOrderDetails] = useState({});
    const [loading, setLoading] = useState(true);
    const [detailsLoading, setDetailsLoading] = useState({});
    const [showModal, setShowModal] = useState(false);
    const [newOrder, setNewOrder] = useState({ client_name: '', parts: [] });
    const [availableParts, setAvailableParts] = useState([]);
    const [selectedPart, setSelectedPart] = useState({ id: '', name: '' });
    const [partQuantity, setPartQuantity] = useState(1);

    // useEffect hook to fetch orders and parts on component mount
    useEffect(() => {
        fetchOrders();
        fetchParts();
    }, []);

    // FUNCTIONS

    // Fetch orders from the API to populate the order list
    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/orders');
            console.log('Fetched orders:', response.data); // Debugging
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    
    // Fetch parts from the API to populate the part selection dropdown
    const fetchParts = async () => {
        try {
            const response = await api.get('/api/parts');
            setAvailableParts(response.data);
        } catch (error) {
            console.error('Error fetching parts:', error);
        }
    };

    // Handle click on an order to expand and show details
    const handleOrderClick = async (orderId) => {
        if (expandedOrderId === orderId) {
            setExpandedOrderId(null);
        } else {
            setDetailsLoading((prev) => ({ ...prev, [orderId]: true }));
            try {
                const response = await api.get(`/api/orders/${orderId}`);
                setOrderDetails((prevDetails) => ({
                    ...prevDetails,
                    [orderId]: response.data
                }));
                setExpandedOrderId(orderId);
            } catch (error) {
                console.error('Error fetching order details:', error);
            }
            setDetailsLoading((prev) => ({ ...prev, [orderId]: false }));
        }
    };

    // Handle delete order button click to delete an order from database
    const handleDeleteOrder = async (orderId) => {
        try {
            await api.delete(`/api/orders/${orderId}`);
            setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    // Show modal to add a new order
    const handleShowModal = () => {
        setShowModal(true);
    };

    // Close modal and reset new order form, it needs to fetch orders to refresh the list
    const handleCloseModal = () => {
        setShowModal(false);
        setNewOrder({ client_name: '', parts: [] });
        fetchOrders(); // Refresh order list after adding a new order
    };

    // Handle input change in the modal new order form
    const handleInputChange = (e) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    // Handle part selection in the modal new order form
    const handlePartSelection = (e) => {
        const partId = parseInt(e.target.value, 10);
        const part = availableParts.find(part => part.id === partId);
        setSelectedPart(part || { id: '', name: '' });
    };

    // Handle part quantity change in the modal new order form
    const handlePartQuantityChange = (e) => {
        setPartQuantity(parseInt(e.target.value, 10));
    };
    
    // Add selected part to the new order
    const handleAddPart = () => {
        if (selectedPart.id) {
            setNewOrder(prevOrder => ({
                ...prevOrder,
                parts: [...prevOrder.parts, { part_id: selectedPart.id, name: selectedPart.name, quantity: partQuantity }]
            }));
            setSelectedPart({ id: '', name: '' }); // reset selected part after adding a part
            setPartQuantity(1); // default quantity to 1 after adding a part
        }
    };

    // Submit new order to the API
    const handleSubmitOrder = async () => {
        try {
            setLoading(true);
            const response = await api.post('/api/orders', newOrder);
            setOrders(prevOrders => [...prevOrders, response.data]); // Add new order to the local list of orders
            handleCloseModal();
        } catch (error) {
            console.error('Error adding new order:', error);
        } finally {
            setLoading(false);
        }
    };

    // HTML
    return (
        <div className="container">
            <h1 className="header">Order List</h1>
            {loading ? (
                <div>Loading orders...</div>
            ) : (
                <>
                    <ul className="orderList">
                        {orders.map((order) => (
                            <li
                                key={order.id}
                                onClick={() => handleOrderClick(order.id)}
                                className="orderItem"
                            >
                                <div>
                                    <strong>Date:</strong> {order.Date || 'N/A'}<br />
                                    <strong>Client:</strong> {order.Client || 'N/A'}<br />
                                    <strong>Total Cost:</strong> {order.Total_Cost || 'N/A'}<br />
                                    <strong>Labor Cost:</strong> {order.Labor_Cost || 'N/A'}<br />
                                    <strong>Parts Cost:</strong> {order.Parts_Cost || 'N/A'}<br />
                                    <strong>Total Time:</strong> {order.Total_Time || 'N/A'}<br />
                                    <strong>ETA Date:</strong> {order.ETA_Delivery || 'N/A'}<br />
                                </div>
                                <button onClick={() => handleDeleteOrder(order.id)} className="button-delete">Delete</button>
                                {expandedOrderId === order.id && (
                                    detailsLoading[order.id] ? (
                                        <div>Loading details...</div>
                                    ) : (
                                        <ul className="orderDetails">
                                            {orderDetails[order.id]?.parts?.map((part, index) => (
                                                <li key={index} className="partItem">
                                                    <div>
                                                        <strong>Part:</strong> {part.part_name}<br />
                                                        <strong>Quantity:</strong> {part.quantity}<br />
                                                        <strong>Price:</strong> ${part.price}<br />
                                                        <strong>Work Hours per part:</strong> {part.work_hours}<br />
                                                    </div>
                                                </li>
                                            ))}
                                        </ul>
                                    )
                                )}
                            </li>
                        ))}
                    </ul>
                    <button onClick={handleShowModal} className="button-add">Add New Order</button>
                </>
            )}

            
            {showModal && (
                <div className="modal">
                    <div className="modal-content">
                        <span className="close" onClick={handleCloseModal}>&times;</span>
                        <h2>Add New Order</h2>
                        <form className='modal-form' onSubmit={e => e.preventDefault()}>
                            <label>
                                Client Name:
                                <input
                                    type="text"
                                    name="client_name"
                                    value={newOrder.client_name}
                                    onChange={handleInputChange}
                                />
                            </label>
                            <label>
                                Select Part:
                                <select value={selectedPart.id || ''} onChange={handlePartSelection}>
                                    <option value="">Select a part</option>
                                    {availableParts.map(part => (
                                        <option key={part.id} value={part.id}>{part.name}</option>
                                    ))}
                                </select>
                            </label>
                            <label>
                                Quantity:
                                <input
                                    type="number"
                                    value={partQuantity}
                                    onChange={handlePartQuantityChange}
                                />
                            </label>
                            <button type="button" onClick={handleAddPart}>Add Part</button>
                            <h3>Parts to Order:</h3>
                            <ul>
                                {newOrder.parts.map((part, index) => (
                                    <li key={index}>
                                        Part ID: {part.part_id}, Name: {part.name}, Quantity: {part.quantity}
                                    </li>
                                ))}
                            </ul>
                            <button type="button" onClick={handleSubmitOrder}>Submit Order</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderList;
