import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserGrowthChartService {

  constructor() { }

  
  //=================
  //UserGrowth chart
  //=================
  //ng2-google-chart
  //Sample Data:
  /*
   ['Date', 'Customer', 'Saller', 'Admin', 'Staff', 'Student', 'Developer', 'Employee', 'Seller', 'Vender']
   ['23-11-2019', 6, 0, 0, 0, 0, 0, 0, 0, 0]
   ['24-11-2019', 3, 0, 0, 0, 0, 0, 0, 0, 0]
   ['25-11-2019', 2, 0, 0, 0, 0, 0, 0, 0, 0]
   ['27-11-2019', 1, 0, 0, 0, 0, 0, 0, 0, 0]
   ['28-11-2019', 1, 0, 0, 0, 0, 0, 0, 0, 0]
  */

    private usersGrowthChartData:any[] = [];
  
    getChartUserGrowth(apiData:any[]){
  
      let dates = [];
      let userTypes = []
      let chartHeader = ["Date"];
  
      //extract unique dates and orderStatus from apiData
      dates = apiData.map(x=>x.date).filter((value,index,array)=> array.indexOf(value) === index);
      userTypes = apiData.map(x=>x.userType).filter((value,index,array)=> array.indexOf(value) === index);
  
      //Add unique userType in chartHeader
      for(let userType of userTypes){
        chartHeader.push(userType);
      }
      //Add chartHeader to main []
      this.usersGrowthChartData.push(chartHeader);

      
      for(let date of dates){
        let chartBodyRow = [];
        //Adding date to 1st element of every row
        chartBodyRow.push(date);

        for(let userType of userTypes){
          chartBodyRow.push(0);
        }
  
        //calculate counts for orderStatus based on date for every row
        for(let i in userTypes){
          for(let j in apiData){
            if(userTypes[i] === apiData[j].userType && date === apiData[j].date){
              chartBodyRow[parseInt(i)+1] = apiData[j].counts;
            }  
          }
        }
        //console.log("chartBodyRow: ",chartBodyRow);

        //Add chartRowBody to main []
        this.usersGrowthChartData.push(chartBodyRow);
      }
  
      console.log("userGrowthApiData: ",apiData);
      //console.log("orderStatus: ",userTypes);
      //console.log("dates: ",dates);
      //console.log("chartHeader: ",chartHeader);
      console.log("usersGrowthChartData: ",this.usersGrowthChartData);

      return this.usersGrowthChartData;
    }  
}
