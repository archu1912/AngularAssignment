import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, FormArray, FormBuilder, Validators } from '@angular/forms';
import { ProductService } from './product.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [
    ProductService
  ]
})
export class AppComponent implements OnInit {
  public productForm: FormGroup;
  public productList: any;

  constructor(private fb: FormBuilder, private prodService: ProductService) {}

  ngOnInit() {
    this.productForm = this.fb.group({
      products: this.fb.array([this.createProduct()])
    });
    this.getProducts();
  }

  // returns all form groups under products
  get productFormGroup() {
    // console.log('form: ', this.productForm)
    return this.productForm.get('products') as FormArray;
  }

  // product formgroup
  createProduct(): FormGroup {
    return this.fb.group({
      product_name: ['', Validators.required],
      quantity: ['', [Validators.required, Validators.pattern('^[0-9]{0,3}$')]],
      rating: ['', [Validators.required, Validators.pattern('^[0-9]{0,2}$')]],
      amount: ['', [Validators.required, Validators.pattern('^[0-9]+(\.[0-9]{1,2})?$')]]
    });
  }

  // add a product form group
  addProduct() {
    this.productFormGroup.push(this.createProduct());
  }

  // remove contact from group
  removeProduct(index) {
    this.productFormGroup.removeAt(index);
  }

  // method triggered when form is submitted
  submit() {
    console.log('product submit values: ', this.productForm.value);
    const params = this.productForm.value.products;
    this.prodService.addproducts(params).subscribe((data: any) => {
      alert('Product successfully Added');
      this.productForm.reset();
      console.log('product added', data);
      window.location.reload();

    }, (error: HttpErrorResponse) => {
      alert('Something went wrong...');
      console.log('error: ', error);
    });
  }

  getProducts() {
    this.prodService.getAll().subscribe((data: any)=>{
      this.productList = data.products;
      console.log(this.productList);
    });
  }
}
