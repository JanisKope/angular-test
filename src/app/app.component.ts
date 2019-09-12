import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http'
import { FormControl, FormGroup, Validators, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  fromAmount = 1;
  fromSelected: string;
  toAmount = 1;
  toSelected: string;
  currencies: any;
  currenciesCodes: any[];
  newToValue: any;
  reverseCalc = false;
  disableSelect1 = true;
  disableSelect2 = false;

  constructor(
    private http: HttpClient
  ) {}

  ngOnInit() {
    this.loadCurrencies();
  }

  loadCurrencies(base?: string) {
    // Base currency query parameter isn't allowed for free plan. :(
    this.http.get('https://openexchangerates.org/api/latest.json?app_id=cb7dfcfb093f48739207d550ff2a22b0' + (base ? '&base=' + base : '')).subscribe((data: any) => {
      this.currencies = data.rates;
      this.fromSelected = data.base;
      this.currenciesCodes = Object.keys(data.rates);
      this.toSelected = this.currenciesCodes[0];
      this.toAmount = this.fromAmount * this.currencies[this.toSelected];
    });
  }

  updateConvertedValue() {
    // I decided to create a condition that calculates currency value in USD and does the same multiplication.
    if (!this.reverseCalc) { 
      this.toAmount = this.fromAmount * this.currencies[this.toSelected]; 
    } else {
      const valueInUsd = 1 / this.currencies[this.fromSelected];
      this.toAmount = this.fromAmount * valueInUsd;
    }
  }

  switchCurrency() {
    this.reverseCalc = !this.reverseCalc;
    this.disableSelect1 = !this.disableSelect1;
    this.disableSelect2 = !this.disableSelect2;
    const selectedCurrencies = [this.fromSelected, this.toSelected];
    this.fromSelected = selectedCurrencies[1];
    this.toSelected = selectedCurrencies[0];
    this.updateConvertedValue();
  }
}
