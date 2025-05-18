import { Component, EventEmitter, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-form',
  imports: [FormsModule],
  templateUrl: './search-form.component.html',
  styleUrl: './search-form.component.css'
})
export class SearchFormComponent {

  @Output() searchedText = new EventEmitter<string>();

  searchText = '';

  onSearch() {
    this.searchedText.emit(this.searchText);
  }
}
