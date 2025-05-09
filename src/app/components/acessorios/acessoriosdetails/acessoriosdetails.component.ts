import {
  Component,
  EventEmitter,
  Input,
  Output,
  TemplateRef,
  ViewChild,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MdbFormsModule } from 'mdb-angular-ui-kit/forms';
import { Acessorio } from '../../../models/acessorio';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { AcessorioService } from '../../../services/acessorio.service';
import { MdbModalRef, MdbModalService } from 'mdb-angular-ui-kit/modal';
import { MarcaslistComponent } from '../../marcas/marcaslist/marcaslist.component';

@Component({
  selector: 'app-acessoriosdetails',
  standalone: true,
  imports: [MdbFormsModule, FormsModule, MarcaslistComponent],
  templateUrl: './acessoriosdetails.component.html',
  styleUrl: './acessoriosdetails.component.scss',
})
export class AcessoriosdetailsComponent {
  @Input('acessorio') acessorio: Acessorio = new Acessorio('');
  @Output('retorno') retorno = new EventEmitter<any>();
  router = inject(ActivatedRoute);
  router2 = inject(Router);

  modalService = inject(MdbModalService);
  @ViewChild('modalMarcas') modalMarcas!: TemplateRef<any>;
  modalRef!: MdbModalRef<any>;

  acessorioService = inject(AcessorioService);

  constructor() {
    let id = this.router.snapshot.params['id'];
    if (id > 0) {
      this.findById(id);
    } else {
      if (this.acessorio.id > 0) this.findById(id);
    }
  }

  findById(id: number) {
    this.acessorioService.findById(id).subscribe({
      next: (retorno) => {
        this.acessorio = retorno;
      },
      error: (erro) => {
        Swal.fire({
          title: 'Ocorreu um erro',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      },
    });
  }

  save() {
    if (this.acessorio.id > 0) {
      this.acessorioService
        .update(this.acessorio, this.acessorio.id)
        .subscribe({
          next: (mensagem) => {
            Swal.fire({
              title: mensagem,
              icon: 'success',
              confirmButtonText: 'Ok',
            });
            this.retorno.emit(this.acessorio);
          },
          error: (erro) => {
            Swal.fire({
              title: 'Ocorreu um erro',
              icon: 'error',
              confirmButtonText: 'Ok',
            });
          },
        });
    } else {
      this.acessorioService.save(this.acessorio).subscribe({
        next: (mensagem) => {
          Swal.fire({
            title: mensagem,
            icon: 'success',
            confirmButtonText: 'Ok',
          });
          this.retorno.emit(this.acessorio);
        },
        error: (erro) => {
          Swal.fire({
            title: 'Ocorreu um erro',
            icon: 'error',
            confirmButtonText: 'Ok',
          });
        },
      });
    }
  }
}
