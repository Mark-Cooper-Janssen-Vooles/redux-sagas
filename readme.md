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
