import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-form',
  imports: [FormsModule],
  templateUrl: './add-form.component.html',
  styleUrl: './add-form.component.css'
})
export class AddFormComponent {
  title: string = '';
  description: string = '';

  @Output() add = new EventEmitter<{ title: string, description: string }>();

  onAdd() {
    if (this.title.trim() && this.description.trim()) {
      this.add.emit({ title: this.title, description: this.description });
      this.title = '';
      this.description = '';
    }
    else{
      alert('Please fill in both title and description.');
    }
  }
}
