import { Injectable } from '@angular/core';
import {
  Firestore,
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
  query,
  orderBy
} from '@angular/fire/firestore';
import { collectionData } from '@angular/fire/firestore';
import { Observable, from } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  constructor(private firestore: Firestore) {}

  getTodos(): Observable<any[]> {
    const todoCollection = collection(this.firestore, 'todo-items');
    const q = query(todoCollection, orderBy('priority', 'desc'));
    return collectionData(q, { idField: 'id' }); 
  }

  addTodo(title: string, description: string): Observable<any> {
    const todoCollection = collection(this.firestore, 'todo-items');
    const addPromise = addDoc(todoCollection, {
      title,
      description,
      status: 'todo',
      priority: 0,
      timestamp: serverTimestamp()
    });
    return from(addPromise); // convert Promise to Observable
  }

  deleteTodo(id: string): Observable<void> {
    const deletePromise = deleteDoc(doc(this.firestore, 'todo-items', id));
    return from(deletePromise);
  }

  updateStatus(id: string, status: string): Observable<void> {
    const updatePromise = updateDoc(doc(this.firestore, 'todo-items', id), { status });
    return from(updatePromise);
  }

  updatePriority(id: string, priority: number): Observable<void> {
    const updatePromise = updateDoc(doc(this.firestore, 'todo-items', id), { priority });
    return from(updatePromise);
  }
}
