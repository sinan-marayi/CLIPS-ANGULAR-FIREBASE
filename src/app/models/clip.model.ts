import firebase from 'firebase/compat/app';

export default interface IClip {
  docID?:string
  uid: string;
  title: string;
  fileName: string;
  displayName: string;
  url: string;
  timeStamp: firebase.firestore.FieldValue;
}
