import UsersSagas from './users';
import {all} from 'redux-saga/effects';

export default function* rootSaga() {
  yield all([
    ...UsersSagas
  ]) //similar to promise.resolveAll

  //allows all forked proccesses to be created in parrallel
}