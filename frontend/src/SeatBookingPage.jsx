import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API = 'http://localhost:5000';

export default function SeatBookingPage({ token, setToken }) {
  const [seats, setSeats] = useState([]);
  const [selected, setSelected] = useState([]);

  const decodeToken = (token) => {
    if (!token) return null;
    try {
      const base64Payload = token.split('.')[1];
      const decodedPayload = atob(base64Payload);
      return JSON.parse(decodedPayload);
    } catch {
      return null;
    }
  };

  const userInfo = decodeToken(token);
  const userId = userInfo?.userId;

  const fetchSeats = async () => {
    const res = await axios.get(`${API}/seats`);
    setSeats(res.data);
  };

  useEffect(() => {
    fetchSeats();
  }, []);

  const addSeats = async () => {
    const count = parseInt(prompt('How many seats to add?'), 10);
    await axios.post(`${API}/add-seats`, { count });
    fetchSeats();
  };

  const toggleSelect = (id) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const bookSeats = async () => {
    try {
      await axios.post(
        `${API}/book-seats`,
        { seatIds: selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Seats booked successfully');
      setSelected([]);
      fetchSeats();
    } catch {
      alert('Booking failed. Please login.');
    }
  };

  const cancelSeats = async () => {
    try {
      await axios.post(
        `${API}/cancel-seat`,
        { seatId: selected },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert('Selected seats cancelled');
      setSelected([]);
      fetchSeats();
    } catch (error) {
      console.log(error);
      alert('Cancellation failed. Only your own booked seats can be cancelled.');
    }
  };

  const canCancel = selected.some((id) => {
    const seat = seats.find((s) => s._id === id);
    return seat && seat.status === 'booked' && seat.bookedBy === userId;
  });

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        boxSizing: 'border-box',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: 'Segoe UI, sans-serif',
      }}
    >
      <div
        style={{
          background: 'rgba(255,255,255,0.15)',
          borderRadius: 24,
          boxShadow: '0 8px 32px 0 rgba(31, 38, 135, 0.37)',
          padding: '2.5rem 2rem 2rem 2rem',
          maxWidth: '1400px',
          width: '90vw',
          textAlign: 'center',
          backdropFilter: 'blur(8px)',
          border: '1px solid rgba(255,255,255,0.18)',
          margin: '2rem 0',
        }}
      >
        <h1
          style={{
            color: '#fff',
            marginBottom: '1.5rem',
            letterSpacing: 1,
            textShadow: '0 2px 8px rgba(0,0,0,0.2)',
            fontSize: '2.2rem',
          }}
        >
          🎬 Movie Seat Booking
        </h1>
        <div
          style={{
            marginBottom: '1.5rem',
            display: 'flex',
            gap: 12,
            justifyContent: 'center',
          }}
        >
          <button
            style={{
              borderRadius: 8,
              border: 'none',
              padding: '0.7em 1.5em',
              fontSize: '1.1em',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #667eea 0%, #764ba2 100%)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(118,75,162,0.15)',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onClick={addSeats}
          >
            Add Seats
          </button>
          <button
            style={{
              borderRadius: 8,
              border: 'none',
              padding: '0.7em 1.5em',
              fontSize: '1.1em',
              fontWeight: 600,
              background: 'linear-gradient(90deg, #ff5858 0%, #f09819 100%)',
              color: '#fff',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(255,88,88,0.15)',
              transition: 'background 0.2s, transform 0.1s',
            }}
            onClick={() => {
              setToken('');
              localStorage.removeItem('token');
            }}
          >
            Logout
          </button>
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: 14,
            justifyContent: 'center',
            marginBottom: '2rem',
          }}
        >
          {seats.map((seat) => {
            let bg, border, color, cursor, filter, textDecoration;
            if (seat.status === 'booked') {
              bg = 'linear-gradient(135deg, #ff5858 0%, #f09819 100%)';
              color = '#fff';
              cursor = 'not-allowed';
              filter = 'grayscale(0.5) opacity(0.7)';
              textDecoration = 'line-through';
              border = '2px solid transparent';
            } else if (selected.includes(seat._id)) {
              bg = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
              color = '#fff';
              border = '2px solid #fff';
              cursor = 'pointer';
              filter = 'none';
              textDecoration = 'none';
            } else {
              bg = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
              color = '#222';
              border = '2px solid transparent';
              cursor = 'pointer';
              filter = 'none';
              textDecoration = 'none';
            }

            return (
              <div
                key={seat._id}
                onClick={() =>
                  seat.status === 'available' || seat.bookedBy === userId
                    ? toggleSelect(seat._id)
                    : null
                }
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  fontWeight: 700,
                  fontSize: '1.1em',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.10)',
                  transition: 'background 0.2s, transform 0.1s, box-shadow 0.2s',
                  userSelect: 'none',
                  border,
                  background: bg,
                  color,
                  cursor,
                  filter,
                  textDecoration,
                }}
              >
                {seat.number}
              </div>
            );
          })}
        </div>

        {selected.length > 0 && (
          <div
            style={{
              marginTop: '1.5rem',
              background: '#f9f9f9',
              padding: '1rem 1.5rem',
              borderRadius: 14,
              boxShadow: '0 2px 8px rgba(118,75,162,0.07)',
              textAlign: 'center',
            }}
          >
            <h3 style={{ marginBottom: '0.5rem', color: '#764ba2' }}>Selected Seats:</h3>
            <ul style={{ listStyle: 'none', padding: 0, margin: '0.5rem 0 1rem 0' }}>
              {selected.map((id) => {
                const seat = seats.find((s) => s._id === id);
                return (
                  <li key={id} style={{ color: '#333', fontSize: '1.1em', marginBottom: '0.3em' }}>
                    {seat?.number}
                  </li>
                );
              })}
            </ul>

            <button
              style={{
                marginTop: '1rem',
                marginRight: '1rem',
                padding: '0.6rem 1.2rem',
                background: 'linear-gradient(90deg, #ffc107 0%, #ff5858 100%)',
                border: 'none',
                borderRadius: 8,
                color: '#fff',
                fontWeight: 600,
                fontSize: '1em',
                cursor: 'pointer',
                transition: 'background 0.2s, transform 0.1s',
              }}
              onClick={bookSeats}
            >
              Confirm Booking
            </button>

            {canCancel && (
              <button
                style={{
                  marginTop: '1rem',
                  padding: '0.6rem 1.2rem',
                  background: 'linear-gradient(90deg, #e53935 0%, #e35d5b 100%)',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontWeight: 600,
                  fontSize: '1em',
                  cursor: 'pointer',
                  transition: 'background 0.2s, transform 0.1s',
                }}
                onClick={cancelSeats}
              >
                Cancel Booking
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
