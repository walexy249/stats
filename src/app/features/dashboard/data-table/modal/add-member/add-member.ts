import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormGroup, NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { BrnDialogImports } from '@spartan-ng/brain/dialog';
import { BrnSelectImports } from '@spartan-ng/brain/select';
import { HlmButtonImports } from '@spartan-ng/helm/button';
import { HlmDialogImports } from '@spartan-ng/helm/dialog';
import { HlmInputImports } from '@spartan-ng/helm/input';
import { HlmLabelImports } from '@spartan-ng/helm/label';
import { HlmSelectImports } from '@spartan-ng/helm/select';

import { BrnSheet } from '@spartan-ng/brain/sheet';
import { TeamMemberService } from '../../../../../shared/service/team-member.service';

@Component({
  selector: 'app-add-member',
  imports: [
    CommonModule,
    BrnDialogImports,
    HlmDialogImports,
    HlmLabelImports,
    HlmInputImports,
    HlmButtonImports,
    BrnSelectImports,
    HlmSelectImports,
    ReactiveFormsModule,
  ],
  templateUrl: './add-member.html',
})
export class AddMember {
  constructor() {}
  @ViewChild('modalRef', { static: true }) modalRef!: BrnSheet;

  private fb = inject(NonNullableFormBuilder);
  private teamMemberService = inject(TeamMemberService);

  type!: any;
  id: any;
  heading!: string;
  subtext!: string;
  form: FormGroup = this.fb.group({
    name: [null, [Validators.required]],
    email: [null, [Validators.required]],
    role: [null, [Validators.required]],
  });
  openSheet(type: 'add' | 'edit', id?: any) {
    this.type = type;
    this.setModalTitle();
    if (this.type === 'edit') {
      this.id = id;
      const member = this.teamMemberService.getMemberById(id);
      this.form.patchValue({
        name: member?.name,
        email: member?.email,
        role: member?.role,
      });
    }
    this.modalRef.open();
  }

  setModalTitle() {
    if (this.type === 'add') {
      this.heading = 'Add member';
      this.subtext = 'Fill in the option to add a new member';
    } else {
      this.heading = 'Edit member';
      this.subtext = 'Update member record';
    }
  }

  onSubmit() {
    if (this.type === 'add') {
      this.teamMemberService.addMember(this.form.value);
    } else {
      this.teamMemberService.updateMember(this.id, this.form.value);
    }
    this.modalRef.close();
  }

  onSheetChange(event: any) {
    if (event === 'closed') {
      this.form.reset();
      this.id = null;
      this.type = null;
    }
  }
}
