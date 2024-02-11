import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SalesDataChartService {

  constructor() { }

  //==================
  //SalesData chart
  //==================
  //ng2-chart
  //Sample Data:
  /* ["22-12-2019","23-12-2019","24-12-2019","25-12-2019","26-12-2019"]
     [
      { data: [2, 5, 0, 1, 5], label: "Cash On Delivery" },
      { data: [3, 3, 1, 2, 6], label:  "Credit Card" },
      { data: [1, 5, 6, 1, 6], label:  "Debit Card" },
      { data: [2, 1, 1, 1, 5], label: "Master Card"},
      { data: [5, 4, 2, 6, 2], label: "Paypal" }
     ]
  */

    private salesChartData:any[] = [];
    private salesChartDataBody:any = []
  
    getChartSalesData(apiData:any[]){
  
      let dates = [];
      let paymentTypes = []
  
      //extract unique dates and orderStatus from apiData
      dates = apiData.map(x=>x.date).filter((value,index,array)=> array.indexOf(value) === index);
      paymentTypes = apiData.map(x=>x.paymentType).filter((value,index,array)=> array.indexOf(value) === index);

      //calculate date wise payment type's count
      for (let paymentType of paymentTypes) {
        let chartBodyRowCounts = [];
    
        for (let date of dates) {
          let count = apiData.filter(x=>x.paymentType === paymentType && x.date === date)
                             .reduce((total,x)=> total+x.counts ,0)

          chartBodyRowCounts.push(count);
        }
    
        // create chartRow inside the paymentType loop
        let chartBodyRow = { data: chartBodyRowCounts, label: paymentType };
        
        // add chartRow to main Body[]
        this.salesChartDataBody.push(chartBodyRow);
      }
    
      //Create main salesChartData []
      this.salesChartData.push({header: dates, body:this.salesChartDataBody});

      console.log("salesDataApiData: ",apiData);
      //console.log("orderStatus: ",paymentTypes);
      //console.log("dates: ",dates);
      //console.log("chartHeader: ",dates);
      console.log("salesDataChartDataBody: ",this.salesChartDataBody);  
      console.log("salesCharatData: ",this.salesChartData);

      return this.salesChartData;
    }
}
