# Redux Saga

### What is redux saga? 
A library that aims to make application side effects (i.e. async things like data fetching and impure things like accessing the browser cache) easier to manage, more efficient to excute, simple to test, and better at handling failures. 

The mental model is that a saga is like a separate thread in your app thats solely responsible for side effects. Redux-saga is a redux middleware (this thread can be started, paused and cancelled from the main app with normal redux actions) => it has access to full redux app state and can dispatch redux actions as well

It uses es6 generators

Redux thunk accomplishes a similar thing, but in a different way. 


When writing sagas, we usually have a two pattern method: A 'watcher saga', which calls a 'worker saga' (i.e. calling an API)

## Setting up: 
npx create-react-app redux-saga-tut
cd redux-saga-tut
npm install --save redux react-redux redux-saga reactstrap react react-dom axios (wont need reactstrap normally)
make files "components", "actions", "reducers", "sagas"
deletes app.test.js + css filesnp
moves app.js components

using dummy API: "REM REST API"
https://rem-rest-api.herokuapp.com/


## Generator functions
Generator functions must always yield values. 
When we hit yield, it returns a value. Then waits for us to instruct it to run again. 
We call it in such a way, that iterates through each yield. 
When there are no more values to return, the function terminates.

````js
//when we get to the end of the function, there will be 'undefined'. If we put a while loop in there, it just loops back to the first return. 
// this is whats happening in the redux-sagas too, under the hood for e.g. takeEvery also has a while(true) loop going on.
function* testing() {
  while(true) {
    yield 1;
    yield 2;
    yield "three";
  }
}

class App extends Component {
  render () {
    const iterator = testing();
    console.log(iterator.next());
    console.log(iterator.next());
    console.log(iterator.next());
    console.log(iterator.next());

    return (
      <div className="App">
        test
      </div>
    );
  }
}
````


======

Cheatsheet he listed: 

## Redux Saga Cheat Sheet

Examples of when to use various Redux Saga keywords and techniques:

### "takeEvery"
"takeEvery" watches for every time a specific redux action was dispatch (think of state - it just watches a redux action and sees if its called, then it triggers) (i.e. a code-handled api fetch)

Use this when: You want to watch for EVERY time a specific redux action was dispatched.

Use case: Getting / fetching a list of data from an API.

Example:
````js
function* watchGetUsersRequest(){
    yield takeEvery(action.Types.GET_USERS_REQUEST, getUsers);
}
````

### "takeLatest"
"takeLatest" => use when theres potential for a redux action to be dispatched multiple times in a short period and could initiate muptile instances of the same saga (i.e. a button click, the user could click it a few times)

Use this when: There's the potential for a redux action to be dispatched multiple times in a short period and could potentially initiate the running of multiple instances of the same saga - use takeLatest to ONLY take the latest currently running saga for the associated dispatched redux action.

Use cases: Creating or updating a record, or;

If you have a complex app that queries the same API endpoint from multiple components at the same time - for example if you have a navbar that displays the currently logged in user's name, but the user is viewing a 'settings' page to view their personal details meaning both the navbar and the settings page will query the same API endpoint - you'll generally want to take the latest call for that data.

Example:
````js
function* watchGetLoggedInUserRequest(){
    yield takeLatest(action.Types.GET_LOGGED_IN_USER_REQUEST, getLoggedInUser);
}
````

### Blocking saga with "take"
"take" => listens for a redux action to be dispatched, but dont want to listen for same action until the currently running saga has completed. Blocking the ability to watch until its completed. I.e. deleting a user or accepting a payment

Use this when: You want to watch for a particular redux action to be dispatched, but you don't want to listen for that same dispatched action again until the currently running saga for that action has complete. You're "blocking" the ability to watch for when that particular redux action is dispatched until the currently running saga for that redux action has complete.

Use case: Deleting a user, or;

Accepting a payment. Generally you don't want to be able to accept multiple, simultaneous payments - you'd want to wait for the current transaction to complete before allowing the ability to accept another payment.

Example:
````js
function* watchDeleteUserRequest(){
    while(true){
        const {userId} = yield take(action.Types.DELETE_USER_REQUEST);
        yield call(deleteUser, {userId});
    }
}
````

### "call"
"call" => want to call a function or promise, but want to wait for that function or promise to finish running before executing the next line of code. i.e. in conjunction with take, or calling a promise within a worker saga that queries an api endpoint. 

Use this when: You want to call a function or a promise but want to wait for that function or promise to finish running before executing the next line of code.

Use case: In conjunction with "take" and blocking saga, or;

Calling a promise within a worker saga that queries an API endpoint.

Examples:
````js
function* deleteUser({userId}){
    try{
        const result = yield call(api.deleteUser, userId);
    }catch(e){
    
    }
}
 
function* watchDeleteUserRequest(){
    while(true){
        const {userId} = yield take(action.Types.DELETE_USER_REQUEST);
        yield call(deleteUser, {userId});
    }
}
````

### "put"
"put" => used when you want to dispatch a redux action from within a redux saga

Use this when: You want to dispatch a redux action from within a redux saga.

Use case: Any time you want to update your redux state - usually after a call to an API resolves and you want to update your redux state with the resulting data from the API.

### "fork"
Forking (used in 'usersSagas') puts each saga as a seperate process => used to export the sagas to give the rest of the project access via rootSaga (in sagas/index.js)

Examples:
````js
function* getUsers(){
    try{
        const result = yield call(api.getUsers);
        yield put(actions.getUsersSuccess({
            users: result.data.users
        }));
    }catch(e){
    
    }
}
````
===

### General Flow: 
Setup a redux store as usual. When a redux function is used, it triggers the action which triggers the saga (the saga listens for the action). More precisely, the "watcher" saga watches for the redux action, then it fires off the worker saga, which does the work.

- The actions simply take arguments (and are globally hooked up thanks to connect). 
- The sagas: The watcher sagas simply watch for when the actions are called, and then the worker sagas actually fire off the REST API request, in a try catch block.
- The reducers are in charge of actually handling state. 

1. Create a react app
2. Setup project including redux store and api folder etc (follow layout of redux-saga example!)
  - in src he has folders: components, actions, reducers, sagas
  - checkout what he does in index.js with axios.defaults.baseURL ... dayyumn
3. Hook up the redux saga
  - pay close attention to video to: its applied like a middleware to redux saga
  - whenever we're observing redux actions (i.e. takeLatest or takeEvery), the redux action is passed into the worker saga that we specified as the first argument. You can put an argument of 'action' and then console.log(action) to see it!

