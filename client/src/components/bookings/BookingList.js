import React from 'react';

import './bookinglist.css';

const bookingList = props => (
  <ul className="bookings__list">
    {props.bookings.map(booking => {
      return (
        <li key={booking._id} className="bookings__item">
          <div className="bookings__item-data"><h3>
            {booking.event.title} -{' '}
            {new Date(booking.createdAt).toLocaleDateString()}</h3>
          </div>
          <div className="bookings__item-actions">
            <button className="btn" onClick={props.onDelete.bind(this, booking._id)}>Cancel</button>
          </div>
        </li>
      );
    })}
  </ul>
);

export default bookingList;