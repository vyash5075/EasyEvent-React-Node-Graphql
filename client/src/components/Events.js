import React ,{Component} from 'react';
import './events.css';
import Modal from './modal/modal';
import Backdrop from './Backdrop/Backdrop'
import AuthContext from '../context/auth-context';
import EventList from '../Events/Event-List/EventList';


class EventsPage extends Component {
  state = {
    creating: false,
    events: [],
    isLoading: false,
    selectedEvent: null
  };
  isActive = true;

  static contextType = AuthContext;

  constructor(props) {
    super(props);
    this.titleElRef = React.createRef();
    this.priceElRef = React.createRef();
    this.dateElRef = React.createRef();
    this.descriptionElRef = React.createRef();
  }

  componentDidMount() {
    this.fetchEvents();
  }

  startCreateEventHandler = () => {
    this.setState({ creating: true });
  };

  modalConfirmHandler = () => {
    this.setState({ creating: false });
    const title = this.titleElRef.current.value;
    const price = +this.priceElRef.current.value;
    const date = this.dateElRef.current.value;
    const description = this.descriptionElRef.current.value;

    if (
      title.trim().length === 0 ||
      price <= 0 ||
      date.trim().length === 0 ||
      description.trim().length === 0
    ) {
      return;
    }

    const event = { title, price, date, description };
    console.log(event);

    const requestBody = {
      query: `
          mutation {
            createEvent(eventInput: {title: "${title}", description: "${description}", price: ${price}, date: "${date}"}) {
              _id
              title
              description
              date
              price
            }
          }
        `
    };

    const token = this.context.token;

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + token
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
          const updatedEvents = [...prevState.events];
          updatedEvents.push({
            _id: resData.data.createEvent._id,
            title: resData.data.createEvent.title,
            description: resData.data.createEvent.description,
            date: resData.data.createEvent.date,
            price: resData.data.createEvent.price,
            creator: {
              _id: this.context.userId
            }
          });
          return { events: updatedEvents };
        });
      })
      .catch(err => {
        console.log(err);
      });
  };

  modalCancelHandler = () => {
    this.setState({ creating: false, selectedEvent: null });
  };

  fetchEvents() {
    this.setState({ isLoading: true });
    const requestBody = {
      query: `
          query {
            events {
              _id
              title
              description
              date
              price
              creator {
                _id
                email
              }
            }
          }
        `
    };

    fetch('http://localhost:4000/graphql', {
      method: 'POST',
      body: JSON.stringify(requestBody),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(res => {
        if (res.status !== 200 && res.status !== 201) {
          throw new Error('Failed!');
        }
        return res.json();
      })
      .then(resData => {
        const events = resData.data.events;
        if (this.isActive) {
          this.setState({ events: events, isLoading: false });
        }
      })
      .catch(err => {
        console.log(err);
        if (this.isActive) {
          this.setState({ isLoading: false });
        }
      });
  }

  showDetailHandler = eventId => {
    this.setState(prevState => {
      const selectedEvent = prevState.events.find(e => e._id === eventId);
      return { selectedEvent: selectedEvent };
    });
  };

  bookEventHandler = () => {
    if (!this.context.token) {
      this.setState({ selectedEvent: null });
      return;
    }
    const requestBody = {
      query: `
          mutation {
            bookEvent(eventId: "${this.state.selectedEvent._id}") {
              _id
             createdAt
             updatedAt
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
        console.log(resData);
        this.setState({ selectedEvent: null });
      })
      .catch(err => {
        console.log(err);
      });
  };

  componentWillUnmount() {
    this.isActive = false;
  }
    render() {
        
      return (
        <React.Fragment>
          <h1 className="h1">EVENTS!!</h1>
          {this.state.creating && <Backdrop />}
          {this.state.creating && (
            <Modal
              title="Add Event"
              canCancel="yash"
              canConfirm="verma"
              onCancel={this.modalCancelHandler}
              onConfirm={this.modalConfirmHandler}
              confirmText="Confirm"
            >
              <form>
                  <div className="form-control">
                      <label htmlFor="title">Title</label>
                      <input type="text" id="title" ref={this.titleElRef}></input>
                  </div>
                  <div className="form-control">
                      <label htmlFor="price">Price</label>
                      <input type="number" id="price" ref={this.priceElRef}></input>                     
                  </div>
                  <div className="form-control">
                      <label htmlFor="date">Date</label>
                      <input type="datetime-local" id="date" ref={this.dateElRef}></input>                     
                  </div>

                  <div className="form-control">
                      <label htmlFor="description">Description</label>
                      <textarea className="textarea" rows="4" id="description"ref={this.descriptionElRef}/>
                     
                  </div>          
              </form>
            </Modal>
          )}
         {this.state.selectedEvent&& <Backdrop /> }
          {this.state.selectedEvent&& (
          <Modal
            title={this.state.selectedEvent.title}
            canCancel
            canConfirm
            onCancel={this.modalCancelHandler}
            onConfirm={this.bookEventHandler}
            confirmText={this.context.token ? 'Book' : 'Confirm'}
          >
            <h1>{this.state.selectedEvent.title}</h1>
            <h2>
              ${this.state.selectedEvent.price} -{' '}
              {new Date(this.state.selectedEvent.date).toLocaleDateString()}
            </h2>
            <p>{this.state.selectedEvent.description}</p>
          </Modal>
        )}
         {this.context.token && (<div className="events-control">
            <h2>Share your own Events!</h2>
            <button className="btn" onClick={this.startCreateEventHandler}>
              Create Event
            </button>
          </div>)}
          
            {this.state.isLoading?(<h2>LOADING...</h2>):
          (<EventList
            events={this.state.events}
            authUserId={this.context.userId}
            onViewDetail={this.showDetailHandler}
          />
            )}
        </React.Fragment>
      );
    }
  }
  
  export default EventsPage;