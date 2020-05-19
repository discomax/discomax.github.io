# US-Airports-ETL

### FAA Airport Data

For this project, I obtained data on all airports in the United States (including US territories) from the [Federal Aviation Administration](https://www.faa.gov/airports/airport_safety/airportdata_5010/#importers). The raw data came in .tsv files (tab separated) split into four categories: facilities, runways, schedules and remarks. 

Using the Python Pandas library, I cleansed and organized the data, by dropping columns, renaming columns and converting data within the columns. The new data is written to tsv files. The data descriptions written to a multi-tab exel file.

Finally, I reformatted the dataframes into dictioaries and loaded them to a mongodb database named us_airports with four collections naturally labeled facilites, runways, schedules and remerks. 

This data can now be used for analysis or use in an application.

