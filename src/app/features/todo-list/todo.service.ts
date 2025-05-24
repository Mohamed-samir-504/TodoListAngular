import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TodoService {
  private apiKey = environment.firebaseApiKey;
  private projectId = environment.firebaseProjectId;
  private databaseURL = environment.firestoreBaseUrl;
  private baseUrl = `${this.databaseURL}/${this.projectId}/databases/(default)/documents/todo-items`;

  constructor(private http: HttpClient) { }

  getTodos(userId: string): Observable<any> {
    const url = `${this.databaseURL}/${this.projectId}/databases/(default)/documents:runQuery?key=${this.apiKey}`;
    const body = {
      structuredQuery: {
        from: [{ collectionId: 'todo-items' }],
        where: {
          fieldFilter: {
            field: { fieldPath: 'userId' },
            op: 'EQUAL',
            value: { stringValue: userId }
          }
        }
      }
    };
    return this.http.post<any>(url, body).pipe(
      map(response => this.responseToArray(response)),

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

  responseToArray(response: any[]): any[] {
    if (!response || response.length === 0) {
      return [];
    }
    // Because the response might contain other types of objects besides documents,
    // If there is no todos for the user, the response contains an object and it is not an empty array
    const validDocs = response.filter(r => r.document);

    if (validDocs.length === 0) {
      return [];
    }

    return validDocs.map((r: any) => {
      const fields = r.document.fields;
      return {
        id: r.document.name.split('/').pop(),
        title: fields.title.stringValue,
        description: fields.description.stringValue,
        status: fields.status.stringValue,
        priority: fields.priority.booleanValue,
        userId: fields.userId.stringValue,
        timestamp: new Date(fields.timestamp.timestampValue)
      };
    });
  }
}
