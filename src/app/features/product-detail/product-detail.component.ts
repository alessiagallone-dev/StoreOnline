import { Component, OnInit } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
import { FormArray, FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProductService } from "./../../core/services/product.service";
import { Product } from "./../../models/product.model";
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { MatChipInputEvent, MatDialog } from "@angular/material";
import { DialogData, ModalComponent } from "src/app/shared/modal/modal.component";

@Component({
  selector: "app-product-detail",
  templateUrl: "./product-detail.component.html",
  styleUrls: ["./product-detail.component.scss"],
})
export class ProductDetailComponent implements OnInit {
  readonly separatorKeysCodes = [ENTER, COMMA] as const;
  reactiveKeywords;
  productForm: FormGroup;
  product: Product | undefined;
  isEditing = false;
  isAdd = false;

  constructor(
    private route: ActivatedRoute,
    private productService: ProductService,
    private fb: FormBuilder,
    private _dialog: MatDialog
  ) { }

  ngOnInit() {
    const productId = this.route.snapshot.paramMap.get("id");
    this.isEditing = productId && productId !== "0";
    if (this.isEditing) {
      this.isEditing = true;
      this.productService.getProductById(productId).subscribe({
        next: (product) => {
          this.product = product;
          this.createForm(product);
        },
        error: (error) => {
          this._dialog.open(ModalComponent, {
            data: {
              message: `${error.message}`,
              title: 'Attenzione',
              confirmText: 'Chiudi',
              showConfirmBtn: true,
              showCancelBtn: false
            },
            panelClass: 'error'
          });
          console.error("Errore recupero dettaglio prodotto", error);
        },
      });
    } else {
      this.isAdd = true;
      this.createForm();
    }
  }

  toggleEdit() {
    // Sono in aggiuta nuovo prodotto
    if (this.isAdd) {
      if (this.productForm.valid) {
        const prodotto: Product = this.productForm.value;
        this.productService.createProduct(prodotto).subscribe(
          response => {

            const dialogRef = this._dialog.open<ModalComponent, DialogData, any>(ModalComponent, {
              data: {
                message: `Salvataggio <strong>${prodotto.title}</strong> avvenuto con successo!`,
                title: 'Conferma Salvataggio',
                confirmText: 'Chiudi',
                showConfirmBtn: true,
                showCancelBtn: false
              },
              panelClass: 'success'
            });

            dialogRef.afterClosed().subscribe(result => {
              if (result) {
                this.productForm.disable();
                this.isEditing = !this.isEditing;
              }
            });

          },
          error => {
            this._dialog.open(ModalComponent, {
              data: {
                message: `${error.message}`,
                title: 'Attenzione',
                confirmText: 'Chiudi',
                showConfirmBtn: true,
                showCancelBtn: false
              },
              panelClass: 'error'
            });
          }
        );
      } else {
        this.productForm.markAllAsTouched();
      }
    } else {
      // Sono in modifica, non posso salvare, ma abilito per simulare modifica
      this.isEditing = !this.isEditing;
      if (!this.isEditing) {
        this.productForm.enable();
      }
    }
  }

  private createForm(product?: Product) {
    this.productForm = this.fb.group({
      title: [
        { value: (product && product.title) || "", disabled: this.isEditing },
        Validators.required,
      ],
      category: [
        {
          value: (product && product.category) || "",
          disabled: this.isEditing,
        },
        Validators.required,
      ],
      price: [
        { value: (product && product.price) || "", disabled: this.isEditing },
        [Validators.min(0)],
      ],
      employee: [
        {
          value: (product && product.employee) || "",
          disabled: this.isEditing,
        },
      ],
      description: [
        {
          value: (product && product.description) || "",
          disabled: this.isEditing,
        },
      ],
      reviews: this.fb.array(
        (product && product.reviews || []).map(review => this.fb.control(review))
      ),
    });
  }

  get reviews() {
    return this.productForm.get('reviews') as FormArray;
  }

  addReview(event: MatChipInputEvent) {
    const review = (event.value || '').trim();
    if (review)
      this.reviews.push(this.fb.control(review));
    event.input.value = '';
  }

  removeReview(index: number) {
    this.reviews.removeAt(index);
  }


}

