import React, { useEffect, useState } from 'react';
import api from '../../api';
import './OrderList.css';

const OrderList = () => {
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

    useEffect(() => {
        fetchOrders();
        fetchParts();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await api.get('/api/orders');
            setOrders(response.data);
        } catch (error) {
            console.error('Error fetching orders:', error.response?.data || error.message);
        } finally {
            setLoading(false);
        }
    };
    

    const fetchParts = async () => {
        try {
            const response = await api.get('/api/parts');
            setAvailableParts(response.data);
        } catch (error) {
            console.error('Error fetching parts:', error);
        }
    };

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

    const handleDeleteOrder = async (orderId) => {
        try {
            await api.delete(`/api/orders/${orderId}`);
            setOrders((prevOrders) => prevOrders.filter(order => order.id !== orderId));
        } catch (error) {
            console.error('Error deleting order:', error);
        }
    };

    const handleEditOrder = async (orderId) => {
        alert('Edit functionality not yet implemented');
    };

    const handleShowModal = () => {
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setNewOrder({ client_name: '', parts: [] });
        fetchOrders(); // Refresh order list after adding a new order
    };

    const handleInputChange = (e) => {
        setNewOrder({ ...newOrder, [e.target.name]: e.target.value });
    };

    const handlePartSelection = (e) => {
        const partId = parseInt(e.target.value, 10);
        const part = availableParts.find(part => part.id === partId);
        setSelectedPart(part || { id: '', name: '' });
    };

    const handlePartQuantityChange = (e) => {
        setPartQuantity(parseInt(e.target.value, 10));
    };

    const handleAddPart = () => {
        if (selectedPart.id) {
            setNewOrder(prevOrder => ({
                ...prevOrder,
                parts: [...prevOrder.parts, { part_id: selectedPart.id, name: selectedPart.name, quantity: partQuantity }]
            }));
            setSelectedPart({ id: '', name: '' });
            setPartQuantity(1);
        }
    };

    const handleSubmitOrder = async () => {
        try {
            setLoading(true);
            const response = await api.post('/api/orders', newOrder);
            setOrders(prevOrders => [...prevOrders, response.data]);
            handleCloseModal();
        } catch (error) {
            console.error('Error adding new order:', error);
        } finally {
            setLoading(false);
        }
    };

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
                                    <strong>Date:</strong> {order.order_date}<br />
                                    <strong>Client:</strong> {order.client_name}<br />
                                    <strong>Total Cost:</strong> ${order.total_cost?.toFixed(2) || 'N/A'}<br />
                                    <strong>Labor Cost:</strong> ${order.labor_cost?.toFixed(2) || 'N/A'}<br />
                                    <strong>Total Time:</strong> {order.total_time || 'N/A'} hours<br/>
                                </div>
                                <button onClick={() => handleEditOrder(order.id)} className="button-edit">Edit</button>
                                <button onClick={() => handleDeleteOrder(order.id)} className="button-delete">Delete</button>
                                {expandedOrderId === order.id && (
                                    detailsLoading[order.id] ? (
                                        <div>Loading details...</div>
                                    ) : (
                                        <ul className="orderDetails">
                                            {orderDetails[order.id]?.details?.map((part, index) => (
                                                <li key={index} className="partItem">
                                                    <div>
                                                        <strong>Part:</strong> {part.name}<br />
                                                        <strong>Quantity:</strong> {part.quantity}<br />
                                                        <strong>Price:</strong> ${part.price}<br />
                                                        <strong>Work Hours:</strong> {part.work_hours}<br />
                                                        <strong>Warehouse:</strong> {part.warehouse_name}<br />
                                                        <strong>Delivery Time:</strong> {part.delivery_time} hours
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
