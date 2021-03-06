/*
Copyright � 2010�2015 Herbert Verbesey 
All rights reserved. 
*/

function _nn(n){ // intended for formatting day, months, hours, minutes and seconds
   // accepts a number between 0 and 99 inclusive and returns a two character string with leading zero if required
   if (isNaN(n)) return "00"
   if (Number(n)>9) return String(n).slice(0,2)
   return "0"+String(n).slice(0,1)
}

var _months = ["Jan.","Feb.","Mar.","Apr.","May","June","July","Aug.","Sept.","Oct.","Nov.","Dec."] // zero based
var _fullMonths = ["January","February","March","April","May","June","July","August","September","October","November","December"]
    // zero based
var _daysOfWeek = new Array("Sun.","Mon.","Tue.","Wed.","Thu.","Fri.","Sat.");
var _daysOfWeekFull = new Array("Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday");
var _dayOfMonthFull = new Array("First","Second","Third","Fourth","Fifth","Sixth","Seventh","Eighth","Ninth","Tenth","Eleventh",
                                 "Twelfth","Thirteenth","Fourteenth","Fifteenth","Sixteenth","Seventeenth","Eighteenth","Nineteenth",
                                 "Twentieth","Twenty-First","Twenty-Second","Twenty-Third","Twenty-Fourth","Twenty-Fifth","Twenty-Sixth",
                                 "Twenty-Seventh","Twenty-Eighth","Twenty-Ninth", "Thirtieth", "Thirty-First");
var _mspDay = 86400000 // milli seconds per day

function _blankNull(txt){ 
   try { txt = unescape(String(txt)) } // in case txt is not a string
   catch (e) { txt = "ERR:"+e.message } // some objects can't be converted to a string
   if (txt=="null") return ""
   if (txt=="undefined") return "" 
   return txt
}

function _formatDate(input,inputFormat,outputFormat,errorFunction){
/*
This function accepts dates in various formats and returns them reformated as specified in the formats parameters

For example _formatDate("20050203","YYYYMMDD","M/D/Y") would return 2/3/2005

Acceptable input and output formats are described below.

_formatDate() may also be called with a single string parameter containing an output format, in which case the current date/time is returned in the requested format.
*/
   if (!errorFunction) errorFunction = function(msg){
      return "ERROR: " + msg +" in call to <i>_formatDate()</i>" 
   }

   function applyFormat(ar,format){ // ----------------- O U T P U T   F O R M A T S
      if (!format || typeof format != 'string') return ar
      var txt = ''
      FORMAT = format.toUpperCase()
      switch (FORMAT) {
      case "DATE":            return new Date(ar[0],ar[1]-1,ar[2],ar[3],ar[4],ar[5])
      case "#":               return new Date(ar[0],ar[1]-1,ar[2],ar[3],ar[4],ar[5]).getTime()
      case "": case "STRING": return String(new Date(ar[0],ar[1]-1,ar[2],ar[3],ar[4],ar[5]))
      case "[]":              return ar
      case "DATEPICKER":      return _nn(ar[1])+"/"+_nn(ar[2])+"/"+ar[0]
      case "SQL":             return "{ts '"+ar[0]+"-"+_nn(ar[1])+"-"+_nn(Math.max(1,ar[2]))+" "+_nn(ar[3])+":"+_nn(ar[4])+":"+_nn(ar[5])+"'}" 
            // odbc standard works for both Access and SQL Server
      
      default:
         var n = format.length -1
         var result = ''
         var suffix = ''
         var convert_MtoN_rangeLimit = -1
         for (var j=0; j<=n ; j++ ){
            switch (FORMAT.substr(j,1)){
            case "Y":
               if (FORMAT.substr(j,4) == "YYYY"){ // YYYY
                  result += ar[0]
                  j=j+3
                  continue
               }
               if (FORMAT.substr(j,2) == "YY"){ // YY
                  result += String(ar[0]).slice(2)
                  j++
                  continue
               }
               result += ar[0] // single Y
               continue

            case "M":
               if (j <= convert_MtoN_rangeLimit) { // M should be interpreted as minutes, not months
                  if (FORMAT.substr(j,2)=="MM"){ // 'MM' interpreted as 'NN'
                     result += _nn(ar[4])
                     j++
                     continue
                  }
                  result += ar[4] //Single 'M' interpreted as a single 'N'
                  continue

               }
               if (FORMAT.substr(j,4)=="MMMM"){
                  result += _fullMonths[ar[1]-1]
                  j = j+3
                  continue
               }
               if (FORMAT.substr(j,3)=="MMM"){
                  result += _months[ar[1]-1]
                  j = j+2
                  continue
               }
               if (FORMAT.substr(j,2)=="MM"){
                  result += _nn(ar[1])
                  j++
                  continue
               }
               result += ar[1] // single M
               continue

            case "D":
               if (ar[2]==0) { // omit missing day and comma if any
                  while (FORMAT.substr(j+1,1)=="D") j++
                  if (FORMAT.substr(j+1,1)==",") j++
                  continue
               }
               if (FORMAT.substr(j,4)=="DDDD"){
                  result += _dayOfMonthFull[ar[2]-1]
                  j=j+3
                  continue
               }
               if (FORMAT.substr(j,3)=="DDD"){
                  result +=_nn(ar[2])
                  switch (ar[2] % 10) {
                     case 1:  result += "st"; break;
                     case 2:  result += "nd"; break;
                     case 3:  result += "th"; break;
                     default: result += "th"; break;
                  }
                  j=j+2
                  continue
               }
               if (FORMAT.substr(j,2)=="DD"){
                  result += _nn(ar[2])
                  j++
                  continue
               }
               result += ar[2] // single D
               continue

            case "W":
               if (FORMAT.substr(j,4)=="WWWW"){
                  result += _daysOfWeekFull[new Date(ar[0],ar[1]-1,ar[2]).getDay()]
                  j=j+3
                  continue
               }
               if (FORMAT.substr(j,3)=="WWW"){
                  result += _daysOfWeek[new Date(ar[0],ar[1]-1,ar[2]).getDay()]
                  j=j+2
                  continue
               }
               result += new Date(ar[0],ar[1]-1,ar[2]).getDay() // single W
               continue

            case "H":

               if (FORMAT.substr(j,2)=="HH"){
                  result +=  _nn(ar[3])
                  j++
                  convert_MtoN_rangeLimit = j + 2
                  continue
               }
               //Single 'H' am/pm
               if (ar[3]>=12){
                  suffix="pm"
                  result += ar[3] - 12
               }
               else {
                  suffix = "am"
                  result += ar[3]
               }
               convert_MtoN_rangeLimit = j + 2
               continue

            case "N":
               if (FORMAT.substr(j,2)=="NN"){
                  result +=  _nn(ar[4])
                  j = j+1
                  continue
               }
               result += ar[4] //Single 'N'
               continue

            case "S":
               if (FORMAT.substr(j,2)=="SS"){
                  result +=  _nn(ar[5])
                  j = j+1
                  continue
               }
               result += ar[5] // Single 'S'
               continue

			case '"':
				while (format.substr(++j,1)!='"') {	result += format.substr(j,1) }
			    continue

            default: result += FORMAT.substr(j,1)
            }
         }
         return result + suffix
      
         return errorFunction('<u><b>'+format+'</b></u> not implemented as an output format')
      }
   }

//////////////////  BEGIN

   switch (arguments.length){
   case 0: return new Date() 
   case 1:  // first and only argument contains an output format
      var d = new Date()
      var ar = [d.getFullYear(),d.getMonth()+1,d.getDate(), d.getHours(),d.getMinutes(),d.getSeconds()]
      return applyFormat(ar,arguments[0]) 
   case 2: return errorFunction(arguments.length +" arguments not valid")
   default: break // normal case continue below
   }

   var ar = [0,0,0,0,0,0]
   if (Object.prototype.toString.call(input)=== '[object Array]'){ // array input
      switch (inputFormat.toUpperCase()){  // ----------------- I N P U T  ARRAY  F O R M A T S
         case "[]":
            for (var j=0; j<input.length ; j++) ar[j] = input[j]
            break

         case "YYYY,MMDD":
            ar[0] = input[0]
            try { ar[0] = Number(input[0]); } catch (e) { }
            try { ar[1] = Number(String(input[1]).slice(0,2)); } catch (e) { ar[1]=1 }
            try { ar[2] = Number(String(input[1]).slice(2,4)); } catch (e) { ar[2]=1 }
            break;

         default:
            return '<i>'+inputFormat+'</> input type not implemented for array input.'
      }
   }
   else { // normal case
      input = _blankNull(input) // converts rs to string
      if (input=="") return ""  // added 3/31/15
      switch (inputFormat.toUpperCase()){  // ----------------- I N P U T   F O R M A T S
      case "#": input = Number(input) // fall thru
      case "":  
      case "STRING": 
      case "RS":  // sql result set
         var d = input ? new Date(input) : new Date()
         ar = [d.getYear(),d.getMonth()+1,d.getDate(), d.getHours(),d.getMinutes(),d.getSeconds()]
         break;

      case "[]": // either actual array of up to six elements or a comma delimited string of such elements -- y,m,d,h,m,s
         if (typeof input=="string") input = input.split(",")
         for (var j=0; j<input.length ; j++) ar[j] = input[j]
         break

      case "YYMMDD":  // if month or day is missing use first day
         try { ar[0] = 2000+Number(input.slice(0,2)); } catch (e) { }
         try { ar[1] = Number(input.slice(2,4)); } catch (e) { ar[1]=1 }
         try { ar[2] = Number(input.slice(4,6)); } catch (e) { ar[2]=1 }
         break

      case "YYYYMMDD":  // if month or day is missing use first day
         try { ar[0] = Number(input.slice(0,4)); } catch (e) { }
         try { ar[1] = Number(input.slice(4,6)); } catch (e) { ar[1]=1 }
         try { ar[2] = Number(input.slice(6,8)); } catch (e) { ar[2]=1 }
         break

      case "YYYYMMDD HH:MM":
         ar[0] = Number(input.slice(0,4));  ar[1] = Number(input.slice(4,6)); ar[2] = Number(input.slice(6,8))
         ar[3] = Number(input.slice(9,11)); ar[4] = Number(input.slice(12,14))
         break

      case "MM-DD-YYYY":     
         var x = input.split("-")
         ar[0] = Number(x[2]);  ar[1] = Number(x[0]); ar[2] = Number(x[1]) 
         break

      case "DATEPICKER": // can be followed by an optional HH:MM
      case "MM/DD/YYYY":
      case "M/D/Y":
         var temp = input.split(" ")
         input = temp[0]
         if (temp.length==2 && temp[1].indexOf(":")>=0){
             temp = temp[1].split(":")
             ar[3] = temp[0] // hour
             ar[4] = temp[1] // minute
         }
         var x = input.split("/")
         ar[0] = Number(x[2]);  ar[1] = Number(x[0]); ar[2] = Number(x[1])
         break

      case "YYYY-MM":
         var x = input.split("-")
         ar[0] = Number(x[0]);  ar[1] = Number(x[1]);  
         break

      default: return errorFunction("unsupported input format: <u><b>"+inputFormat+'</b></u>')
      }
   }
   return applyFormat(ar,outputFormat)
}
