import React ,{Component} from 'react';
import './auth.css';
import AuthContext from '../context/auth-context';
class AuthPage extends Component {
    state = {
      isLogin: true,
      register:false,
      checklogin:false
    };
  
    static contextType=AuthContext;

    constructor(props) {
      super(props);
      this.emailEl = React.createRef();
      this.passwordEl = React.createRef();
    }
  
    switchModeHandler = () => {
      this.setState(prevState => {
        return { isLogin: !prevState.isLogin };
      });
    };
  
   

  submitHandler = event => {
    event.preventDefault();
    const email = this.emailEl.current.value;
    const password = this.passwordEl.current.value;

    if (email.trim().length === 0 || password.trim().length === 0) {
      return;
    }

    let requestBody = {
      query: `
        query Login($email: String!, $password: String!) {
          login(email: $email, password: $password) {
            userId
            token
            tokenExpiration
          }
        }
      `,
      variables: {
        email: email,
        password: password
      }
    };

    if (!this.state.isLogin) {
      requestBody = {
        query: `
          mutation CreateUser($email: String!, $password: String!) {
            createUser(userInput: {email: $email, password: $password}) {
              _id
              email
            }
          }
        `,
        variables: {
          email: email,
          password: password
        }
      };
    }

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
        this.setState({register:true})
        return res.json();
      })
      .then(resData => {
        if (resData.data.login.token) {
          this.context.login(
            resData.data.login.token,
            resData.data.login.userId,
            resData.data.login.tokenExpiration
          );
          this.setState({register:false});
          this.setState({checklogin:false});
        }
      })
      .catch(err => {
        console.log(err);
        this.setState({checklogin:true})
      });
  };

  
    render() {
      return (
        
        <form className="auth-form" onSubmit={this.submitHandler}>
            {(!this.StateisLogin&&this.state.register)?(<p className="register">Register successfully !! </p>):null }
            {(!this.StateisLogin&&this.state.checklogin)?(<p className="checklogin">Invalid ID Password  !! </p>):null }
          <div className="form-control">
            <label htmlFor="email">E-Mail</label>
            <input type="email" className="email" id="email" ref={this.emailEl} />
          </div>
          <div className="form-control">
            <label htmlFor="password">Password</label>
            <input type="password" id="password" ref={this.passwordEl} />
          </div>
          <div className="form-actions">
            <button type="submit">Submit</button>
            <button type="button" onClick={this.switchModeHandler}>
              Switch to {this.state.isLogin ? 'Signup' : 'Login'}
            </button>
          </div>
        
        </form>
      );
    }
  }
  
  export default AuthPage;