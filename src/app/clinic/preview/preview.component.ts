import { Component, Input, OnInit, SimpleChanges } from '@angular/core';

@Component({
  selector: 'app-preview',
  templateUrl: './preview.component.html',
  styleUrls: ['./preview.component.css']
})
export class PreviewComponent implements OnInit {
  @Input() data: {
    title: string,
    data
  };

  title: string;
  previewData: any;

  constructor() { }

  ngOnInit(): void {
    if (this.data.title == "medication") {
      this.title = "Medications";
    } else if (this.data.title == "vitals") {
      this.title = "Vitals";
    } else if (this.data.title == "postOp") {
      this.title = "Post Operative Note";
    } else if (this.data.title == "fluidBalance") {
      this.title = "Fluid Balance";
    } else if (this.data.title == "labTest") {
      this.title = "Lab. Request";
    }
    this.previewData = this.data.data;
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.ngOnInit();
  }
}
