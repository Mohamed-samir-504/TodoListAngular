import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, from, map } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private readonly baseUrl = 'https://firestore.googleapis.com/v1/projects/todolist-dd189/databases/(default)/documents/todo-items';
  private readonly apiKey = 'AIzaSyAHfTgwgSamL-iR3PT4lqZZ219aqWZ-PZE';

  constructor(private http: HttpClient) { }

  getTodos(): Observable<any> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    return this.http.get<any>(url).pipe(

      map(response => {
        console.log('Response:', response);
        if (!response.documents) return [];
        return response.documents.map((doc: any) => {
          const fields = doc.fields;
          return {
            id: doc.name.split('/').pop(),
            title: fields.title.stringValue,
            description: fields.description.stringValue,
            status: fields.status.stringValue,
            priority: fields.priority.booleanValue,
            userId: fields.userId.stringValue,
            timestamp: new Date(fields.timestamp.timestampValue)
          };
        });
      })
    );
  }

  addTodo(title: string, description: string, userId: string): Observable<any> {
    const url = `${this.baseUrl}?key=${this.apiKey}`;
    const body = {
      fields: {
        title: { stringValue: title },
        description: { stringValue: description },
        status: { stringValue: 'todo' },
        priority: { booleanValue: false },
        userId: { stringValue: userId },
        timestamp: { timestampValue: new Date().toISOString() }
      }
    };
    return this.http.post(url, body);
  }

  deleteTodo(id: string): Observable<any> {
    const url = `${this.baseUrl}/${id}?key=${this.apiKey}`;
    return this.http.delete(url);
  }

  updateStatus(id: string, status: string): Observable<any> {
    const url = `${this.baseUrl}/${id}?key=${this.apiKey}&updateMask.fieldPaths=status`;
    const body = {
      fields: {
        status: { stringValue: status }
      }
    };
    return this.http.patch(url, body);
  }

  updatePriority(id: string, priority: boolean): Observable<any> {
    const url = `${this.baseUrl}/${id}?key=${this.apiKey}&updateMask.fieldPaths=priority`;
    const body = {
      fields: {
        priority: { booleanValue: priority }
      }
    };
    return this.http.patch(url, body);
  }
}
