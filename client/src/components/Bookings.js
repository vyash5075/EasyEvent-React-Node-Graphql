import React, { Component } from 'react';
import AuthContext from '../context/auth-context';
import BookingList from './bookings/BookingList';
import BookingsControls from './bookings/bookingControls/BookingControls'
import BookingsChart from './bookings/BookingChart'
class BookingsPage extends Component {
    state = {
        isLoading: false,
        bookings: [],
        outputType: 'list'
      };
    static contextType = AuthContext;
  
    componentDidMount() {
      this.fetchBookings();
    }
  
    fetchBookings = () => {
      this.setState({ isLoading: true });
      const requestBody = {
        query: `
            query {
              bookings {
                _id
               createdAt
               event {
                 _id
                 title
                 date
                 price
               }
              }
            }
          `
      };
  
      fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.context.token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          const bookings = resData.data.bookings;
          this.setState({ bookings: bookings, isLoading: false });
        })
        .catch(err => {
          console.log(err);
          this.setState({ isLoading: false });
        });
    };
  
    deleteBookingHandler = bookingId => {
      this.setState({ isLoading: true });
      const requestBody = {
        query: `
            mutation {
              cancelBooking(bookingId: "${bookingId}") {
              _id
               title
              }
            }
          `
      };
  
      fetch('http://localhost:4000/graphql', {
        method: 'POST',
        body: JSON.stringify(requestBody),
        headers: {
          'Content-Type': 'application/json',
          Authorization: 'Bearer ' + this.context.token
        }
      })
        .then(res => {
          if (res.status !== 200 && res.status !== 201) {
            throw new Error('Failed!');
          }
          return res.json();
        })
        .then(resData => {
          this.setState(prevState => {
            const updatedBookings = prevState.bookings.filter(booking => {
              return booking._id !== bookingId;
            });
            return { bookings: updatedBookings, isLoading: false };
          });
        })
        .catch(err => {
          console.log(err);
          this.setState({ isLoading: false });
        });
    };

    changeOutputTypeHandler = outputType => {
        if (outputType === 'list') {
          this.setState({ outputType: 'list' });
        } else {
          this.setState({ outputType: 'chart' });
        }
      };
    render() {
        let content = <h1>LOADING!!</h1>;
        if (!this.state.isLoading) {
          content = (
            <React.Fragment>
              <BookingsControls
                activeOutputType={this.state.outputType}
                onChange={this.changeOutputTypeHandler}
              />
              <div>
                {this.state.outputType === 'list' ? (
                  <BookingList
                    bookings={this.state.bookings}
                    onDelete={this.deleteBookingHandler}
                  />
                ) : (
                  <BookingsChart bookings={this.state.bookings} />
                )}
              </div>
            </React.Fragment>
          );
        }
        return <React.Fragment>{content}</React.Fragment>;
      }
    }
    
export default BookingsPage;