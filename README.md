_formatDate project

This project is part of the Verbesey Framework support libraries for web development, which contain both server and client side components, all written in javascript.

Component names typically begin with the underscore character for easy recognition.

_fomatDate is an all purpose date format conversion routine.  It accepts dates in various formats and returns them reformated as specified in the formats parameters.  For example _formatDate("20050203","YYYYMMDD","M/D/Y") would return 2/3/2005

It may take 0,1,3 or 4 parameters as follows:

   With no parameters it returns the current date/time in standard js format.
   With 1 parameter it returns the current date/time in the format specified by the parameter as described below.
   The full parameter list is _formatDate(input,inputFormat,outputFormat,errorFunction) 





Acceptable input and output formats are described below.


