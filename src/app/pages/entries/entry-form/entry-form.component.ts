import { Component, OnInit, AfterContentChecked } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";

import { Entry } from "../shared/entry.model";
import { EntryService } from "../shared/entry.service";
import { switchMap } from "rxjs/operators";
import toastr from "toastr"; 

@Component({
  selector: 'app-entry-form',
  templateUrl: './entry-form.component.html',
  styleUrls: ['./entry-form.component.css']
})
export class EntryFormComponent implements OnInit, AfterContentChecked {
  
  currentAction: string;
  entryForm: FormGroup;
  pageTitle: string;
  serverErrorMessages: string[] = null;
  submittingForm: boolean = false;
  entry: Entry = new Entry();

  constructor(
    private entryService: EntryService,
    private route: ActivatedRoute,
    private router: Router,
    private FormBuilder: FormBuilder
  ) { }

  ngOnInit() {
    this.setCurrentAction();
    this.buildEntryForm();
    this.loadEntry();
  }
  
  ngAfterContentChecked() {
     this.setPageTitle();
  }

  submitForm() {
     this.submittingForm = true;
     if (this.currentAction == "new") {
         this.createEntry();
     } else {
         this.updateEntry();
     }
  }

  private setCurrentAction(){
     if (this.route.snapshot.url[0].path ==  "new") {
         this.currentAction = "new";
     } else {
         this.currentAction = "edit"; 
     }
  }
  
  private buildEntryForm(){
     this.entryForm = this.FormBuilder.group({
       id: [null],
       name: [null, [Validators.required, Validators.minLength(2)]],
       description: [null],
       type: [null, [Validators.required]],
       amount: [null, [Validators.required]],
       date: [null, [Validators.required]],
       paid: [null, [Validators.required]],
       categoryId: [null, [Validators.required]] 
     })
  }
  
  private loadEntry(){
      if (this.currentAction == "edit") {
          this.route.paramMap.pipe(
            switchMap(params => this.entryService.getById( + params.get("id")))
          )
          .subscribe(
            (entry) => {
              this.entry = entry;
              this.entryForm.patchValue(entry)
            },
            (error) => alert('Ocorreu um erro no servidor.')
          )
      }
  }

  private setPageTitle() {
    if (this.currentAction == "new") {
        this.pageTitle = "Incluindo novo lançamento.";
    } else {
      const entryName = this.entry.name || ""
      this.pageTitle = "Editando lançamento: " + entryName;
    }
  }
  
  private createEntry() {
     const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
     this.entryService.create(entry)
     .subscribe(
       entry => this.actionsForSuccess(entry),
       error => this.actionsForError(error)
     )

  }
  
  private updateEntry() {
    const entry: Entry = Object.assign(new Entry(), this.entryForm.value);
     this.entryService.update(entry)
     .subscribe(
      entry => this.actionsForSuccess(entry),
      error => this.actionsForError(error)
    )
  }

  private actionsForSuccess(entry: Entry) {
     toastr.success("-Operação efetuada com sucesso.");
     this.router.navigateByUrl("entries", {skipLocationChange: true}).then(
        () => this.router.navigate(["entries", entry.id, "edit"])
     )
  }

  private actionsForError(error) {
     toastr.error("-Operação finalizou com erro.");
     this.submittingForm = false;
     if (error.status === 422) {
         this.serverErrorMessages = JSON.parse(error._body).errors;
     } else {
         this.serverErrorMessages = ["Falha na comunicação com o servidor."]
     }
  }
}
