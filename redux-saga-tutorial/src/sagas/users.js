//align saga structure similar to redux actions: if you have a users file in your actions, you should have one in your sagas. it will take care of all the sagas relating to users actions.

//creating first saga to get users list:
import {takeEvery, takeLatest, take, call, fork, put} from 'redux-saga/effects';
import * as actions from '../actions/users';
import * as api from '../api/users';

//function* is a generator function
function* getUsers() {
  try{
    // once this call resolves, it will assign to result
    const result = yield call(api.getUsers);
    // nothing below will happen until call finishes
    // to send a redux success action, need to use sagas 'put'
    yield put(actions.getUsersSuccess({
      items: result.data.data
    }));
  }catch(e){
    yield put(actions.usersError({
      error: "An error occured when trying to get the users"
    }));
  }
}

function* watchGetUsersRequest() {
  yield takeEvery(actions.Types.GET_USERS_REQUEST, getUsers);
}

function* createUser(action) {
  try{
    //second argument is what you're passing in
    yield call(api.createUser, {firstName: action.payload.firstName, lastName: action.payload.lastName });
    yield call(getUsers);
  }catch(e){
    yield put(actions.usersError({
      error: "An error occured when trying to create the user"
    }));
  }
}

function* watchCreateUserRequest() {
  yield takeLatest(actions.Types.CREATE_USER_REQUEST, createUser);
}

// we're wrapping worker sagas in try catch blocks to prevent the error from bubbling up to the root saga, which could then potentially affect other sagas
function* deleteUser({userId}) {
  try{
    yield call(api.deleteUser, userId); //i.e. if this api call doesn't work, needs to be handled in the catch block!
    // gets latest users to render:
    yield call(getUsers);
  }catch(e) {
    //dispatch redux action to update users state with an error string
    yield put(actions.usersError({
      error: "An error occured when trying to delete the user"
    }));
  }
}

function* watchDeleteUserRequest() {
  // the while loop: need to wait for this entire deleteUser saga to resolve, until we're able to come back to watching for DELETE_USER_REQUEST
  while(true) {
    // take simply returns the action that was dispatched
    const action = yield take(actions.Types.DELETE_USER_REQUEST);
    // call deleteUser function with the argument of {userId: someid}
    yield call(deleteUser, {
      userId: action.payload.userId
    });
  }
}

const usersSagas = [
  fork(watchGetUsersRequest),
  fork(watchCreateUserRequest),
  fork(watchDeleteUserRequest)
];

export default usersSagas;