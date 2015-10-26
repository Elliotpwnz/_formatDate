# _formatDate project

## Description

This project is part of the Verbesey Framework support libraries for web development, which contain both server and client side components, all written in javascript.

Component names typically begin with the underscore character for easy recognition.

_fomatDate is an all purpose date format conversion routine.  It accepts dates in various formats and returns them reformated as specified in the formats parameters.  For example _formatDate("20050203","YYYYMMDD","M/D/Y") would return 2/3/2005

It may take 0,1,3 or 4 parameters as follows:

   With no parameters it returns the current date/time in standard js format.
   With 1 parameter it returns the current date/time in the format specified by the parameter as described below.
   The full parameter list is _formatDate(input,inputFormat,outputFormat,errorFunction) 

## Usage Guide

Acceptable input and output formats are described below.

### ---Input Formats---
The following input formats will use 10/23/2015 1:30pm as the example date.

* YYMMDD - 151023
* YYYYMMDD - 20151023
* YYYYMMDD HH:MM - 20151023 13:30
* MM-DD-YYYY - 10-23-2015
* M/D/Y - 10/23/15
* YYYY-MM - 2015-10
* [] - [2015, 10, 23, 13, 30, 23] - Accepts up to 6 elements - y,m,d,h,n,s
* RS - Accepts SQL result set

### ---Output Formats---
The following output formats will user 5/25/2015 7:45am as the example date.

Output formats work a little differently than input formats, and can be syntaxed 
in a freeform manner. The following date options can be combined to create a 
customizable date format.

##### Years
* YYYY - 2015
* YY - 15
* Y - 15 (single digit if first digit is 0)

##### Months
* MMMM - May
* MMM - Oct.
* MM - 05
* M - 5

##### Days
* DDDD - Twenty-Fifth
* DDD - 25th
* DD - 25
* D - 25 (single digit if first digit is 0)

##### Weeks
* WWWW - Monday
* WWW - Mon.
* W - 1

##### Hours
* HHH - 7am
* HH - 07
* H - 7

##### Minutes
* NNN - 45am
* NN - 45
* N - 45 (single digit if first digit is 0)

##### Seconds
* SSS - 23am
* SS - 23
* S - 23 (single digit if first digit is 0)

We can also combine these date options to create unique formats.

* MMM DDD - May 25th
* H:NNN - 7:45am
* H:MM:SSS - 7:45:23am
* HHH - 7am
* MMMM YYYY - May 2015
* MMM DDD, YYYY - May 25, 2015

You'll notice that you have free reign to use unreserved characters in your date format.
Try experimenting with commas, parenthesis, hyphens, underlines, etc. to create your 
own unique date formats!