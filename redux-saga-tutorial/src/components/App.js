import React, {Component} from 'react';
import {connect} from 'react-redux';
import {getUsersRequest, createUserRequest, deleteUserRequest, usersError} from '../actions/users';
import UsersList from './UsersList';
import NewUserForm from './NewUserForm';
import {Alert} from 'reactstrap';

//when we get to the end of the function, there will be 'undefined'. If we put a while loop in there, it just loops back to the first return. 
// this is whats happening in the redux-sagas too, under the hood for e.g. takeEvery also has a while(true) loop going on.
// function* testing() {
//   while(true) {
//     yield 1;
//     yield 2;
//     yield "three";
//   }
// }

class App extends Component {
  constructor(props) {
    super(props);

    this.props.getUsersRequest();
  }

  handleSubmit = ({firstName, lastName}) => {
    this.props.createUserRequest({
      firstName,
      lastName
    });
  };

  handleDeleteUserClick = (userId) => {
    this.props.deleteUserRequest(userId);
  };

  handleCloseAlert = () => {
    this.props.usersError({
      error: ''
    })
  }

  render () {
    const users = this.props.users;

    return (
      <div style={{margin: '0 auto', padding: '20px', maxWidth: '600px'}}>
        <Alert color="danger" isOpen={!!this.props.users.error} toggle={this.handleCloseAlert}>
          {this.props.users.error}
        </Alert>
        <NewUserForm onSubmit={this.handleSubmit}/>
        <UsersList users={users.items} onDeleteUser={this.handleDeleteUserClick} />
      </div>
    );
  }
}

export default connect(({users}) => ({users}), {
  getUsersRequest,
  createUserRequest,
  deleteUserRequest,
  usersError
})(App);
