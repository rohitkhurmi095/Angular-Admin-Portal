import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class OrderStatusChartService {

  constructor() { }

  //==================
  //OrderStatus chart
  //==================
  //ng2-google-chart
  //Sample Data:
  /*
    ['Date',      'Cancelled', 'Delivered', 'Processing','Shipped'],
    ['22-12-2019',      1    ,    2       ,      1      ,    2    ],
    ['23-12-2019',      1    ,    2       ,      1      ,     2   ],
    ['24-12-2019',      1    ,    2       ,      1      ,     2   ],
    ['25-12-2019',      1    ,    2       ,      1      ,     2   ],
    ['26-12-2019',      1    ,    2       ,      1      ,     2   ]
  */

  private orderStatusChartData:any[] = [];
  
  getChartOrderStatus(apiData:any[]){

    let dates = [];
    let orderStatus = []
    let chartHeader = ["Date"];

    //extract unique dates and orderStatus from apiData
    dates = apiData.map(x=>x.date).filter((value,index,array)=> array.indexOf(value) === index);
    orderStatus = apiData.map(x=>x.orderStatus).filter((value,index,array)=> array.indexOf(value) === index);

    //Add unique status in chartHeader
    for(let status of orderStatus){
      chartHeader.push(status);
    }
    //Add chartHeader to main []
    this.orderStatusChartData.push(chartHeader);


    for(let date of dates){
      let chartBodyRow = [];
      //Adding date to 1st element of every row
      chartBodyRow.push(date);

      //adding '0' as default value to remaining elemetnts (based on ordersStatus header) for every row
      for(let status of orderStatus){
        chartBodyRow.push(0);
      }

      //calculate counts for orderStatus based on date for every row
      for(let i in orderStatus){
        for(let j in apiData){
          if(orderStatus[i] === apiData[j].orderStatus && date === apiData[j].date){
            chartBodyRow[parseInt(i)+1] = apiData[j].counts;
          }
        }
      }
      //console.log("chartBodyRow: ",chartBodyRow);

      //Add chartRowBody to main []
      this.orderStatusChartData.push(chartBodyRow);
    }
    
    console.log("orderStatusApiData: ",apiData);
    //console.log("orderStatus: ",orderStatus);
    //console.log("dates: ",dates);
    //console.log("chartHeader: ",chartHeader);
    console.log("orderStatusChartData: ",this.orderStatusChartData);

    return this.orderStatusChartData;
  }
}
